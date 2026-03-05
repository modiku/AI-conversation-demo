import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import { useI18n } from "../../hooks/useI18n";
import MessageBubble from "./MessageBubble";
import Avatar from "../common/Avatar";

interface MessageListProps {
  messages: Message[];
  sending: boolean;
  avatarUrl?: string | null;
  avatarEmoji?: string;
}

export default function MessageList({
  messages,
  sending,
  avatarUrl,
  avatarEmoji,
}: MessageListProps) {
  const { t } = useI18n();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 && !sending && (
        <div className="text-center py-20">
          <Avatar
            avatarUrl={avatarUrl}
            emoji={avatarEmoji}
            size="lg"
            className="mx-auto mb-3"
          />
          <p className="text-gray-400">{t("chat.startHint")}</p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          avatarUrl={avatarUrl}
          avatarEmoji={avatarEmoji}
        />
      ))}

      {sending && (
        <div className="flex gap-3">
          <Avatar
            avatarUrl={avatarUrl}
            emoji={avatarEmoji}
            size="sm"
          />
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
