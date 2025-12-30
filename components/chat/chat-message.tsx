import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/hooks/use-realtime-chat";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
  currentUserId?: string;
  onDelete?: (messageId: string) => Promise<void>;
}

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
  currentUserId,
  onDelete,
}: ChatMessageItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = isOwnMessage && currentUserId === message.user.id;

  const getRoleBadgeVariant = (role?: string) => {
    if (role === "admin") return "destructive";
    if (role === "moderator") return "default";
    return "secondary";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(message.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if message is a GIF
  const isGif = message.content.startsWith("[GIF] ");
  const gifUrl = isGif ? message.content.replace("[GIF] ", "") : null;

  return (
    <div
      className={cn("flex gap-2 mb-1", {
        "justify-end": isOwnMessage,
        "justify-start": !isOwnMessage,
        "mt-4": showHeader && !isOwnMessage,
      })}
    >
      {/* Left side avatar for incoming messages */}
      {!isOwnMessage && (
        <div className="shrink-0">
          {showHeader ? (
            <Avatar className="size-8">
              <AvatarImage src={message.user.avatar} alt={message.user.name} />
              <AvatarFallback className="text-xs">
                {getInitials(message.user.name)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="size-8" />
          )}
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn("max-w-[70%] flex flex-col", {
          "items-end": isOwnMessage,
          "items-start": !isOwnMessage,
        })}
      >
        {showHeader && (
          <div className="flex items-center gap-2 mb-1 px-2">
            <span className="font-medium text-xs text-muted-foreground">
              {message.user.name}
            </span>
            {message.user.role && (
              <Badge
                variant={getRoleBadgeVariant(message.user.role)}
                className="capitalize text-[10px] h-4 px-1.5"
              >
                {message.user.role}
              </Badge>
            )}
          </div>
        )}

        <div className="group relative">
          {isGif && gifUrl ? (
            <div className="relative">
              <Image
                unoptimized
                height={250}
                width={250}
                src={gifUrl}
                alt="GIF"
                className="max-w-62.5 max-h-62.5 rounded-xl shadow-md object-cover"
                loading="lazy"
              />
              <div
                className={cn("text-[10px] mt-1 flex items-center gap-1 px-2", {
                  "text-muted-foreground justify-end": isOwnMessage,
                  "text-muted-foreground justify-start": !isOwnMessage,
                })}
              >
                {new Date(message.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "py-2 px-3 text-sm wrap-break-word shadow-sm",
                isOwnMessage
                  ? "bg-primary text-primary-foreground rounded-l-2xl rounded-tr-2xl rounded-br-md"
                  : "bg-muted text-foreground rounded-r-2xl rounded-tl-2xl rounded-bl-md"
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div
                className={cn("text-[10px] mt-1 flex items-center gap-1", {
                  "text-primary-foreground/70 justify-end": isOwnMessage,
                  "text-muted-foreground justify-end": !isOwnMessage,
                })}
              >
                {new Date(message.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}

          {/* Delete button for own messages */}
          {canDelete && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute -top-2 size-6 opacity-0 group-hover:opacity-100 transition-opacity",
                    isOwnMessage ? "-left-8" : "-right-8"
                  )}
                  disabled={isDeleting}
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwnMessage ? "end" : "start"}>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  {isDeleting ? "Deleting..." : "Delete message"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Right side avatar for outgoing messages */}
      {isOwnMessage && (
        <div className="shrink-0">
          {showHeader ? (
            <Avatar className="size-8">
              <AvatarImage src={message.user.avatar} alt={message.user.name} />
              <AvatarFallback className="text-xs">
                {getInitials(message.user.name)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="size-8" />
          )}
        </div>
      )}
    </div>
  );
};
