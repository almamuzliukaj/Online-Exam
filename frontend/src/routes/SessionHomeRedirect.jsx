import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { getToken } from "../lib/auth";
import { getDefaultRouteForRole } from "../lib/permissions";

export default function SessionHomeRedirect() {
  const token = getToken();
  const { user, loading } = useCurrentUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="pageState">Preparing your workspace...</div>;
  }

  return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
}
