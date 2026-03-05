import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface AuthFormProps {
  mode: "login" | "register";
}

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "该邮箱已被注册",
  "auth/invalid-email": "邮箱格式不正确",
  "auth/weak-password": "密码至少需要 6 位",
  "auth/user-not-found": "用户不存在",
  "auth/wrong-password": "密码错误",
  "auth/invalid-credential": "邮箱或密码错误",
  "auth/too-many-requests": "登录尝试次数过多，请稍后再试",
};

function getErrorMessage(error: unknown): string {
  console.error("Auth error:", error);
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    const code = (error as { code: string }).code;
    return ERROR_MESSAGES[code] ?? `操作失败 (${code})`;
  }
  return `操作失败: ${error instanceof Error ? error.message : String(error)}`;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          AI Chat Demo
        </h1>
        <p className="text-center text-gray-500 mb-8">
          {isLogin ? "登录你的账号" : "创建新账号"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="至少 6 位"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "处理中..." : isLogin ? "登录" : "注册"}
          </button>

          <p className="text-center text-sm text-gray-500">
            {isLogin ? "还没有账号？" : "已有账号？"}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="text-blue-600 hover:underline ml-1"
            >
              {isLogin ? "去注册" : "去登录"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
