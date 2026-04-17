import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createExam } from "../../lib/examsApi";

export default function ExamCreatePage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: 60,
  });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await createExam({
        title: form.title,
        description: form.description,
        durationMinutes: Number(form.durationMinutes) || 60,
      });
      nav("/exams");
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message;

      setError(apiMessage || "Unable to create the exam right now.");
    }
  }

  return (
    <div className="shell">
      <header className="nav">
        <div className="container navInner">
          <div className="brand">
            <img className="brandLogo" src="/logo-itm.svg" alt="ITM Exam logo" />
            <span>ITM Exam</span>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <Link className="btn" to="/exams">Back</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>Create Exam</h2>
            <p className="p" style={{ marginTop: 8 }}>
              Add the basic exam information below.
            </p>
          </div>

          <div className="cardBody">
            {error ? <div className="alert" style={{ marginBottom: 14 }}>{error}</div> : null}

            <form className="authForm" onSubmit={onSubmit}>
              <div className="field">
                <div className="label">Title</div>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  required
                />
              </div>

              <div className="field">
                <div className="label">Duration (minutes)</div>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.durationMinutes}
                  onChange={(e) => setForm((current) => ({ ...current, durationMinutes: Number(e.target.value) }))}
                />
              </div>

              <div className="field">
                <div className="label">Description</div>
                <textarea
                  className="input"
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                />
              </div>

              <div className="row" style={{ gap: 12, justifyContent: "flex-end" }}>
                <Link className="btn" to="/exams">Cancel</Link>
                <button className="btn btnPrimary" type="submit">
                  Create exam
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
