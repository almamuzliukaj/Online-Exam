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
 feature/exam-fixes-and-logo

      setSaving(true);
 main
      await createExam({
        title: form.title,
        description: form.description,
        durationMinutes: Number(form.durationMinutes) || 60,
      });
      nav("/exams");
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message;
feature/exam-fixes-and-logo

      setError(apiMessage || "Provimi nuk u krijua. Kontrollo fushat dhe provo perseri.");
    }
  }

  return (
    <div className="shell">
      <header className="nav">
        <div className="container navInner">
          <div className="brand">
            <img className="brandLogo" src="/logo-itm.svg" alt="ITM Exam logo" />
            <span>ITM Exam</span>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <Link className="btn" to="/exams">Back</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>Create Exam</h2>
            <p className="p" style={{ marginTop: 8 }}>
              Add the basic exam information below.
            </p>

      setError(apiMessage || "Unable to create the exam right now.");
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
 main
          </div>
          <div className="sectionBody">
            {error ? <div className="alert">{error}</div> : null}
            <form className="stackLg" onSubmit={onSubmit}>
              <div className="field">
                <div className="label">Title</div>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
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
                  onChange={(e) => setForm((current) => ({ ...current, durationMinutes: Number(e.target.value) }))}
                />
              </div>

              <div className="field">
                <div className="label">Description</div>
                <textarea
feature/exam-fixes-and-logo
                  className="input"
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                />
              </div>

              <div className="row" style={{ gap: 12, justifyContent: "flex-end" }}>
                <Link className="btn" to="/exams">Cancel</Link>
                <button className="btn btnPrimary" type="submit">
                  Krijo Provimin

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
main
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
