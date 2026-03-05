import { useRef } from "react";
import { useI18n } from "../../hooks/useI18n";

interface ImageUploaderProps {
  currentUrl: string | null;
  onUpload: (file: File) => void;
  uploading?: boolean;
  label: string;
  aspectRatio?: "square" | "portrait";
}

export default function ImageUploader({
  currentUrl,
  onUpload,
  uploading = false,
  label,
  aspectRatio = "square",
}: ImageUploaderProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(t("roleForm.fileTooLarge"));
      return;
    }
    onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const aspect = aspectRatio === "portrait" ? "aspect-[2/3]" : "aspect-square";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`${aspect} w-full max-w-[120px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition overflow-hidden flex items-center justify-center bg-gray-50 disabled:opacity-50`}
      >
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-xs text-center px-1">
            {uploading ? "..." : "+"}
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
