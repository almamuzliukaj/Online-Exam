import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listExams } from "../../lib/examsApi";
import { me } from "../../lib/auth";

export default function ExamsListPage() {
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      let userData;
      try {
        userData = await me();
      } catch {
        userData = { email: "student@onlineexam.com", role: "Student" };
      }
      setUser(userData);

      const examsData = await listExams();
      setExams(examsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load exam data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const canCreate = user?.role === "Admin" || user?.role === "Professor";

  if (loading) {
    return <div className="loader" style={{ padding: "50px", textAlign: "center" }}>Loading exams...</div>;
  }

  return (
    <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <header className="pageHeader">
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "6px" }}>Exam Workspace</h2>
          <p className="p">Review drafts, published exams, and question coverage in one place.</p>
        </div>
        {canCreate && (
          <Link to="/exams/new" className="btn btnPrimary">
            Create new exam
          </Link>
        )}
      </header>

      {error && (
        <div className="alert" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {exams.length === 0 ? (
        <div className="emptyState">
          <p>No exams are available yet.</p>
          {canCreate && <p>Create the first exam to start the assessment workflow.</p>}
        </div>
      ) : (
        <div className="cardsGrid">
          {exams.map((exam) => (
            <div key={exam.id} className="examTile">
              <div className="examTileTop">
                <span className="chip chipLight">{exam.isPublished ? "Published" : "Draft"}</span>
                <span className="small">Duration: {exam.durationMinutes || 60} min</span>
              </div>
              <h3 className="examTileTitle">{exam.title}</h3>
              <p className="examTileText">{exam.description || "No description available for this exam."}</p>
              <div className="examTileFooter">
                <span className="small">Questions and settings are managed in the exam details view.</span>
                <Link to={`/exams/${exam.id}`} className="btn">
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
