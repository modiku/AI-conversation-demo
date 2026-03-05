import { useParams } from "react-router-dom";
import { useRoles } from "../hooks/useRoles";
import { useChat } from "../hooks/useChat";
import { useAutoFollowup } from "../hooks/useAutoFollowup";
import { useI18n } from "../hooks/useI18n";
import { useAuth } from "../hooks/useAuth";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import Avatar from "../components/common/Avatar";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export default function ChatPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const { user } = useAuth();
  const { t } = useI18n();
  const { roles, loading: rolesLoading } = useRoles();
  const currentRole = roles.find((r) => r.id === roleId) ?? null;
  const {
    messages,
    loading: chatLoading,
    sending,
    sendMessage,
    sendFollowup,
  } = useChat(roleId!, currentRole);

  useAutoFollowup({ messages, sending, sendFollowup });

  const handleClearHistory = async () => {
    if (!user || !roleId) return;
    if (!window.confirm(t("chat.clearConfirm"))) return;

    const messagesRef = collection(
      db,
      "users",
      user.uid,
      "roles",
      roleId,
      "messages"
    );
    const snapshot = await getDocs(messagesRef);
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
    await updateDoc(doc(db, "users", user.uid, "roles", roleId), {
      messageCount: 0,
    });
  };

  const handleExport = () => {
    if (!currentRole || messages.length === 0) return;

    const lines = messages.map((m) => {
      const sender = m.role === "user" ? t("chat.send") === "Send" ? "Me" : "我" : currentRole.name;
      const time = m.createdAt?.toDate?.()
        ? m.createdAt.toDate().toLocaleString()
        : "";
      return `[${sender}] ${time}\n${m.content}`;
    });

    const header = `${currentRole.name} - ${t("chat.export")}\n${"=".repeat(40)}\n\n`;
    const text = header + lines.join("\n\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentRole.name}_chat.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (rolesLoading || chatLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!currentRole) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">{t("chat.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <ChatSidebar roles={roles} currentRoleId={roleId!} />

      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              avatarUrl={currentRole.avatarUrl}
              emoji={currentRole.avatar}
              size="md"
            />
            <div>
              <h2 className="font-semibold text-gray-900">
                {currentRole.name}
              </h2>
              <p className="text-xs text-gray-400 truncate max-w-md">
                {currentRole.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={messages.length === 0}
              className="text-xs text-gray-400 hover:text-blue-500 disabled:opacity-30 transition"
            >
              {t("chat.export")}
            </button>
            <button
              onClick={handleClearHistory}
              className="text-xs text-gray-400 hover:text-red-500 transition"
            >
              {t("chat.clear")}
            </button>
          </div>
        </div>

        {/* Messages */}
        <MessageList
          messages={messages}
          sending={sending}
          avatarUrl={currentRole.avatarUrl}
          avatarEmoji={currentRole.avatar}
        />

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={sending} />
      </div>
    </div>
  );
}
