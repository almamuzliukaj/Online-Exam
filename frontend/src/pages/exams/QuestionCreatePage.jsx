import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addQuestion, getExam } from "../../lib/examsApi";
import { me } from "../../lib/auth";
import { canManageExams } from "../../lib/permissions";

export default function QuestionCreatePage() {
  const nav = useNavigate();
  const { examId } = useParams();

  const [role, setRole] = useState(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingExam, setLoadingExam] = useState(true);
  const [examTitle, setExamTitle] = useState("");
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
        setExamTitle(data?.title ?? "");
      } catch {
        setError("Failed to load exam.");
      } finally {
        setLoadingExam(false);
      }
    })();
  }, [examId]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!examId || !canEdit || !text.trim()) return;

    try {
      setSaving(true);
      setError("");
      await addQuestion(examId, { text });
      nav(`/exams/${examId}`);
    } catch {
      setError("Failed to add question.");
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
          <div className="row">
            <Link className="btn" to={`/exams/${examId}`}>Back</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card formCard">
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>Add Question</h2>
            <p className="p" style={{ marginTop: 6 }}>
              {loadingExam ? "Loading exam context..." : `Creating a question for ${examTitle || "this exam"}.`}
            </p>
          </div>

          <div className="cardBody">
            {error && <div className="alert">{error}</div>}
            <form className="stackLg" onSubmit={onSubmit}>
              <textarea
                className="input inputLight textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={saving}
                rows={5}
                placeholder="Write the question prompt here."
              />
              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button className="btn btnPrimary" type="submit" disabled={saving || !canEdit || !text.trim()}>
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
