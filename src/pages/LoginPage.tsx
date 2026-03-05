import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/auth/AuthForm";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthForm mode="login" />;
}
