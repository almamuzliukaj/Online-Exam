import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listExams } from "../../lib/examsApi";
import { me } from "../../lib/auth";

export default function ExamsListPage() {
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        let userData;
        try {
          userData = await me();
        } catch {
          userData = { email: "student@test.com", role: "Student" };
        }
        setUser(userData);

        const examsData = await listExams();
        setExams(examsData);
      } catch (err) {
        const status = err?.response?.status;
        console.error("Failed to load exams:", status, err?.message || err);
        setError("Could not load exams. Please ensure the API and database are running.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const canCreate = user?.role === "Admin" || user?.role === "Professor";

  if (loading) {
    return (
      <div className="shell">
        <div className="center">
          <span className="chip">Loading exams…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <div className="container pageContent">
        <header className="pageHeader">
          <h2 className="cardTitle">Online Exams</h2>
          {canCreate && (
            <Link to="/exams/new" className="btn btnPrimary">
              + Create Exam
            </Link>
          )}
        </header>

        {error && <div className="alert">{error}</div>}

        {exams.length === 0 ? (
          <div className="emptyState">
            <p>No exams found.</p>
            {canCreate && <p>Click the button above to create your first exam!</p>}
          </div>
        ) : (
          <div className="gridCards">
            {exams.map((exam) => (
              <div key={exam.id} className="card">
                <div className="cardBody">
                  <h3 className="cardTitle">{exam.title}</h3>
                  <p className="small descriptionPreview">
                    {exam.description || "No description."}
                  </p>
                  <div className="cardFooter">
                    <span className="small">⏳ {exam.durationMinutes || 60} min</span>
                    <Link to={`/exams/${exam.id}`} className="btn">
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}