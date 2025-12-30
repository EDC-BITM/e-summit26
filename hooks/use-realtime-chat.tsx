"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
  userRole?: string;
  userAvatar?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    role?: string;
    avatar?: string;
  };
  createdAt: string;
}

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({
  roomName,
  username,
  userRole,
  userAvatar,
  userId,
}: UseRealtimeChatProps & { userId?: string }) {
  // IMPORTANT: createClient() must be stable across renders.
  // If it changes every render, the channel effect will constantly resubscribe
  // and can get stuck in a perpetual "Connecting..." state.
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectAttempt, setConnectAttempt] = useState(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    let didSubscribe = false;
    let isCancelled = false;

    // Avoid calling setState() synchronously within an effect body.
    // Deferring prevents cascading renders while still resetting UI promptly.
    Promise.resolve().then(() => {
      if (!isCancelled) setIsConnected(false);
    });
    console.log(
      "Setting up Realtime channel for room:",
      roomName,
      "attempt:",
      connectAttempt
    );

    const newChannel = supabase.channel(roomName, {
      config: {
        broadcast: {
          self: false, // Disable receiving own messages to prevent duplicates
          ack: false, // Don't wait for acknowledgement to improve performance
        },
        presence: {
          key: userId || username,
        },
      },
    });

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
        console.log("Received broadcast message:", payload);
        console.log("Broadcast payload user data:", {
          id: payload.payload?.user?.id,
          name: payload.payload?.user?.name,
          role: payload.payload?.user?.role,
          avatar: payload.payload?.user?.avatar,
        });
        setMessages((current) => [...current, payload.payload as ChatMessage]);
      })
      .subscribe(async (status, err) => {
        console.log("Channel subscription status:", status, err);
        if (status === "SUBSCRIBED") {
          didSubscribe = true;
          setIsConnected(true);
          setConnectAttempt(0); // Reset attempt counter on success
          console.log("Successfully connected to room:", roomName);
        } else if (status === "CHANNEL_ERROR") {
          console.error("Channel error:", err);
          setIsConnected(false);
          didSubscribe = false;
        } else if (status === "TIMED_OUT") {
          console.error(
            "Channel subscription timed out - this may indicate network issues or Realtime not being enabled"
          );
          setIsConnected(false);
          didSubscribe = false;
        } else if (status === "CLOSED") {
          console.log("Channel closed");
          setIsConnected(false);
          didSubscribe = false;
        } else {
          setIsConnected(false);
        }

        // Auto-retry on failures (common on refresh/dev strict-mode remounts)
        if (
          !isCancelled &&
          (status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT" ||
            status === "CLOSED")
        ) {
          const nextAttempt = connectAttempt + 1;
          // backoff: 0.5s, 1s, 2s, 4s, 8s (cap)
          const delayMs = Math.min(
            8000,
            500 * Math.pow(2, Math.min(4, nextAttempt))
          );
          console.log("Scheduling reconnect in", delayMs, "ms");
          reconnectTimerRef.current = setTimeout(() => {
            setConnectAttempt((a) => a + 1);
          }, delayMs);
        }
      });

    // Defer setChannel to avoid cascading renders
    Promise.resolve().then(() => setChannel(newChannel));

    // Safety: if we never reach SUBSCRIBED, force a retry instead of showing
    // "Connecting to chat..." forever.
    const watchdog = setTimeout(() => {
      if (isCancelled) return;
      if (!didSubscribe) {
        console.warn("Realtime subscribe watchdog fired; forcing reconnect");
        setConnectAttempt((a) => a + 1);
      }
    }, 10_000);

    return () => {
      clearTimeout(watchdog);
      console.log("Cleaning up channel:", roomName);
      isCancelled = true;
      try {
        newChannel.unsubscribe();
      } catch {
        // ignore
      }
      supabase.removeChannel(newChannel);
      setChannel(null);
    };
  }, [roomName, supabase, connectAttempt]);

  const sendMessage = useCallback(
    async (content: string, messageId?: string) => {
      if (!channel || !isConnected) return;

      const message: ChatMessage = {
        id: messageId || crypto.randomUUID(),
        content,
        user: {
          id: userId || "",
          name: username,
          role: userRole,
          avatar: userAvatar,
        },
        createdAt: new Date().toISOString(),
      };

      // Add to local state immediately for instant feedback
      setMessages((current) => [...current, message]);

      // Broadcast to other users
      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });

      return message.id;
    },
    [channel, isConnected, username, userRole, userAvatar, userId]
  );

  return { messages, sendMessage, isConnected };
}
