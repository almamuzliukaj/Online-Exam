import { Link, useNavigate, useParams } from "react-router-dom";
import { addQuestion, getExam } from "../../lib/examsApi";
import { canManageExams } from "../../lib/permissions";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import AppShell from "../../components/AppShell";
import { useEffect, useMemo, useState } from "react";

export default function QuestionCreatePage() {
  const nav = useNavigate();
  const { examId } = useParams();
feature/exam-fixes-and-logo

  const [role, setRole] = useState(null);

  const { user, loading: userLoading, error: userError } = useCurrentUser();
 main
  const [exam, setExam] = useState(null);
  const [form, setForm] = useState({
    text: "",
    type: "MCQ",
    points: 10,
  });
 feature/exam-fixes-and-logo
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saving, setSaving] = useState(false);
  const [loadingExam, setLoadingExam] = useState(true);
 main
  const [error, setError] = useState("");

  const canEdit = useMemo(() => canManageExams(user?.role), [user?.role]);

  useEffect(() => {
    if (!examId) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getExam(examId);
        setExam(data);
      } catch {
        setError("Failed to load exam.");
      } finally {
        setLoading(false);
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

feature/exam-fixes-and-logo
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
              {exam?.title ? `Exam: ${exam.title}` : "Add a question to this exam."}
            </p>
          </div>

          <div className="cardBody">
            {error ? <div className="alert" style={{ marginBottom: 14 }}>{error}</div> : null}

            <form className="authForm" onSubmit={onSubmit}>

  if (userLoading) {
    return <div className="pageState">Loading question editor...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load user profile."}</div>;
  }

  return (
    <AppShell
      user={user}
      badge="Question authoring"
      title="Add question"
      subtitle={loadingExam ? "Loading exam context..." : `Create a new question for ${exam?.title || "this exam"}.`}
      actions={<Link className="btn" to={`/exams/${examId}`}>Back to exam</Link>}
    >
      <section className="formSurface">
        <div className="surfaceCard">
          <div className="sectionHeader">
            <h3>Question content</h3>
          </div>
          <div className="sectionBody">
            {error ? <div className="alert">{error}</div> : null}
            <form className="stackLg" onSubmit={onSubmit}>
 main
              <div className="field">
                <label className="label">Prompt</label>
                <textarea
                  className="input textarea"
                  value={form.text}
                  onChange={(e) => setForm((current) => ({ ...current, text: e.target.value }))}
                  disabled={saving || loadingExam}
                  placeholder="Write the question prompt here."
                  rows={6}
                />
              </div>

              <div className="field">
                <label className="label">Type</label>
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
                <label className="label">Points</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.points}
                  onChange={(e) => setForm((current) => ({ ...current, points: Number(e.target.value) }))}
                  disabled={saving || loadingExam}
                />
              </div>

feature/exam-fixes-and-logo
              <div className="row" style={{ gap: 12, justifyContent: "flex-end" }}>
                <Link className="btn" to={`/exams/${examId}`}>Cancel</Link>
                <button className="btn btnPrimary" type="submit" disabled={saving || loading || !canEdit}>
                  {saving ? "Saving..." : "Save"}

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button className="btn btnPrimary" type="submit" disabled={saving || loadingExam || !canEdit || !form.text.trim()}>
                  {saving ? "Saving..." : "Save question"}
 main
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
