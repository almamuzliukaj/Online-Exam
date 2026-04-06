import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addQuestion } from "../../lib/examsApi";
import { me } from "../../lib/auth";
import { canManageExams } from "../../lib/permissions";

type FormState = {
  text: string;
  type: "Theory" | "SQL" | "Code";
  points: number;
};

export default function QuestionCreatePage() {
  const { examId } = useParams();
  const nav = useNavigate();

  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ text: "", type: "Theory", points: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

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

  const canCreate = canManageExams(role);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!examId) return;
    if (!canCreate) return;

    if (!form.text.trim()) {
      setError("Question text is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await addQuestion(examId, {
        text: form.text.trim(),
        type: form.type,
        points: Number.isFinite(form.points) ? form.points : 0,
      });

      nav(`/exams/${examId}`);
    } catch (err: any) {
      if (err?.status === 404) {
        setError("Add question endpoint not available yet (backend Sprint 2 not merged).");
      } else {
        setError(err?.message ?? "Failed to add question.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="shell">
      <header className="nav">
        <div className="container navInner">
          <div className="brand">
            <span className="logoDot" />
            <span>Online Exam</span>
          </div>

          <div className="row" style={{ gap: 12 }}>
            <Link className="btn" to={examId ? `/exams/${examId}` : "/exams"}>
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "26px 0 40px" }}>
        <section className="card">
          <div className="cardHeader">
            <h2 style={{ margin: 0 }}>Add question</h2>
            <p className="p" style={{ marginTop: 6 }}>
              Only Admin/Professor can add questions.
            </p>
          </div>

          <div className="cardBody" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!canCreate ? (
              <div className="alert">You don’t have permission to add questions.</div>
            ) : null}

            {error ? <div className="alert">{error}</div> : null}

            <form className="authForm" onSubmit={onSubmit}>
              <div className="field">
                <label className="label">Question text</label>
                <div className="inputWrap">
                  <textarea
                    className="input"
                    value={form.text}
                    onChange={(e) => setForm((s) => ({ ...s, text: e.target.value }))}
                    disabled={!canCreate || saving}
                    style={{ minHeight: 120, resize: "vertical" }}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Type</label>
                <div className="inputWrap">
                  <select
                    className="input"
                    value={form.type}
                    onChange={(e) => setForm((s) => ({ ...s, type: e.target.value as any }))}
                    disabled={!canCreate || saving}
                  >
                    <option value="Theory">Theory</option>
                    <option value="SQL">SQL</option>
                    <option value="Code">Code</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label">Points</label>
                <div className="inputWrap">
                  <input
                    className="input"
                    type="number"
                    min={0}
                    value={form.points}
                    onChange={(e) => setForm((s) => ({ ...s, points: Number(e.target.value) }))}
                    disabled={!canCreate || saving}
                  />
                </div>
              </div>

              <button className="btn btnPrimary" type="submit" disabled={!canCreate || saving}>
                {saving ? "Saving…" : "Add question"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}