import { useParams } from "react-router-dom";
import { useRoles } from "../hooks/useRoles";
import { useChat } from "../hooks/useChat";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";

export default function ChatPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const { user } = useAuth();
  const { roles, loading: rolesLoading } = useRoles();
  const currentRole = roles.find((r) => r.id === roleId) ?? null;
  const { messages, loading: chatLoading, sending, sendMessage } = useChat(
    roleId!,
    currentRole
  );

  const handleClearHistory = async () => {
    if (!user || !roleId) return;
    if (!window.confirm("确定要清空当前角色的所有对话记录吗？")) return;

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
        <p className="text-gray-500">角色不存在或已被删除</p>
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
            <span className="text-xl">{currentRole.avatar || "🤖"}</span>
            <div>
              <h2 className="font-semibold text-gray-900">
                {currentRole.name}
              </h2>
              <p className="text-xs text-gray-400 truncate max-w-md">
                {currentRole.description}
              </p>
            </div>
          </div>
          <button
            onClick={handleClearHistory}
            className="text-xs text-gray-400 hover:text-red-500 transition"
          >
            清空对话
          </button>
        </div>

        {/* Messages */}
        <MessageList
          messages={messages}
          sending={sending}
          avatar={currentRole.avatar}
        />

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={sending} />
      </div>
    </div>
  );
}
