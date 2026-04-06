import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { me } from "../lib/auth";

export default function RoleGuard({ allow = [], children }) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [notAllowed, setNotAllowed] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const info = await me(); // { email, role, userId? }
        if (!active) return;

        const r = info?.role ?? null;
        setRole(r);

        if (!r) setNotLoggedIn(true);
        else if (!allow.includes(r)) setNotAllowed(true);
      } catch {
        if (!active) return;
        setNotLoggedIn(true);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [allow]);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (notLoggedIn) return <Navigate to="/login" replace />;

  if (notAllowed) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ fontWeight: 600, fontSize: 18 }}>403 - No permission</h2>
        <p style={{ marginTop: 8 }}>You don’t have access to this page.</p>
      </div>
    );
  }

  return children;
}