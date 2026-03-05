import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  sending: boolean;
  avatar?: string;
}

export default function MessageList({
  messages,
  sending,
  avatar,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 && !sending && (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">{avatar || "🤖"}</p>
          <p className="text-gray-400">发送一条消息开始对话吧</p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} avatar={avatar} />
      ))}

      {sending && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
            {avatar || "🤖"}
          </div>
          <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-md">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
