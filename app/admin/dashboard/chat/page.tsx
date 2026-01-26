import { RealtimeChat } from "@/components/chat/realtime-chat";
import { OnlineUsers } from "@/components/chat/online-users";
import { requireAdminOrModerator } from "@/lib/admin/auth";
import { getCurrentUser } from "@/lib/admin/current-user";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ChatPage() {
  await connection();

  // Require admin or moderator access
  try {
    await requireAdminOrModerator();
  } catch (error) {
    console.error("Access denied:", error);
    redirect("/auth/login?redirect=/admin/dashboard/chat");
  }

  // Get current user info
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/login?redirect=/admin/dashboard/chat");
  }

  return (
    <div className="@container/main flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Chat Room</h1>
        <p className="text-muted-foreground mt-2">
          Why WhatsApp? I literally made this for you...❤️
        </p>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Communication</CardTitle>
              <CardDescription>Real-time chat for Team EDC</CardDescription>
            </div>
            <OnlineUsers roomName="admin-moderator-chat" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0">
          <RealtimeChat
            roomName="admin-moderator-chat"
            username={currentUser.name}
            userRole={currentUser.role}
            userAvatar={currentUser.avatar}
            userId={currentUser.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
