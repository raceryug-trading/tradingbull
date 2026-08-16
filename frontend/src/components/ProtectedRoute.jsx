import { Navigate } from "react-router-dom";
import { currentSession } from "../lib/store";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const s = currentSession();
  if (!s) return <Navigate to="/login" replace />;
  if (adminOnly && s.role !== "admin") return <Navigate to="/modules" replace />;
  return children;
};

export default ProtectedRoute;
