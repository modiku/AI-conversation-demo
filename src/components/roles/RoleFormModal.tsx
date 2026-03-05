import { useState, useEffect, type FormEvent } from "react";
import { useI18n } from "../../hooks/useI18n";
import { useAuth } from "../../hooks/useAuth";
import { useImageUpload } from "../../hooks/useImageUpload";
import { personalityTraits } from "../../data/personalityTraits";
import ImageUploader from "../common/ImageUploader";
import type { Role, Gender } from "../../types";
import type { CreateRoleData } from "../../hooks/useRoles";

export interface RoleFormDefaultData {
  gender?: Gender;
  personalityTraits?: string[];
}

interface RoleFormModalProps {
  isOpen: boolean;
  editingRole: Role | null;
  defaultData?: RoleFormDefaultData | null;
  onClose: () => void;
  onSubmit: (data: CreateRoleData) => Promise<void>;
}

export default function RoleFormModal({
  isOpen,
  editingRole,
  defaultData,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { uploadImage, uploading: avatarUploading } = useImageUpload();
  const {
    uploadImage: uploadIllustration,
    uploading: illustrationUploading,
  } = useImageUpload();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [avatar, setAvatar] = useState("🤖");
  const [gender, setGender] = useState<Gender>("female");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [illustrationUrl, setIllustrationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingRole) {
      setName(editingRole.name);
      setDescription(editingRole.description);
      setSystemPrompt(editingRole.systemPrompt);
      setAvatar(editingRole.avatar || "🤖");
      setGender(editingRole.gender ?? "female");
      setSelectedTraits(editingRole.personalityTraits ?? []);
      setAvatarUrl(editingRole.avatarUrl ?? null);
      setIllustrationUrl(editingRole.illustrationUrl ?? null);
    } else {
      setName("");
      setDescription("");
      setSystemPrompt("");
      setAvatar("🤖");
      setGender(defaultData?.gender ?? "female");
      setSelectedTraits(defaultData?.personalityTraits ?? []);
      setAvatarUrl(null);
      setIllustrationUrl(null);
    }
  }, [editingRole, isOpen, defaultData]);

  const handleToggleTrait = (traitId: string) => {
    setSelectedTraits((prev) =>
      prev.includes(traitId)
        ? prev.filter((t) => t !== traitId)
        : prev.length < 5
          ? [...prev, traitId]
          : prev
    );
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    try {
      const fileName = `avatar_${Date.now()}_${file.name}`;
      const url = await uploadImage(file, `images/${user.uid}/${fileName}`);
      setAvatarUrl(url);
    } catch {
      alert(t("roleForm.uploadFailed"));
    }
  };

  const handleIllustrationUpload = async (file: File) => {
    if (!user) return;
    try {
      const fileName = `illust_${Date.now()}_${file.name}`;
      const url = await uploadIllustration(
        file,
        `images/${user.uid}/${fileName}`
      );
      setIllustrationUrl(url);
    } catch {
      alert(t("roleForm.uploadFailed"));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        description,
        systemPrompt,
        avatar,
        gender,
        personalityTraits: selectedTraits,
        avatarUrl,
        illustrationUrl,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isUploading = avatarUploading || illustrationUploading;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingRole ? t("roleForm.editTitle") : t("roleForm.createTitle")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar emoji + Name */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("roleForm.avatar")}
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-16 h-10 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("roleForm.name")} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder={t("roleForm.namePlaceholder")}
                />
              </div>
            </div>

            {/* Image uploads: Avatar + Illustration */}
            <div className="flex gap-4">
              <ImageUploader
                currentUrl={avatarUrl}
                onUpload={handleAvatarUpload}
                uploading={avatarUploading}
                label={t("roleForm.avatarUpload")}
                aspectRatio="square"
              />
              <ImageUploader
                currentUrl={illustrationUrl}
                onUpload={handleIllustrationUpload}
                uploading={illustrationUploading}
                label={t("roleForm.illustrationUpload")}
                aspectRatio="portrait"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("roleForm.gender")}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`px-4 py-2 rounded-lg border text-sm transition ${
                    gender === "female"
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 text-gray-600 hover:border-pink-300"
                  }`}
                >
                  👩 {t("roleForm.female")}
                </button>
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`px-4 py-2 rounded-lg border text-sm transition ${
                    gender === "male"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  👨 {t("roleForm.male")}
                </button>
              </div>
            </div>

            {/* Traits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("roleForm.traits")}
              </label>
              <div className="flex flex-wrap gap-2">
                {personalityTraits.map((trait) => {
                  const isSelected = selectedTraits.includes(trait.id);
                  const isDisabled = !isSelected && selectedTraits.length >= 5;
                  return (
                    <button
                      key={trait.id}
                      type="button"
                      onClick={() => !isDisabled && handleToggleTrait(trait.id)}
                      disabled={isDisabled}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        isSelected
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : isDisabled
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 text-gray-600 hover:border-purple-300"
                      }`}
                    >
                      {trait.emoji}{" "}
                      {locale === "zh" ? trait.zh : trait.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("roleForm.description")}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder={t("roleForm.descriptionPlaceholder")}
              />
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("roleForm.systemPrompt")} *
              </label>
              <textarea
                required
                rows={5}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                placeholder={t("roleForm.systemPromptPlaceholder")}
              />
              <p className="text-xs text-gray-400 mt-1">
                {t("roleForm.systemPromptHint")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                {t("roleForm.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading || isUploading}
                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading
                  ? t("roleForm.saving")
                  : editingRole
                    ? t("roleForm.save")
                    : t("roleForm.create")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
