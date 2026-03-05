import type { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
  avatar?: string;
}

export default function MessageBubble({ message, avatar }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser ? "bg-blue-100" : "bg-gray-100"
        }`}
      >
        {isUser ? "👤" : avatar || "🤖"}
      </div>
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
