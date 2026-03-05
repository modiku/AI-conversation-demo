import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isChat = location.pathname.startsWith("/chat");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-lg font-bold text-gray-900">
          AI Chat Demo
        </Link>
        {isChat && (
          <Link
            to="/dashboard"
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; 返回角色列表
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{user?.email}</span>
        <button
          onClick={signOut}
          className="text-sm text-gray-600 hover:text-red-600 transition"
        >
          退出登录
        </button>
      </div>
    </header>
  );
}
