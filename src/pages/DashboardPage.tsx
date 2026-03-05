import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../hooks/useRoles";
import { useI18n } from "../hooks/useI18n";
import RoleList from "../components/roles/RoleList";
import RoleFormModal from "../components/roles/RoleFormModal";
import type { RoleFormDefaultData } from "../components/roles/RoleFormModal";
import GuidedOnboarding from "../components/onboarding/GuidedOnboarding";
import type { Role, Gender } from "../types";

export default function DashboardPage() {
  const { roles, loading, createRole, updateRole, deleteRole } = useRoles();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formDefaultData, setFormDefaultData] =
    useState<RoleFormDefaultData | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormDefaultData(null);
    setModalOpen(true);
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm(t("role.deleteConfirm"))) {
      await deleteRole(roleId);
    }
  };

  const handleSubmit = async (data: Parameters<typeof createRole>[0]) => {
    if (editingRole) {
      await updateRole(editingRole.id, data);
    } else {
      await createRole(data);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingRole(null);
    setFormDefaultData(null);
  };

  const handleCustomCreate = (gender: Gender, traits: string[]) => {
    setEditingRole(null);
    setFormDefaultData({ gender, personalityTraits: traits });
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Show guided onboarding when user has no roles
  if (roles.length === 0 && !modalOpen) {
    return <GuidedOnboarding onCustomCreate={handleCustomCreate} />;
  }

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.title")}
        </h1>
        <button
          onClick={() => {
            setEditingRole(null);
            setFormDefaultData(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          {t("dashboard.newRole")}
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
        defaultData={formDefaultData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
