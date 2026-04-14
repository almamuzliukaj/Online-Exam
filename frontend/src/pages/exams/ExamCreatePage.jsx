import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createExam } from "../../lib/examsApi";

export default function ExamCreatePage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", durationMinutes: 60 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createExam(form);
      nav("/exams");
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.message || err?.message || String(err);
      console.error("Create exam failed:", status, detail);
      setError("Could not create exam. Please ensure the API and database are running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <div className="center">
        <div className="card formCard">
          <div className="cardHeader textCenter">
            <h2 className="cardTitle">Create New Exam</h2>
            <p className="p">Fill in the details below to create an exam.</p>
          </div>

          <div className="cardBody">
            <form className="authForm" onSubmit={onSubmit}>
              {error && <div className="alert">{error}</div>}

              <div className="field">
                <div className="label">Title</div>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Midterm Exam"
                  required
                  disabled={loading}
                />
              </div>

              <div className="field">
                <div className="label">Duration (minutes)</div>
                <input
                  className="input"
                  type="number"
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="field">
                <div className="label">Description</div>
                <textarea
                  className="input textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description…"
                  disabled={loading}
                />
              </div>

              <button className="btn btnPrimary" type="submit" disabled={loading}>
                {loading ? "Creating…" : "Create Exam"}
              </button>

              <Link to="/exams" className="link textCenter">Cancel</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}