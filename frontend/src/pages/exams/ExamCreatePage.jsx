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
      await createExam(form);
      nav("/exams");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create the exam right now.");
      console.error(err);
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
          <Link className="btn" to="/exams">Cancel</Link>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card formCard">
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>Create Exam</h2>
            <p className="p" style={{ marginTop: 6 }}>
              Define the core settings for a new assessment. Question management comes next.
            </p>
          </div>

          <div className="cardBody">
            {error ? <div className="alert">{error}</div> : null}

            <form className="stackLg" onSubmit={onSubmit}>
              <div className="field">
                <label className="label">Exam title</label>
                <input
                  className="input inputLight"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Algorithms Midterm"
                  required
                />
              </div>

              <div className="field">
                <label className="label">Duration (minutes)</label>
                <input
                  className="input inputLight"
                  type="number"
                  min="1"
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                />
              </div>

              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="input inputLight textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short instructions, scope, and allowed materials."
                />
              </div>

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <Link className="btn" to="/exams">Back</Link>
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
