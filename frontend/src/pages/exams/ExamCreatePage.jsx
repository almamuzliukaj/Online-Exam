import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { createExam } from "../../lib/examsApi";

export default function ExamCreatePage() {
  const navigate = useNavigate();
  const { user, loading, error: userError } = useCurrentUser();
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: 60,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      await createExam({
        title: form.title.trim(),
        description: form.description.trim(),
        durationMinutes: Number(form.durationMinutes) || 60,
      });
      navigate("/exams");
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message;

      setError(apiMessage || "Unable to create the exam right now.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="pageState">Loading exam authoring workspace...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load user profile."}</div>;
  }

  return (
    <AppShell
      user={user}
      badge="Exam authoring"
      title="Create exam"
      subtitle="Start a new assessment workspace with the core metadata the teaching team needs before publishing or adding questions."
      actions={<Link className="btn" to="/exams">Back to exams</Link>}
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
                <label className="label">Title</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Midterm Assessment - Database Systems"
                  disabled={saving}
                  required
                />
              </div>

              <div className="gridTwo">
                <div className="field">
                  <label className="label">Duration in minutes</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={form.durationMinutes}
                    onChange={(event) => setForm((current) => ({ ...current, durationMinutes: Number(event.target.value) }))}
                    disabled={saving}
                  />
                </div>

                <div className="inlineMetaPanel">
                  <div>
                    <strong>Creator visibility</strong>
                    <div className="cellMeta">The backend attaches ownership to the signed-in staff member.</div>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="input textarea"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Describe scope, instructions, allowed materials, and delivery notes."
                  disabled={saving}
                />
              </div>

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <Link className="btn" to="/exams">Cancel</Link>
                <button className="btn btnPrimary" type="submit" disabled={saving || !form.title.trim()}>
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
