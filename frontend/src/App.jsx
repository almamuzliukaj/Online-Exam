import React from "react";
import { Link, useLocation } from "react-router-dom"; 
import AppRoutes from "./routes/AppRoutes";
import "./styles/ui.css";
import "./styles/theme.css";

function App() {
  const location = useLocation();
  
  // Marrim userin nga localStorage
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Kontrollojmë rolin në mënyrë më të sigurt (case-insensitive)
  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigacioni shfaqet vetëm nëse jemi të loguar dhe jo në faqen Login */}
      {user && location.pathname !== "/login" && (
        <nav style={{
          background: '#1a202c', 
          padding: '12px 40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            {/* Ky butoni punon si "Home" dhe të kthen në Dashboard gjithmonë */}
            <Link to="/dashboard" style={{ 
              color: '#fff', 
              fontWeight: '800', 
              textDecoration: 'none', 
              fontSize: '20px',
              letterSpacing: '0.5px'
            }}>
              🎓 OnlineExam
            </Link>
            
            <Link to="/dashboard" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '14px' }}>Dashboard</Link>
            <Link to="/exams" style={{ color: '#cbd5e0', textDecoration: 'none', fontSize: '14px' }}>Exams</Link>

            {/* BUTONI ADMIN: Tash është më i "fortë" ndaj gabimeve */}
            {isAdmin && (
              <Link 
                to="/admin/users" 
                style={{ 
                  background: location.pathname === "/admin/users" ? '#2b6cb0' : '#3182ce', 
                  color: '#fff', 
                  padding: '8px 18px', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '13px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                👥 Manage Users
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{user.fullName || 'Admin'}</div>
              <div style={{ color: '#718096', fontSize: '11px' }}>{user.email}</div>
            </div>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
              style={{ 
                background: 'rgba(229, 62, 62, 0.1)', 
                border: '1px solid #f56565', 
                color: '#feb2b2', 
                padding: '6px 15px', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      <main style={{ padding: '20px' }}>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;