import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { listExams } from "../../lib/examsApi";
import { canManageExams } from "../../lib/permissions";
import { useEffect, useState } from "react";

export default function ExamsListPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await listExams();
        if (active) setExams(Array.isArray(data) ? data : []);
      } catch {
        if (active) setError("Failed to load exam data.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (userLoading) {
    return <div className="pageState">Loading exams...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load user profile."}</div>;
  }

  const canCreate = canManageExams(user.role);

  return (
    <AppShell
      user={user}
      badge="Exam workspace"
      title="Exams"
      subtitle="Review current assessments, drafts, and publishing readiness in a cleaner operational view."
      actions={canCreate ? <Link to="/exams/new" className="btn btnPrimary">Create exam</Link> : null}
    >
      <div className="stackXl">
        <section className="summaryStrip">
          <article className="summaryCard">
            <span className="summaryLabel">Total exams</span>
            <strong>{exams.length}</strong>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Published</span>
            <strong>{exams.filter((exam) => exam.isPublished).length}</strong>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Draft</span>
            <strong>{exams.filter((exam) => !exam.isPublished).length}</strong>
          </article>
        </section>

        {error ? <div className="alert">{error}</div> : null}

        {loading ? (
          <div className="pageStateCard">Loading exam records...</div>
        ) : exams.length === 0 ? (
          <div className="emptyState">
            <p>No exams are available yet.</p>
            <p>Once faculty workflows are connected, current, scheduled, and published exams will appear here.</p>
          </div>
        ) : (
          <section className="resourceGrid">
            {exams.map((exam) => (
              <article key={exam.id} className="resourceCard">
                <div className="resourceMetaRow">
                  <span className={`statusPill ${exam.isPublished ? "statusLive" : "statusDraft"}`}>
                    {exam.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="small">{exam.durationMinutes || 60} min</span>
                </div>
                <h3>{exam.title}</h3>
                <p>{exam.description || "No description has been provided for this assessment yet."}</p>
                <div className="resourceFooter">
                  <div className="small">Open the exam to manage questions, review details, and continue the workflow.</div>
                  <Link className="btn" to={`/exams/${exam.id}`}>Open</Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </AppShell>
  );
}
