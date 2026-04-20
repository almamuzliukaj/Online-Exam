import { Link, useNavigate, useParams } from "react-router-dom";
import { addQuestion, getExam } from "../../lib/examsApi";
import { canManageExams } from "../../lib/permissions";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import AppShell from "../../components/AppShell";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function QuestionCreatePage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { examId } = useParams();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [exam, setExam] = useState(null);
  const [form, setForm] = useState({
    text: "",
    type: "MCQ",
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
        setError(t("questionCreate.loadExamError"));
      } finally {
        setLoadingExam(false);
      }
    })();
  }, [examId, t]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!examId || !canEdit || !form.text.trim()) return;

    try {
      setSaving(true);
      setError("");
      await addQuestion(examId, {
        text: form.text.trim(),
        type: form.type,
        points: Number(form.points) || 0,
      });
      nav(`/exams/${examId}`);
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message;

      setError(apiMessage || t("questionCreate.saveError"));
    } finally {
      setSaving(false);
    }
  }

  if (userLoading) {
    return <div className="pageState">{t("questionCreate.loading")}</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || t("questionCreate.userError")}</div>;
  }

  return (
    <AppShell
      user={user}
      badge={t("questionCreate.badge")}
      title={t("questionCreate.title")}
      subtitle={loadingExam ? t("questionCreate.subtitleLoading") : t("questionCreate.subtitle", { title: exam?.title || t("examDetails.titleFallback") })}
      actions={<Link className="btn" to={`/exams/${examId}`}>{t("questionCreate.backToExam")}</Link>}
    >
      <section className="formSurface">
        <div className="surfaceCard">
          <div className="sectionHeader">
            <h3>{t("questionCreate.content")}</h3>
          </div>
          <div className="sectionBody">
            {error ? <div className="alert">{error}</div> : null}
            <form className="stackLg" onSubmit={onSubmit}>
              <div className="field">
                <label className="label">{t("questionCreate.prompt")}</label>
                <textarea
                  className="input textarea"
                  value={form.text}
                  onChange={(e) => setForm((current) => ({ ...current, text: e.target.value }))}
                  disabled={saving || loadingExam}
                  placeholder={t("questionCreate.promptPlaceholder")}
                  rows={6}
                />
              </div>

              <div className="field">
                <label className="label">{t("questionCreate.type")}</label>
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))}
                  disabled={saving || loadingExam}
                >
                  <option value="MCQ">MCQ</option>
                  <option value="Text">{t("common.text")}</option>
                  <option value="Code">{t("common.code")}</option>
                </select>
              </div>

              <div className="field">
                <label className="label">{t("questionCreate.points")}</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.points}
                  onChange={(e) => setForm((current) => ({ ...current, points: Number(e.target.value) }))}
                  disabled={saving || loadingExam}
                />
              </div>

              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button className="btn btnPrimary" type="submit" disabled={saving || loadingExam || !canEdit || !form.text.trim()}>
                  {saving ? t("questionCreate.saving") : t("questionCreate.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
