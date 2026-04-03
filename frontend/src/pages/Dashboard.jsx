import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, me } from "../lib/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      setLoading(true);
      try {
        const data = await me();
        if (!cancelled) setProfile(data);
      } catch (err) {
        // token invalid/expired → back to login
        logout();
        if (!cancelled) {
          setError("Session expired. Please login again.");
          navigate("/login", { replace: true });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Dashboard</h1>

      {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

      <pre style={{ background: "#111", color: "#0f0", padding: 16, overflow: "auto" }}>
        {JSON.stringify(profile, null, 2)}
      </pre>

      <button onClick={onLogout} style={{ padding: 10 }}>
        Logout
      </button>
    </div>
  );
}