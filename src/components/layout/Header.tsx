import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useI18n } from "../../hooks/useI18n";

export default function Header() {
  const { user, signOut } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const location = useLocation();

  const isChat = location.pathname.startsWith("/chat");

  return (
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
        <span className="text-sm text-gray-500">{user?.email}</span>
        <button
          onClick={signOut}
          className="text-sm text-gray-600 hover:text-red-600 transition"
        >
          {t("header.signOut")}
        </button>
      </div>
    </header>
  );
}
