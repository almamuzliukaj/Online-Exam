import { Link } from "react-router-dom";

const dashboardConfig = {
  Admin: {
    badge: "Administration",
    heroTitle: "Control the academic cycle from one operational workspace.",
    heroText:
      "Manage user onboarding, monitor platform readiness, and keep semesters, staff assignments, and exam operations aligned.",
    stats: [
      { label: "Active users", value: "184", meta: "+12 this week" },
      { label: "Course offerings", value: "34", meta: "Across 6 semesters" },
      { label: "Pending imports", value: "03", meta: "Require review" },
      { label: "Policy alerts", value: "02", meta: "Need admin action" },
    ],
    quickActions: [
      { label: "Manage users", to: "/admin/users" },
      { label: "Review exams", to: "/exams" },
    ],
    sections: [
      {
        title: "Operational priorities",
        items: [
          "Review newly imported students before semester activation.",
          "Confirm professor and assistant assignments for course offerings.",
          "Validate inactive accounts before the next exam window.",
        ],
      },
      {
        title: "Recommended next moves",
        items: [
          "Add enrollment workflows so students map to current and carry-over subjects.",
          "Connect role dashboards to real aggregate APIs.",
          "Finalize exam publishing and monitoring flows.",
        ],
      },
    ],
  },
  Professor: {
    badge: "Professor Workspace",
    heroTitle: "Design exams, manage question quality, and supervise assessment readiness.",
    heroText:
      "Your dashboard groups teaching responsibilities, exam creation tasks, and grading priorities in one place.",
    stats: [
      { label: "Assigned courses", value: "05", meta: "Across Years 1-3" },
      { label: "Draft exams", value: "04", meta: "Awaiting completion" },
      { label: "Question bank", value: "128", meta: "Tagged by difficulty" },
      { label: "Pending grading", value: "17", meta: "Assistant-linked included" },
    ],
    quickActions: [
      { label: "Open exam workspace", to: "/exams" },
      { label: "Create exam", to: "/exams/new" },
    ],
    sections: [
      {
        title: "This week's focus",
        items: [
          "Build exams from approved question banks per semester.",
          "Review assistant-created assessments and their grading progress.",
          "Prepare publish-ready schedules for active exam windows.",
        ],
      },
      {
        title: "Course organization",
        items: [
          "Year 1: Programming Fundamentals, Database Systems",
          "Year 2: Algorithms, Operating Systems",
          "Year 3: Software Engineering",
        ],
      },
    ],
  },
  Assistant: {
    badge: "Assistant Workspace",
    heroTitle: "Support course delivery, exam execution, and grading coordination.",
    heroText:
      "Use this area to track assigned offerings, exam support tasks, and grading responsibilities under your professor's courses.",
    stats: [
      { label: "Assigned offerings", value: "03", meta: "Current semester" },
      { label: "Support exams", value: "06", meta: "Including live sessions" },
      { label: "Review tasks", value: "14", meta: "Short-answer grading" },
      { label: "Active sessions", value: "01", meta: "Monitoring enabled soon" },
    ],
    quickActions: [{ label: "Open assigned exams", to: "/exams" }],
    sections: [
      {
        title: "Responsibilities",
        items: [
          "Support exam preparation and monitor assigned assessments.",
          "Review student outcomes for exams created under your course offerings.",
          "Escalate publishing and unlock decisions to the professor.",
        ],
      },
      {
        title: "Operational notes",
        items: [
          "Assistant dashboards should expose grades and support actions, not global exam ownership.",
          "Live monitoring and violation logs will appear here once the proctoring module is implemented.",
        ],
      },
    ],
  },
  Student: {
    badge: "Student Workspace",
    heroTitle: "Track eligible exams, upcoming deadlines, and your result history.",
    heroText:
      "Your dashboard is focused on what you can actually act on: active-semester exams, carry-over opportunities, and published outcomes.",
    stats: [
      { label: "Eligible exams", value: "03", meta: "Current visibility rules" },
      { label: "Upcoming windows", value: "02", meta: "Next 7 days" },
      { label: "Published results", value: "05", meta: "Ready to download" },
      { label: "Carry-over exams", value: "01", meta: "Professor unlock required" },
    ],
    quickActions: [{ label: "View exams", to: "/exams" }],
    sections: [
      {
        title: "What you should see here",
        items: [
          "Only subjects from your active semester.",
          "Carry-over exams only when explicitly unlocked.",
          "Published results after staff approval.",
        ],
      },
      {
        title: "Security expectations",
        items: [
          "Exam access will later include QR entry and focused-session rules.",
          "Attempt status, timer, and result downloads will appear as the student flow is completed.",
        ],
      },
    ],
  },
};

export default function RoleDashboardPanels({ role = "Student" }) {
  const config = dashboardConfig[role] || dashboardConfig.Student;

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
