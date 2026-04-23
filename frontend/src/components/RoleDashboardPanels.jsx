import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function RoleDashboardPanels({ role = "Student" }) {
  const { t } = useTranslation();
  const roleKey = role.toLowerCase();
  const config = getDashboardConfig(roleKey, t);

  return (
    <div className="stackXl">
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

function getDashboardConfig(roleKey, t) {
  const fallback = "student";
  const current = ["admin", "professor", "assistant", "student"].includes(roleKey) ? roleKey : fallback;

  const statsByRole = {
    admin: [
      { label: t("rolePanels.admin.stats.activeUsers.label"), value: "184", meta: t("rolePanels.admin.stats.activeUsers.meta") },
      { label: t("rolePanels.admin.stats.offerings.label"), value: "34", meta: t("rolePanels.admin.stats.offerings.meta") },
      { label: t("rolePanels.admin.stats.imports.label"), value: "03", meta: t("rolePanels.admin.stats.imports.meta") },
      { label: t("rolePanels.admin.stats.alerts.label"), value: "02", meta: t("rolePanels.admin.stats.alerts.meta") },
    ],
    professor: [
      { label: t("rolePanels.professor.stats.assignedCourses.label"), value: "05", meta: t("rolePanels.professor.stats.assignedCourses.meta") },
      { label: t("rolePanels.professor.stats.draftExams.label"), value: "04", meta: t("rolePanels.professor.stats.draftExams.meta") },
      { label: t("rolePanels.professor.stats.questionBank.label"), value: "128", meta: t("rolePanels.professor.stats.questionBank.meta") },
      { label: t("rolePanels.professor.stats.grading.label"), value: "17", meta: t("rolePanels.professor.stats.grading.meta") },
    ],
    assistant: [
      { label: t("rolePanels.assistant.stats.assignedOfferings.label"), value: "03", meta: t("rolePanels.assistant.stats.assignedOfferings.meta") },
      { label: t("rolePanels.assistant.stats.supportExams.label"), value: "06", meta: t("rolePanels.assistant.stats.supportExams.meta") },
      { label: t("rolePanels.assistant.stats.reviewTasks.label"), value: "14", meta: t("rolePanels.assistant.stats.reviewTasks.meta") },
      { label: t("rolePanels.assistant.stats.activeSessions.label"), value: "01", meta: t("rolePanels.assistant.stats.activeSessions.meta") },
    ],
    student: [
      { label: t("rolePanels.student.stats.eligibleExams.label"), value: "03", meta: t("rolePanels.student.stats.eligibleExams.meta") },
      { label: t("rolePanels.student.stats.upcoming.label"), value: "02", meta: t("rolePanels.student.stats.upcoming.meta") },
      { label: t("rolePanels.student.stats.results.label"), value: "05", meta: t("rolePanels.student.stats.results.meta") },
      { label: t("rolePanels.student.stats.carryOver.label"), value: "01", meta: t("rolePanels.student.stats.carryOver.meta") },
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
