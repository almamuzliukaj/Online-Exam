import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDashboardSummary } from "../lib/dashboardApi";

export default function RoleDashboardPanels({ role = "Student" }) {
  const { t } = useTranslation();
  const roleKey = role.toLowerCase();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDashboardSummary();
        if (active) setSummary(data);
      } catch {
        if (active) setError(t("dashboard.statsError"));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [t]);

  const config = getDashboardConfig(roleKey, t, summary?.metrics, loading, Boolean(error));

  return (
    <div className="stackXl">
      {error ? <div className="alert">{error}</div> : null}

      <section className="heroPanel">
        <div className="heroCopy">
          <div className="eyebrow">{config.badge}</div>
          <h2 className="heroTitle">{config.heroTitle}</h2>
          <p className="heroText">{config.heroText}</p>
          <div className="heroActions">
            {config.quickActions.map((action) => (
              <Link key={action.to} className="btn btnPrimary" to={action.to}>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="heroStats">
          {config.stats.map((stat) => (
            <article key={stat.label} className="metricCard">
              <div className="metricValue">{stat.value}</div>
              <div className="metricLabel">{stat.label}</div>
              <div className="metricMeta">{stat.meta}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboardGrid">
        {config.sections.map((section) => (
          <article key={section.title} className="surfaceCard">
            <div className="sectionHeader">
              <h3>{section.title}</h3>
            </div>
            <div className="sectionBody">
              <div className="bulletStack">
                {section.items.map((item) => (
                  <div key={item} className="listRow">
                    <span className="listDot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function getDashboardConfig(roleKey, t, metrics = {}, loading = false, hasError = false) {
  const fallback = "student";
  const current = ["admin", "professor", "assistant", "student"].includes(roleKey) ? roleKey : fallback;
  const value = (key) => formatMetric(metrics?.[key], loading, hasError);

  const statsByRole = {
    admin: [
      { label: t("rolePanels.admin.stats.activeUsers.label"), value: value("activeUsers"), meta: t("rolePanels.admin.stats.activeUsers.meta") },
      { label: t("rolePanels.admin.stats.offerings.label"), value: value("offerings"), meta: t("rolePanels.admin.stats.offerings.meta") },
      { label: t("rolePanels.admin.stats.imports.label"), value: value("imports"), meta: t("rolePanels.admin.stats.imports.meta") },
      { label: t("rolePanels.admin.stats.alerts.label"), value: value("alerts"), meta: t("rolePanels.admin.stats.alerts.meta") },
    ],
    professor: [
      { label: t("rolePanels.professor.stats.assignedCourses.label"), value: value("assignedCourses"), meta: t("rolePanels.professor.stats.assignedCourses.meta") },
      { label: t("rolePanels.professor.stats.draftExams.label"), value: value("draftExams"), meta: t("rolePanels.professor.stats.draftExams.meta") },
      { label: t("rolePanels.professor.stats.questionBank.label"), value: value("questionBank"), meta: t("rolePanels.professor.stats.questionBank.meta") },
      { label: t("rolePanels.professor.stats.grading.label"), value: value("grading"), meta: t("rolePanels.professor.stats.grading.meta") },
    ],
    assistant: [
      { label: t("rolePanels.assistant.stats.assignedOfferings.label"), value: value("assignedOfferings"), meta: t("rolePanels.assistant.stats.assignedOfferings.meta") },
      { label: t("rolePanels.assistant.stats.supportExams.label"), value: value("supportExams"), meta: t("rolePanels.assistant.stats.supportExams.meta") },
      { label: t("rolePanels.assistant.stats.reviewTasks.label"), value: value("reviewTasks"), meta: t("rolePanels.assistant.stats.reviewTasks.meta") },
      { label: t("rolePanels.assistant.stats.activeSessions.label"), value: value("activeSessions"), meta: t("rolePanels.assistant.stats.activeSessions.meta") },
    ],
    student: [
      { label: t("rolePanels.student.stats.eligibleExams.label"), value: value("eligibleExams"), meta: t("rolePanels.student.stats.eligibleExams.meta") },
      { label: t("rolePanels.student.stats.upcoming.label"), value: value("upcoming"), meta: t("rolePanels.student.stats.upcoming.meta") },
      { label: t("rolePanels.student.stats.results.label"), value: value("results"), meta: t("rolePanels.student.stats.results.meta") },
      { label: t("rolePanels.student.stats.carryOver.label"), value: value("carryOver"), meta: t("rolePanels.student.stats.carryOver.meta") },
    ],
  };

  const quickActionsByRole = {
    admin: [
      { label: t("rolePanels.admin.quickActions.academicSetup"), to: "/admin/academic" },
      { label: t("rolePanels.admin.quickActions.manageUsers"), to: "/admin/users" },
    ],
    professor: [
      { label: t("rolePanels.professor.quickActions.openExams"), to: "/exams" },
      { label: t("rolePanels.professor.quickActions.createExam"), to: "/exams/new" },
    ],
    assistant: [
      { label: t("rolePanels.assistant.quickActions.assignedExams"), to: "/exams" },
    ],
    student: [
      { label: t("rolePanels.student.quickActions.viewExams"), to: "/exams" },
    ],
  };

  const sectionsByRole = {
    admin: [
      {
        title: t("rolePanels.admin.sections.priorities.title"),
        items: t("rolePanels.admin.sections.priorities.items", { returnObjects: true }),
      },
      {
        title: t("rolePanels.admin.sections.nextMoves.title"),
        items: t("rolePanels.admin.sections.nextMoves.items", { returnObjects: true }),
      },
    ],
    professor: [
      {
        title: t("rolePanels.professor.sections.focus.title"),
        items: t("rolePanels.professor.sections.focus.items", { returnObjects: true }),
      },
      {
        title: t("rolePanels.professor.sections.courses.title"),
        items: t("rolePanels.professor.sections.courses.items", { returnObjects: true }),
      },
    ],
    assistant: [
      {
        title: t("rolePanels.assistant.sections.responsibilities.title"),
        items: t("rolePanels.assistant.sections.responsibilities.items", { returnObjects: true }),
      },
      {
        title: t("rolePanels.assistant.sections.notes.title"),
        items: t("rolePanels.assistant.sections.notes.items", { returnObjects: true }),
      },
    ],
    student: [
      {
        title: t("rolePanels.student.sections.visible.title"),
        items: t("rolePanels.student.sections.visible.items", { returnObjects: true }),
      },
      {
        title: t("rolePanels.student.sections.security.title"),
        items: t("rolePanels.student.sections.security.items", { returnObjects: true }),
      },
    ],
  };

  return {
    badge: t(`rolePanels.${current}.badge`),
    heroTitle: t(`rolePanels.${current}.heroTitle`),
    heroText: t(`rolePanels.${current}.heroText`),
    stats: statsByRole[current],
    quickActions: quickActionsByRole[current],
    sections: sectionsByRole[current],
  };
}

function formatMetric(rawValue, loading, hasError) {
  if (loading) return "...";
  if (hasError) return "--";
  const value = Number(rawValue ?? 0);
  if (!Number.isFinite(value)) return "00";
  return String(value).padStart(2, "0");
}
