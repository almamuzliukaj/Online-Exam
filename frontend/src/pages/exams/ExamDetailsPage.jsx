import { Link, useParams } from "react-router-dom";
import { getExam, listQuestions } from "../../lib/examsApi";
import { canCreateQuestions } from "../../lib/permissions";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import AppShell from "../../components/AppShell";
import { useEffect, useState } from "react";

export default function ExamDetailsPage() {
  const { examId } = useParams();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examId) return;

    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const [examData, questionData] = await Promise.all([getExam(examId), listQuestions(examId)]);
        if (!active) return;
        setExam(examData);
        setQuestions(Array.isArray(questionData) ? questionData : []);
      } catch {
        if (active) setError("Failed to load exam details.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [examId]);

  if (userLoading) {
    return <div className="pageState">Loading exam details...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load user profile."}</div>;
  }

  const canEdit = canCreateQuestions(user.role);

  return (
    <AppShell
      user={user}
      badge="Exam details"
      title={exam?.title || "Exam detail"}
      subtitle={exam?.description || "Inspect the exam structure, question coverage, and next authoring actions."}
      actions={
        <>
          <Link className="btn" to="/exams">Back to exams</Link>
          {canEdit && examId ? <Link className="btn btnPrimary" to={`/exams/${examId}/questions/new`}>Add question</Link> : null}
        </>
      }
    >
      <div className="stackXl">
        {error ? <div className="alert">{error}</div> : null}

        {loading ? (
          <div className="pageStateCard">Loading exam structure...</div>
        ) : (
          <>
            <section className="summaryStrip">
              <article className="summaryCard">
                <span className="summaryLabel">Status</span>
                <strong>{exam?.isPublished ? "Published" : "Draft"}</strong>
              </article>
              <article className="summaryCard">
                <span className="summaryLabel">Duration</span>
                <strong>{exam?.durationMinutes || 60} min</strong>
              </article>
              <article className="summaryCard">
                <span className="summaryLabel">Questions</span>
                <strong>{questions.length}</strong>
              </article>
            </section>

            <section className="surfaceCard">
              <div className="sectionHeader">
                <h3>Question coverage</h3>
                <span className="small">Current authoring progress for this assessment</span>
              </div>
              <div className="sectionBody">
                {questions.length === 0 ? (
                  <div className="emptyState">
                    <p>No questions have been added yet.</p>
                    <p>Add the first question to start building the exam.</p>
                  </div>
                ) : (
                  <div className="questionList">
                    {questions.map((question, index) => (
                      <article key={question.id} className="questionCard">
                        <div className="questionIndex">{String(index + 1).padStart(2, "0")}</div>
                        <div className="questionBody">
                          <strong>{question.text || "(no text)"}</strong>
                          <div className="questionMeta">
                            <span>{question.type ? `Type: ${question.type}` : "Type: -"}</span>
                            <span>{typeof question.points === "number" ? `Points: ${question.points}` : "Points: -"}</span>
                            {question.answerLanguage ? <span>{`Language: ${question.answerLanguage}`}</span> : null}
                            {typeof question.testCaseCount === "number" && question.testCaseCount > 0 ? <span>{`Test cases: ${question.testCaseCount}`}</span> : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
