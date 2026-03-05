import { useState, type KeyboardEvent, type FormEvent } from "react";
import { useI18n } from "../../hooks/useI18n";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { t } = useI18n();
  const [content, setContent] = useState("");

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || disabled) return;
    onSend(content);
    setContent("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4"
    >
      <div className="flex gap-3 items-end max-w-3xl mx-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat.placeholder")}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 max-h-32"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = Math.min(target.scrollHeight, 128) + "px";
          }}
        />
        <button
          type="submit"
          disabled={disabled || !content.trim()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
        >
          {t("chat.send")}
        </button>
      </div>
    </form>
  );
}
