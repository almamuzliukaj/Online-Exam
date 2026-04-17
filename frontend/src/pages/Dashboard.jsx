import { useEffect, useState } from "react";
import { logout, me } from "../lib/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await me();
        setUser(u);
      } catch (e) {
        setError(e?.message || "Failed to load profile");
      }
    })();
  }, []);

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="shell">
      <header className="nav">
        <div className="container navInner">
          <div className="brand">
            <span className="logoDot" />
            <span>Online Exam</span>
          </div>

          <div className="row" style={{ gap: 12 }}>
            {user ? (
              <span className="chip">
                <strong style={{ color: "var(--text)" }}>{user.email}</strong>
                <span>|</span>
                <span>{user.role}</span>
              </span>
            ) : (
              <span className="chip">Loading user...</span>
            )}

            <button className="btn btnDanger" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <div className="grid2">
          <section className="card">
            <div className="cardHeader">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <h2 style={{ margin: 0 }}>Dashboard</h2>
                  <p className="p" style={{ marginTop: 6 }}>
                    Review your authenticated profile and continue into the exam workspace.
                  </p>
                </div>

                <Link className="btn" to="/exams">
                  Open exams
                </Link>
              </div>
            </div>

            <div className="cardBody">
              {error ? <div className="alert">{error}</div> : null}
              <pre className="mono">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </section>

          <aside className="card">
            <div className="cardHeader">
              <h3 style={{ margin: 0 }}>Current focus</h3>
              <p className="p" style={{ marginTop: 6 }}>
                The next milestone is role-specific dashboards for admin, professor, assistant, and student users.
              </p>
            </div>
            <div className="cardBody" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="chip">POST /auth/login</div>
              <div className="chip">GET /auth/me</div>
              <div className="chip">POST /api/Users/import</div>
              <div className="small">
                Environment: <span className="mono">VITE_API_BASE_URL</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
