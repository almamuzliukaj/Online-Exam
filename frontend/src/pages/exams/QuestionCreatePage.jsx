import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addQuestion, getExam } from "../../lib/examsApi";
import { me } from "../../lib/auth";
import { canManageExams } from "../../lib/permissions";

export default function QuestionCreatePage() {
  const nav = useNavigate();
  const { examId } = useParams();

  const [role, setRole] = useState(null);
  const [exam, setExam] = useState(null);
  const [form, setForm] = useState({
    text: "",
    type: "MCQ",
    points: 10,
  });
  const [saving, setSaving] = useState(false);
  const [loadingExam, setLoadingExam] = useState(true);
  const [error, setError] = useState("");

  const canEdit = useMemo(() => canManageExams(role), [role]);

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

  useEffect(() => {
    if (!examId) return;

    (async () => {
      try {
        setLoadingExam(true);
        const data = await getExam(examId);
        setExam(data);
      } catch {
        setError("Failed to load exam.");
      } finally {
        setLoadingExam(false);
      }
    })();
  }, [examId]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!examId || !canEdit || !form.text.trim()) return;

    try {
      setSaving(true);
      setError("");
      await addQuestion(examId, {
        text: form.text.trim(),
        type: form.type,
        points: Number(form.points) || 0,
      });
      nav(`/exams/${examId}`);
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message;

      setError(apiMessage || "Failed to add question.");
    } finally {
      setSaving(false);
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
          <div className="row">
            <Link className="btn" to={`/exams/${examId}`}>Back</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>Add Question</h2>
            <p className="p" style={{ marginTop: 8 }}>
              {loadingExam ? "Loading exam context..." : (exam?.title ? `Exam: ${exam.title}` : "Add a question to this exam.")}
            </p>
          </div>

          <div className="cardBody">
            {error ? <div className="alert" style={{ marginBottom: 14 }}>{error}</div> : null}

            <form className="authForm" onSubmit={onSubmit}>
              <div className="field">
                <div className="label">Question text</div>
                <textarea
                  className="input"
                  value={form.text}
                  onChange={(e) => setForm((current) => ({ ...current, text: e.target.value }))}
                  disabled={saving || loadingExam}
                  rows={5}
                />
              </div>

              <div className="field">
                <div className="label">Type</div>
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))}
                  disabled={saving || loadingExam}
                >
                  <option value="MCQ">MCQ</option>
                  <option value="Text">Text</option>
                  <option value="Code">Code</option>
                </select>
              </div>

              <div className="field">
                <div className="label">Points</div>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.points}
                  onChange={(e) => setForm((current) => ({ ...current, points: Number(e.target.value) }))}
                  disabled={saving || loadingExam}
                />
              </div>

              <div className="row" style={{ gap: 12, justifyContent: "flex-end" }}>
                <Link className="btn" to={`/exams/${examId}`}>Cancel</Link>
                <button className="btn btnPrimary" type="submit" disabled={saving || loadingExam || !canEdit}>
                  {saving ? "Saving..." : "Save question"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
