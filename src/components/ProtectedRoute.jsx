import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, role }) {
  const { accessToken, user, bootstrapped } = useSelector((s) => s.auth);

  // optional: prevent redirect flicker while refresh check runs
  if (!bootstrapped) return null;

  if (!accessToken) return <Navigate to="/auth" replace />;

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/home"} replace />;
  }

  return children;
}
