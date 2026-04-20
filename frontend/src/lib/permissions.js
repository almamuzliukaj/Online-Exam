const ROLE_NAVIGATION = {
  Admin: [
    { to: "/dashboard", label: "Overview", description: "Operational summary and readiness notes." },
    { to: "/admin/users", label: "Users", description: "Provision accounts and manage access states." },
    { to: "/admin/courses", label: "Courses", description: "Maintain the academic catalog." },
    { to: "/admin/offerings", label: "Offerings", description: "Configure term-based course delivery." },
  ],
  Professor: [
    { to: "/dashboard", label: "Overview", description: "Teaching and assessment priorities." },
    { to: "/exams", label: "My exams", description: "Drafts, published exams, and ownership-bound work." },
    { to: "/exams/new", label: "Create exam", description: "Start a new assessment workspace." },
  ],
  Assistant: [
    { to: "/dashboard", label: "Overview", description: "Assigned offering and assessment support view." },
    { to: "/exams", label: "Assigned exams", description: "Exam workspaces relevant to your role." },
  ],
  Student: [
    { to: "/dashboard", label: "Overview", description: "Eligibility, deadlines, and published results." },
    { to: "/exams", label: "Eligible exams", description: "Exam windows available to you." },
  ],
};

const ROLE_HOME = {
  Admin: "/admin/users",
  Professor: "/exams",
  Assistant: "/exams",
  Student: "/dashboard",
};

export function normalizeRole(role) {
  if (!role) return "Student";

  const value = String(role).trim().toLowerCase();
  if (value === "admin") return "Admin";
  if (value === "professor") return "Professor";
  if (value === "assistant") return "Assistant";
  return "Student";
}

export function getRoleNavigation(role) {
  return ROLE_NAVIGATION[normalizeRole(role)] || ROLE_NAVIGATION.Student;
}

export function getDefaultRouteForRole(role) {
  return ROLE_HOME[normalizeRole(role)] || "/dashboard";
}

export function canManageUsers(role) {
  return normalizeRole(role) === "Admin";
}

export function canAccessExamWorkspace(role) {
  return normalizeRole(role) !== "Admin";
}

export function canCreateExams(role) {
  const normalized = normalizeRole(role);
  return normalized === "Professor" || normalized === "Assistant";
}

export function canCreateQuestions(role) {
  return normalizeRole(role) === "Professor";
}

export function isAdmin(role) {
  return normalizeRole(role) === "Admin";
}
