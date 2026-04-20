import { Link, useNavigate, useParams } from "react-router-dom";
import { addQuestion, getExam } from "../../lib/examsApi";
import { canManageExams } from "../../lib/permissions";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import AppShell from "../../components/AppShell";
import { useEffect, useMemo, useState } from "react";

export default function QuestionCreatePage() {
  const nav = useNavigate();
  const { examId } = useParams();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [exam, setExam] = useState(null);
  const [form, setForm] = useState({
    text: "",
    type: "MCQ",
    points: 10,
  });
  const [loadingExam, setLoadingExam] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canEdit = useMemo(() => canManageExams(user?.role), [user?.role]);

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

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button className="btn btnPrimary" type="submit" disabled={saving || loadingExam || !canEdit || !form.text.trim()}>
                  {saving ? "Saving..." : "Save question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
