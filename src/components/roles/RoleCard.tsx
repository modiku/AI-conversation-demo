import type { Role } from "../../types";
import { useI18n } from "../../hooks/useI18n";
import Avatar from "../common/Avatar";
import { personalityTraits } from "../../data/personalityTraits";

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
  const { t, locale } = useI18n();

  const traitLabels = (role.personalityTraits ?? []).map((tid) => {
    const trait = personalityTraits.find((p) => p.id === tid);
    return trait ? `${trait.emoji} ${locale === "zh" ? trait.zh : trait.en}` : tid;
  });

  return (
    <div
      onClick={() => onClick(role.id)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
    >
      {/* Illustration area */}
      {role.illustrationUrl ? (
        <div className="aspect-[2/3] bg-gradient-to-b from-blue-50 to-white overflow-hidden">
          <img
            src={role.illustrationUrl}
            alt={role.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ) : (
        <div className="h-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <span className="text-4xl">{role.avatar || "🤖"}</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar
              avatarUrl={role.avatarUrl}
              emoji={role.avatar}
              size="sm"
            />
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
              {t("role.edit")}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(role.id);
              }}
              className="text-xs px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            >
              {t("role.delete")}
            </button>
          </div>
        </div>

        {/* Trait pills */}
        {traitLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {traitLabels.map((label) => (
              <span
                key={label}
                className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {role.description || t("role.noDescription")}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {role.messageCount} {t("role.messages")}
          </span>
          {role.lastMessageAt && (
            <span>
              {t("role.lastChat")}:{" "}
              {role.lastMessageAt.toDate().toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
