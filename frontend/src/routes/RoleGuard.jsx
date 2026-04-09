import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { me } from "../lib/auth";

export default function RoleGuard({ allow }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    (async () => {
      try {
        const data = await me();
        setUser(data);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  if (user === undefined) return <div>Loading...</div>;

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}