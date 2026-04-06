import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listExams } from "../../lib/examsApi";
import { me } from "../../lib/auth";
import { canManageExams } from "../../lib/permissions";
import { mockResetExamsDb } from "../../lib/mockExamsDb"; // <-- ADD

type ExamDto = {
  id: string;
  title?: string;
  name?: string;
  description?: string | null;
};

export default function ExamsListPage() {
  const [role, setRole] = useState<string | null>(null);
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const data = await listExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load exams");
    } finally {
      setLoading(false);
    }
  }

  function onResetMock() {
    const ok = window.confirm(
      "Are you sure you want to delete ALL mock exams and questions? This cannot be undone."
    );
    if (!ok) return;

    mockResetExamsDb();
    load();
  }

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const info = await me();
        if (!active) return;
        setRole(info?.role ?? null);
      } catch {
        // ignore
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shell">
      <header className="nav">
        <div className="container navInner">
          <div className="brand">
            <span className="logoDot" />
            <span>Online Exam</span>
          </div>

          <div className="row" style={{ gap: 12 }}>
            <Link className="btn" to="/dashboard">
              Dashboard
            </Link>

            {canManageExams(role) ? (
              <Link className="btn" to="/exams/new">
                Create exam
              </Link>
            ) : null}

            {/* Mock reset (safe confirm) */}
            <button className="btn btnDanger" onClick={onResetMock} disabled={loading}>
              Reset mock data
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
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
                <h2 style={{ margin: 0 }}>Exams</h2>
                <p className="p" style={{ marginTop: 6 }}>
                  Browse exams. Students can view; Admin/Professor can manage.
                </p>
              </div>

              <button className="btn" onClick={load} disabled={loading}>
                {loading ? "Loading…" : "Retry"}
              </button>
            </div>
          </div>

          <div
            className="cardBody"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {error ? <div className="alert">{error}</div> : null}

            {!error && !loading && exams.length === 0 ? (
              <div className="small">No exams yet.</div>
            ) : null}

            {!error && exams.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {exams.map((x) => (
                  <div key={x.id} className="chip" style={{ justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <strong style={{ color: "var(--text)" }}>
                        {x.title ?? x.name ?? "(untitled)"}
                      </strong>
                      {x.description ? (
                        <span className="small" style={{ opacity: 0.9 }}>
                          {x.description}
                        </span>
                      ) : null}
                    </div>

                    <Link className="btn" to={`/exams/${x.id}`}>
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}