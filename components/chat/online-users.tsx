"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface OnlineUsersProps {
  roomName: string;
}

export function OnlineUsers({ roomName }: OnlineUsersProps) {
  const supabase = useMemo(() => createClient(), []);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const channel = supabase.channel(`${roomName}-presence`, {
      config: {
        presence: {
          key: crypto.randomUUID(),
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        console.log("Presence sync - online users:", count, state);
        setOnlineCount(count);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        console.log("Presence channel status:", status);
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: crypto.randomUUID(),
          });
        }
      });

    return () => {
      console.log("Cleaning up presence channel");
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [roomName, supabase]);

  return (
    <Badge variant="outline" className="gap-2">
      <Users className="h-3 w-3" />
      <span>{onlineCount} online</span>
    </Badge>
  );
}
