import { Link, useNavigate } from "react-router-dom";
import { createExam } from "../../lib/examsApi";
import AppShell from "../../components/AppShell";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useState } from "react";

export default function ExamCreatePage() {
  const nav = useNavigate();
  const { user, loading, error: userError } = useCurrentUser();
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: 60,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await createExam(form);
      nav("/exams");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create the exam right now.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="pageState">Loading creation workspace...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load user profile."}</div>;
  }

  return (
    <AppShell
      user={user}
      badge="Exam authoring"
      title="Create exam"
      subtitle="Set the assessment foundation first. Question selection, scheduling, and publishing will build on this record."
      actions={<Link className="btn" to="/exams">Cancel</Link>}
    >
      <section className="formSurface">
        <div className="surfaceCard">
          <div className="sectionHeader">
            <h3>Exam configuration</h3>
          </div>
          <div className="sectionBody">
            {error ? <div className="alert">{error}</div> : null}
            <form className="stackLg" onSubmit={onSubmit}>
              <div className="field">
                <label className="label">Exam title</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Algorithms Midterm"
                  required
                />
              </div>

              <div className="field">
                <label className="label">Duration in minutes</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                />
              </div>

              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="input textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe scope, instructions, allowed materials, and intended delivery notes."
                />
              </div>

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <Link className="btn" to="/exams">Back</Link>
                <button className="btn btnPrimary" type="submit" disabled={saving}>
                  {saving ? "Creating..." : "Create exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
