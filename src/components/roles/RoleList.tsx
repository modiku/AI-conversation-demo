import type { Role } from "../../types";
import RoleCard from "./RoleCard";

interface RoleListProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onClick: (roleId: string) => void;
}

export default function RoleList({
  roles,
  onEdit,
  onDelete,
  onClick,
}: RoleListProps) {
  if (roles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🤖</p>
        <p className="text-gray-500 text-lg mb-2">还没有创建任何角色</p>
        <p className="text-gray-400 text-sm">
          点击上方「新建角色」按钮开始创建你的第一个 AI 角色
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
