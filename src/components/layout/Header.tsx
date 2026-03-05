import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useI18n } from "../../hooks/useI18n";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useImageUpload } from "../../hooks/useImageUpload";
import Avatar from "../common/Avatar";
import ImageUploader from "../common/ImageUploader";

export default function Header() {
  const { user, signOut } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const { profile, updateProfile } = useUserProfile();
  const location = useLocation();

  const isChat = location.pathname.startsWith("/chat");

  // Dropdown menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Profile edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { uploadImage, uploading } = useImageUpload();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Fill edit form when modal opens
  useEffect(() => {
    if (editOpen && profile) {
      setEditName(profile.displayName || "");
      setEditAvatarUrl(profile.avatarUrl ?? null);
    }
  }, [editOpen, profile]);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    try {
      const fileName = `profile_avatar_${Date.now()}_${file.name}`;
      const url = await uploadImage(file, `images/${user.uid}/${fileName}`);
      setEditAvatarUrl(url);
    } catch {
      alert(t("profile.uploadFailed"));
    }
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateProfile({
        displayName: editName.trim(),
        avatarUrl: editAvatarUrl,
      });
      setEditOpen(false);
      setMenuOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.displayName || user?.email || "";

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-lg font-bold text-gray-900">
            {t("app.title")}
          </Link>
          {isChat && (
            <Link
              to="/dashboard"
              className="text-sm text-blue-600 hover:underline"
            >
              {t("header.backToList")}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <div className="flex bg-gray-100 rounded-md text-xs overflow-hidden">
            <button
              onClick={() => setLocale("en")}
              className={`px-2 py-1 transition ${locale === "en" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("zh")}
              className={`px-2 py-1 transition ${locale === "zh" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              中
            </button>
          </div>

          {/* User info + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition"
            >
              <Avatar
                avatarUrl={profile?.avatarUrl}
                emoji="👤"
                size="sm"
              />
              <span className="text-sm text-gray-700 max-w-[120px] truncate">
                {displayName}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition ${menuOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setEditOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  {t("profile.edit")}
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  {t("header.signOut")}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile edit modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm">
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">
                {t("profile.edit")}
              </h2>

              {/* Avatar upload */}
              <div className="flex justify-center">
                <ImageUploader
                  currentUrl={editAvatarUrl}
                  onUpload={handleAvatarUpload}
                  uploading={uploading}
                  label={t("profile.avatar")}
                  aspectRatio="square"
                />
              </div>

              {/* Display name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.displayName")}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder={t("profile.displayNamePlaceholder")}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  {t("profile.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {saving ? t("profile.saving") : t("profile.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
