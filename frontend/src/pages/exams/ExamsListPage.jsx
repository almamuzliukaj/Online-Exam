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
      
      // 1. Marrim perdoruesin (nese dështon, vendosim një student default)
      let userData;
      try {
        userData = await me();
      } catch (e) {
        userData = { email: "student@test.com", role: "Student" };
      }
      setUser(userData);

      // 2. Marrim provimet nga API (qe tani perdor MockDb-ne tende)
      const examsData = await listExams();
      setExams(examsData);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Dështoi ngarkimi i të dhënave.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lejojme krijimin nese eshte Admin ose Professor
  const canCreate = user?.role === "Admin" || user?.role === "Professor";

  if (loading) return <div className="loader" style={{ padding: '50px', textAlign: 'center' }}>Duke u ngarkuar...</div>;

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Provimet Online</h2>
        {canCreate && (
          <Link to="/exams/new" className="btn btn-primary" style={{ backgroundColor: '#4F46E5', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>
            + Krijo Provim të Ri
          </Link>
        )}
      </header>

      {error && (
        <div className="alert-error" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {exams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px' }}>
          <p>Nuk u gjet asnjë provim.</p>
          {canCreate && <p>Kliko butonin lart për të krijuar provimin e parë!</p>}
        </div>
      ) : (
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {exams.map((exam) => (
            <div key={exam.id} className="card" style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: '0', color: '#111827' }}>{exam.title}</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', minHeight: '40px' }}>{exam.description || "Nuk ka përshkrim."}</p>
              <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  ⏳ {exam.durationMinutes || 60} min
                </span>
                <Link to={`/exams/${exam.id}`} className="btn btn-outline" style={{ border: '1px solid #D1D5DB', padding: '5px 15px', borderRadius: '6px', textDecoration: 'none', color: '#374151' }}>
                  Hape
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}