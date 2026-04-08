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
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setLoading(true);
        const data = await getExam(examId);
        setExam(data);
      } catch (err) {
        setError("Failed to load exam.");
      } finally {
        setLoading(false);
      }
    })();
  }, [examId]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!examId || !canEdit || !text.trim()) return;

    try {
      setSaving(true);
      await addQuestion(examId, { text });
      nav(`/exams/${examId}`);
    } catch (err) {
      setError("Failed to add question.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="shell">
      <header className="nav">
        <div className="container navInner">
          <div className="brand"><span>Online Exam</span></div>
          <div className="row"><Link className="btn" to={`/exams/${examId}`}>Back</Link></div>
        </div>
      </header>
      <main className="container">
        <section className="card">
          <div className="cardHeader"><h2>Add Question</h2></div>
          <div className="cardBody">
            {error && <div className="alert">{error}</div>}
            <form onSubmit={onSubmit}>
              <textarea
                className="input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={saving}
                rows={4}
              />
              <button className="btn btnPrimary" type="submit" disabled={saving || !canEdit}>
                {saving ? "Saving…" : "Save"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
