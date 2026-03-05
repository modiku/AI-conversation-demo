import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useI18n } from "../../hooks/useI18n";
import type { TranslationKey } from "../../i18n";

interface AuthFormProps {
  mode: "login" | "register";
}

const ERROR_CODE_MAP: Record<string, TranslationKey> = {
  "auth/email-already-in-use": "auth.error.emailInUse",
  "auth/invalid-email": "auth.error.invalidEmail",
  "auth/weak-password": "auth.error.weakPassword",
  "auth/user-not-found": "auth.error.userNotFound",
  "auth/wrong-password": "auth.error.wrongPassword",
  "auth/invalid-credential": "auth.error.invalidCredential",
  "auth/too-many-requests": "auth.error.tooManyRequests",
};

export default function AuthForm({ mode }: AuthFormProps) {
  const { signIn, signUp } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const getErrorMessage = (err: unknown): string => {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      typeof (err as { code: unknown }).code === "string"
    ) {
      const code = (err as { code: string }).code;
      const key = ERROR_CODE_MAP[code];
      if (key) return t(key);
    }
    return t("auth.error.default");
  };

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
      console.error("Auth error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex bg-white rounded-lg border border-gray-200 text-sm overflow-hidden">
            <button
              onClick={() => setLocale("en")}
              className={`px-3 py-1.5 transition ${locale === "en" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("zh")}
              className={`px-3 py-1.5 transition ${locale === "zh" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              中
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {t("app.title")}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
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
              {t("auth.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={t("auth.emailPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.password")}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={t("auth.passwordPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading
              ? t("auth.submitting")
              : isLogin
                ? t("auth.login")
                : t("auth.register")}
          </button>

          <p className="text-center text-sm text-gray-500">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="text-blue-600 hover:underline ml-1"
            >
              {isLogin ? t("auth.goRegister") : t("auth.goLogin")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
