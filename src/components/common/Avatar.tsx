interface AvatarProps {
  avatarUrl?: string | null;
  emoji?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-lg",
  lg: "w-16 h-16 text-2xl",
};

export default function Avatar({
  avatarUrl,
  emoji,
  size = "md",
  className = "",
}: AvatarProps) {
  const base = `${sizeClasses[size]} rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${className}`;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="avatar"
        className={`${base} object-cover`}
      />
    );
  }

  return (
    <span className={`${base} bg-gray-100`}>
      {emoji || "🤖"}
    </span>
  );
}
