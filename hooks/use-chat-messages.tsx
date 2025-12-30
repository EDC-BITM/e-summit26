"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchMessages } from "@/lib/chat/actions";
import { ChatMessage } from "@/hooks/use-realtime-chat";

interface UseChatMessagesProps {
  roomName: string;
  pageSize?: number;
}

export function useChatMessages({
  roomName,
  pageSize = 50,
}: UseChatMessagesProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // Initial load using useEffect without calling setState
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      const { messages: fetchedMessages, hasMore: more } = await fetchMessages(
        roomName,
        pageSize,
        0
      );

      if (!cancelled) {
        setMessages(fetchedMessages);
        setHasMore(more);
        setOffset(fetchedMessages.length);
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [roomName, pageSize]);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    const { messages: fetchedMessages, hasMore: more } = await fetchMessages(
      roomName,
      pageSize,
      offset
    );

    // Prepend older messages
    setMessages((prev) => [...fetchedMessages, ...prev]);
    setHasMore(more);
    setOffset((prev) => prev + fetchedMessages.length);
    setIsLoading(false);
  }, [roomName, pageSize, offset, hasMore, isLoading]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      // Check if message already exists
      if (prev.some((m) => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  const prependMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const uniqueNew = newMessages.filter((m) => !existingIds.has(m.id));
      return [...uniqueNew, ...prev];
    });
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    const { messages: fetchedMessages, hasMore: more } = await fetchMessages(
      roomName,
      pageSize,
      0
    );
    setMessages(fetchedMessages);
    setHasMore(more);
    setOffset(fetchedMessages.length);
    setIsLoading(false);
  }, [roomName, pageSize]);

  return {
    messages,
    isLoading,
    hasMore,
    loadMoreMessages,
    addMessage,
    prependMessages,
    refetch,
  };
}
