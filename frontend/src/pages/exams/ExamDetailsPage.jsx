import { Link, useParams } from "react-router-dom";
import { getExam, listQuestions } from "../../lib/examsApi";
import { canManageExams } from "../../lib/permissions";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import AppShell from "../../components/AppShell";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ExamDetailsPage() {
  const { t } = useTranslation();
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
        if (active) setError(t("examDetails.error"));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [examId, t]);

  if (userLoading) {
    return <div className="pageState">{t("examDetails.loading")}</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || t("examDetails.userError")}</div>;
  }

  const canEdit = canManageExams(user.role);

  return (
    <AppShell
      user={user}
      badge={t("examDetails.badge")}
      title={exam?.title || t("examDetails.titleFallback")}
      subtitle={exam?.description || t("examDetails.subtitleFallback")}
      actions={
        <>
          <Link className="btn" to="/exams">{t("examDetails.backToExams")}</Link>
          {canEdit && examId ? <Link className="btn btnPrimary" to={`/exams/${examId}/questions/new`}>{t("examDetails.addQuestion")}</Link> : null}
        </>
      }
    >
      <div className="stackXl">
        {error ? <div className="alert">{error}</div> : null}

        {loading ? (
          <div className="pageStateCard">{t("examDetails.loadingStructure")}</div>
        ) : (
          <>
            <section className="summaryStrip">
              <article className="summaryCard">
                <span className="summaryLabel">{t("examDetails.status")}</span>
                <strong>{exam?.isPublished ? t("examsList.published") : t("examsList.draft")}</strong>
              </article>
              <article className="summaryCard">
                <span className="summaryLabel">{t("examDetails.duration")}</span>
                <strong>{exam?.durationMinutes || 60} min</strong>
              </article>
              <article className="summaryCard">
                <span className="summaryLabel">{t("examDetails.questions")}</span>
                <strong>{questions.length}</strong>
              </article>
            </section>

            <section className="surfaceCard">
              <div className="sectionHeader">
                <h3>{t("examDetails.coverage")}</h3>
                <span className="small">{t("examDetails.progress")}</span>
              </div>
              <div className="sectionBody">
                {questions.length === 0 ? (
                  <div className="emptyState">
                    <p>{t("examDetails.noQuestionsTitle")}</p>
                    <p>{t("examDetails.noQuestionsText")}</p>
                  </div>
                ) : (
                  <div className="questionList">
                    {questions.map((question, index) => (
                      <article key={question.id} className="questionCard">
                        <div className="questionIndex">{String(index + 1).padStart(2, "0")}</div>
                        <div className="questionBody">
                          <strong>{question.text || "(no text)"}</strong>
                          <div className="questionMeta">
                            <span>{question.type ? `${t("examDetails.type")}: ${question.type}` : `${t("examDetails.type")}: -`}</span>
                            <span>{typeof question.points === "number" ? `${t("examDetails.points")}: ${question.points}` : `${t("examDetails.points")}: -`}</span>
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
