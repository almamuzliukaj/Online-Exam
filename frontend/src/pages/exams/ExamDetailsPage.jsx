import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getExam, listQuestions } from "../../lib/examsApi";
import { me } from "../../lib/auth";
import { canManageExams } from "../../lib/permissions";

export default function ExamDetailsPage() {
  const { examId } = useParams();

  const [role, setRole] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
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

    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const [examData, qData] = await Promise.all([
          getExam(examId),
          listQuestions(examId),
        ]);

        if (!active) return;

        setExam(examData);
        setQuestions(Array.isArray(qData) ? qData : []);
      } catch (err) {
        if (!active) return;
        const statusPart = err?.status ? ` (HTTP ${err.status})` : "";
        const msgPart = err?.message ? ` ${err.message}` : "";
        setError(`Failed to load exam details.${statusPart}${msgPart}`.trim());
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [examId]);

  return (
    <div className="shell">
      <header className="nav">
        <div className="container navInner">
          <div className="brand">
            <span className="logoDot" />
            <span>Online Exam</span>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <Link className="btn" to="/exams">Back</Link>
            {examId && canEdit && (
              <Link className="btn btnPrimary" to={`/exams/${examId}/questions/new`}>
                Add question
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card">
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>{exam?.title ?? "Exam details"}</h2>
            <p className="p" style={{ marginTop: 6 }}>
              {exam?.description ? exam.description : "View exam information and question coverage."}
            </p>
          </div>

          <div className="cardBody" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {loading && <div className="chip">Loading...</div>}
            {error && <div className="alert">{error}</div>}

            {!loading && !error && (
              <>
                <h3 style={{ margin: "8px 0 0" }}>Questions</h3>
                {questions.length === 0 ? (
                  <div className="small">No questions have been added yet.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {questions.map((q) => (
                      <div key={q.id} className="chip">
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <strong style={{ color: "var(--text)" }}>{q.text ?? "(no text)"}</strong>
                          <span className="small">
                            {q.type ? `Type: ${q.type}` : "Type: -"}
                            {typeof q.points === "number" ? ` | Points: ${q.points}` : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


