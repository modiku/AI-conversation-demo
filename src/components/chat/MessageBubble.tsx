import type { Message } from "../../types";
import Avatar from "../common/Avatar";

interface MessageBubbleProps {
  message: Message;
  avatarUrl?: string | null;
  avatarEmoji?: string;
}

export default function MessageBubble({
  message,
  avatarUrl,
  avatarEmoji,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <Avatar
        avatarUrl={isUser ? null : avatarUrl}
        emoji={isUser ? "👤" : avatarEmoji}
        size="sm"
        className={isUser ? "bg-blue-100" : ""}
      />
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
