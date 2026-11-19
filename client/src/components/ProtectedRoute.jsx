import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="grid min-h-screen place-items-center">Loading…</div>;
  return user && (!roles || roles.includes(user.role)) ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
