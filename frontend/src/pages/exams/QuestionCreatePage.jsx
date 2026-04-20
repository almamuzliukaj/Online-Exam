import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { addQuestion, getExam } from "../../lib/examsApi";
import { canManageExams } from "../../lib/permissions";

export default function QuestionCreatePage() {
  const nav = useNavigate();
  const { examId } = useParams();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [exam, setExam] = useState(null);
  const [form, setForm] = useState({
    text: "",
    type: "MCQ",
    difficulty: "Medium",
    correctAnswer: "",
    starterCode: "",
    testCases: [{ input: "", expectedOutput: "", isHidden: false, weight: 1 }],
    points: 10,
  });
  const [saving, setSaving] = useState(false);
  const [loadingExam, setLoadingExam] = useState(true);
  const [error, setError] = useState("");

  const canEdit = useMemo(() => canManageExams(user?.role), [user?.role]);

  useEffect(() => {
    if (!examId) return;

    (async () => {
      try {
        setLoadingExam(true);
        const data = await getExam(examId);
        setExam(data);
      } catch {
        setError("Failed to load exam.");
      } finally {
        setLoadingExam(false);
      }
    })();
  }, [examId]);

  async function onSubmit(event) {
    event.preventDefault();
    if (!examId || !canEdit || !form.text.trim()) return;

    try {
      setSaving(true);
      setError("");
      await addQuestion(examId, {
        text: form.text.trim(),
        type: form.type,
        difficulty: form.difficulty,
        correctAnswer: requiresLanguage(form.type) ? null : form.correctAnswer?.trim() || null,
        answerLanguage: requiresLanguage(form.type) ? form.type : null,
        starterCode: requiresLanguage(form.type) ? form.starterCode : null,
        testCases: requiresLanguage(form.type)
          ? form.testCases.map((testCase) => ({
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              isHidden: testCase.isHidden,
              weight: Number(testCase.weight) || 1,
            }))
          : [],
        points: Number(form.points) || 0,
      });
      nav(`/exams/${examId}`);
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message;

      setError(apiMessage || "Failed to add question.");
    } finally {
      setSaving(false);
    }
  }

  if (userLoading) {
    return <div className="pageState">Loading question editor...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load user profile."}</div>;
  }

  return (
    <AppShell
      user={user}
      badge="Question authoring"
      title="Add question"
      subtitle={loadingExam ? "Loading exam context..." : `Create a new question for ${exam?.title || "this exam"}.`}
      actions={<Link className="btn" to={`/exams/${examId}`}>Back to exam</Link>}
    >
      <section className="formSurface">
        <div className="surfaceCard">
          <div className="sectionHeader">
            <h3>Question content</h3>
          </div>
          <div className="sectionBody">
            {error ? <div className="alert">{error}</div> : null}
            <form className="stackLg" onSubmit={onSubmit}>
              <div className="field">
                <label className="label">Prompt</label>
                <textarea
                  className="input textarea"
                  value={form.text}
                  onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
                  disabled={saving || loadingExam}
                  placeholder="Write the question prompt here."
                  rows={6}
                />
              </div>

              <div className="gridThree">
                <div className="field">
                  <label className="label">Type</label>
                  <select
                    className="input"
                    value={form.type}
                    onChange={(event) => setForm((current) => ({
                      ...current,
                      type: event.target.value,
                      starterCode: "",
                      correctAnswer: "",
                      testCases: [{ input: "", expectedOutput: "", isHidden: false, weight: 1 }],
                    }))}
                    disabled={saving || loadingExam}
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Text">Text</option>
                    <option value="CSharp">C#</option>
                    <option value="SQL">SQL</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Difficulty</label>
                  <select
                    className="input"
                    value={form.difficulty}
                    onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))}
                    disabled={saving || loadingExam}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Points</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={form.points}
                    onChange={(event) => setForm((current) => ({ ...current, points: Number(event.target.value) }))}
                    disabled={saving || loadingExam}
                  />
                </div>
              </div>

              {!requiresLanguage(form.type) ? (
                <div className="field">
                  <label className="label">Expected answer</label>
                  <input
                    className="input"
                    value={form.correctAnswer}
                    onChange={(event) => setForm((current) => ({ ...current, correctAnswer: event.target.value }))}
                    disabled={saving || loadingExam}
                    placeholder={form.type === "MCQ" ? "Correct option key or canonical answer" : "Expected answer or grading note"}
                  />
                </div>
              ) : null}

              {requiresLanguage(form.type) ? (
                <>
                  <div className="field">
                    <label className="label">Language</label>
                    <input className="input" value={form.type} disabled />
                  </div>

                  <div className="field">
                    <label className="label">Starter code / starter query</label>
                    <textarea
                      className="input textarea"
                      value={form.starterCode}
                      onChange={(event) => setForm((current) => ({ ...current, starterCode: event.target.value }))}
                      disabled={saving || loadingExam}
                      placeholder={form.type === "CSharp" ? "public class Solution { ... }" : "SELECT * FROM Students;"}
                      rows={8}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Test cases</label>
                    <div className="stackLg">
                      {form.testCases.map((testCase, index) => (
                        <div key={`test-case-${index}`} className="surfaceCard">
                          <div className="sectionBody stackLg">
                            <div className="gridThree">
                              <div className="field">
                                <label className="label">Weight</label>
                                <input
                                  className="input"
                                  type="number"
                                  min="1"
                                  value={testCase.weight}
                                  onChange={(event) => updateTestCase(index, "weight", Number(event.target.value), setForm)}
                                  disabled={saving || loadingExam}
                                />
                              </div>
                              <label className="checkboxRow" style={{ marginTop: 30 }}>
                                <input
                                  type="checkbox"
                                  checked={testCase.isHidden}
                                  onChange={(event) => updateTestCase(index, "isHidden", event.target.checked, setForm)}
                                  disabled={saving || loadingExam}
                                />
                                <span>Hidden test case</span>
                              </label>
                              <div className="row rowStart" style={{ marginTop: 24 }}>
                                <button
                                  className="btn"
                                  type="button"
                                  onClick={() => removeTestCase(index, setForm)}
                                  disabled={saving || loadingExam || form.testCases.length === 1}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            <div className="field">
                              <label className="label">Input</label>
                              <textarea
                                className="input textarea"
                                value={testCase.input}
                                onChange={(event) => updateTestCase(index, "input", event.target.value, setForm)}
                                disabled={saving || loadingExam}
                                rows={4}
                                placeholder={form.type === "CSharp" ? "stdin or execution context" : "dataset or setup context"}
                              />
                            </div>

                            <div className="field">
                              <label className="label">Expected output</label>
                              <textarea
                                className="input textarea"
                                value={testCase.expectedOutput}
                                onChange={(event) => updateTestCase(index, "expectedOutput", event.target.value, setForm)}
                                disabled={saving || loadingExam}
                                rows={4}
                                placeholder={form.type === "CSharp" ? "Expected stdout/result" : "Expected query result signature"}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="row rowStart">
                        <button className="btn" type="button" onClick={() => addTestCase(setForm)} disabled={saving || loadingExam}>
                          Add test case
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button
                  className="btn btnPrimary"
                  type="submit"
                  disabled={saving || loadingExam || !canEdit || !form.text.trim() || !isQuestionFormReady(form)}
                >
                  {saving ? "Saving..." : "Save question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function requiresLanguage(type) {
  return type === "CSharp" || type === "SQL";
}

function isQuestionFormReady(form) {
  if (!requiresLanguage(form.type)) {
    return true;
  }

  return form.testCases.length > 0 && form.testCases.every((testCase) => testCase.expectedOutput.trim());
}

function addTestCase(setForm) {
  setForm((current) => ({
    ...current,
    testCases: [...current.testCases, { input: "", expectedOutput: "", isHidden: false, weight: 1 }],
  }));
}

function removeTestCase(index, setForm) {
  setForm((current) => ({
    ...current,
    testCases: current.testCases.filter((_, currentIndex) => currentIndex !== index),
  }));
}

function updateTestCase(index, key, value, setForm) {
  setForm((current) => ({
    ...current,
    testCases: current.testCases.map((testCase, currentIndex) =>
      currentIndex === index ? { ...testCase, [key]: value } : testCase,
    ),
  }));
}
