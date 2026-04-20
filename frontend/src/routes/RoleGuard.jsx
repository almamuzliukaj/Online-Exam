import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { getDefaultRouteForRole, normalizeRole } from "../lib/permissions";

export default function RoleGuard({ allow = [] }) {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return <div className="pageState">Loading role permissions...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = normalizeRole(user.role);
  const allowedRoles = allow.map(normalizeRole);

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to={getDefaultRouteForRole(normalizedRole)} replace />;
  }

  return <Outlet />;
}
