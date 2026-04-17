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
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingExam, setLoadingExam] = useState(true);
  const [examTitle, setExamTitle] = useState("");
  const [error, setError] = useState("");

  const canEdit = useMemo(() => canManageExams(user?.role), [user?.role]);

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
      subtitle={loadingExam ? "Loading exam context..." : `Create a new question for ${examTitle || "this exam"}.`}
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
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={saving}
                  placeholder="Write the question prompt here."
                  rows={6}
                />
              </div>

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button className="btn btnPrimary" type="submit" disabled={saving || !canEdit || !text.trim()}>
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
