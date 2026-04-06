import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createExam } from "../../lib/examsApi";
import { me } from "../../lib/auth";
import { canManageExams } from "../../lib/permissions";

type FormState = {
  title: string;
  description: string;
};

export default function ExamCreatePage() {
  const nav = useNavigate();

  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const info = await me();
        setRole(info?.role ?? null);
      } catch {
        setRole(null);
      }
    })();
  }, []);

  const canCreate = canManageExams(role);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate) return;

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const created = await createExam({
        title: form.title.trim(),
        description: form.description.trim() || null,
      });

      if (created?.id) nav(`/exams/${created.id}`);
      else nav("/exams");
    } catch (err: any) {
      if (err?.status === 404) {
        setError("Create exam endpoint not available yet (backend Sprint 2 not merged).");
      } else {
        setError(err?.message ?? "Failed to create exam.");
      }
    } finally {
      setSaving(false);
    }
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
            <Link className="btn" to="/exams">
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card">
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>Create exam</h2>
            <p className="p" style={{ marginTop: 6 }}>
              Admin/Professor can create exams.
            </p>
          </div>

          <div className="cardBody" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!canCreate ? (
              <div className="alert">You don’t have permission to create exams.</div>
            ) : null}

            {error ? <div className="alert">{error}</div> : null}

            <form className="authForm" onSubmit={onSubmit}>
              <div className="field">
                <label className="label">Title</label>
                <div className="inputWrap">
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                    disabled={!canCreate || saving}
                    placeholder="e.g. Database Midterm"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <div className="inputWrap">
                  <textarea
                    className="input"
                    value={form.description}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    disabled={!canCreate || saving}
                    placeholder="Optional"
                    style={{ minHeight: 120, resize: "vertical" }}
                  />
                </div>
              </div>

              <button className="btn btnPrimary" type="submit" disabled={!canCreate || saving}>
                {saving ? "Creating…" : "Create"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}