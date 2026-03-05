import type { Role } from "../../types";

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onClick: (roleId: string) => void;
}

export default function RoleCard({
  role,
  onEdit,
  onDelete,
  onClick,
}: RoleCardProps) {
  return (
    <div
      onClick={() => onClick(role.id)}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{role.avatar || "🤖"}</span>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
            {role.name}
          </h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(role);
            }}
            className="text-xs px-2 py-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            编辑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(role.id);
            }}
            className="text-xs px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
          >
            删除
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
        {role.description || "暂无描述"}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{role.messageCount} 条消息</span>
        {role.lastMessageAt && (
          <span>
            最近对话:{" "}
            {role.lastMessageAt.toDate().toLocaleDateString("zh-CN")}
          </span>
        )}
      </div>
    </div>
  );
}
