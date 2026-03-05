import { useNavigate } from "react-router-dom";
import type { Role } from "../../types";

interface ChatSidebarProps {
  roles: Role[];
  currentRoleId: string;
}

export default function ChatSidebar({
  roles,
  currentRoleId,
}: ChatSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          角色列表
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => navigate(`/chat/${role.id}`)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition ${
              role.id === currentRoleId
                ? "bg-blue-50 border-r-2 border-blue-600"
                : ""
            }`}
          >
            <span className="text-lg">{role.avatar || "🤖"}</span>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  role.id === currentRoleId
                    ? "text-blue-700"
                    : "text-gray-700"
                }`}
              >
                {role.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {role.messageCount} 条消息
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
