import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createExam } from "../../lib/examsApi";
import { me } from "../../lib/auth";
import { canManageExams } from "../../lib/permissions";

export default function ExamCreatePage() {
  const nav = useNavigate();

  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  async function onSubmit(e) {
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
    } catch (err) {
      const statusPart = err?.status ? ` (HTTP ${err.status})` : "";
      const msgPart = err?.message ? ` ${err.message}` : "";
      setError(`Failed to create exam.${statusPart}${msgPart}`.trim());
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
            <Link className="btn" to="/exams">Back</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card">
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>Create exam</h2>
          </div>
          <div className="cardBody" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!canCreate && <div className="alert">You don’t have permission.</div>}
            {error && <div className="alert">{error}</div>}

            <form className="authForm" onSubmit={onSubmit}>
              <div className="field">
                <label className="label">Title</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  disabled={!canCreate || saving}
                />
              </div>
              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="input"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  disabled={!canCreate || saving}
                  style={{ minHeight: 120 }}
                />
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