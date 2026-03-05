import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../hooks/useRoles";
import RoleList from "../components/roles/RoleList";
import RoleFormModal from "../components/roles/RoleFormModal";
import type { Role } from "../types";

export default function DashboardPage() {
  const { roles, loading, createRole, updateRole, deleteRole } = useRoles();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setModalOpen(true);
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm("确定要删除这个角色吗？所有对话记录也会被删除。")) {
      await deleteRole(roleId);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    description: string;
    systemPrompt: string;
    avatar: string;
  }) => {
    if (editingRole) {
      await updateRole(editingRole.id, data);
    } else {
      await createRole(data);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingRole(null);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的 AI 角色</h1>
        <button
          onClick={() => {
            setEditingRole(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          + 新建角色
        </button>
      </div>

      <RoleList
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClick={(roleId) => navigate(`/chat/${roleId}`)}
      />

      <RoleFormModal
        isOpen={modalOpen}
        editingRole={editingRole}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
