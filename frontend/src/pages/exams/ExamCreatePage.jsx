import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createExam } from "../../lib/examsApi";

export default function ExamCreatePage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", durationMinutes: 60 });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await createExam(form);
      alert("Provimi u krijua me sukses!");
      nav("/exams");
    } catch (err) {
      // Nëse jep error databaza, të paktën ta dimë pse
      setError("Gabim në Databazë: Fjalëkalimi i pasaktë ose Docker i fikur.");
      console.error(err);
    }
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#f3f4f6", minHeight: "100vh", color: "#333" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#111" }}>Krijo Provim të Ri</h2>
        
        {error && <div style={{ color: "red", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>{error}</div>}

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", fontWeight: "bold" }}>Titulli</label>
            <input 
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", color: "#000", backgroundColor: "#fff" }} 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "bold" }}>Kohëzgjatja (minuta)</label>
            <input 
              type="number"
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", color: "#000", backgroundColor: "#fff" }} 
              value={form.durationMinutes} 
              onChange={e => setForm({...form, durationMinutes: e.target.value})} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "bold" }}>Përshkrimi</label>
            <textarea 
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", minHeight: "80px", color: "#000", backgroundColor: "#fff" }} 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
            />
          </div>

          <button type="submit" style={{ backgroundColor: "#4F46E5", color: "white", padding: "12px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            Krijo Provimin
          </button>

          <Link to="/exams" style={{ textAlign: "center", color: "#666", textDecoration: "none", fontSize: "14px" }}>Anulo</Link>
        </form>
      </div>
    </div>
  );
}