import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import RoleDashboardPanels from "../components/RoleDashboardPanels";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { canAccessExamWorkspace, canManageUsers, isAdmin } from "../lib/permissions";

export default function Dashboard() {
  const { user, loading, error } = useCurrentUser();

  if (loading) {
    return <div className="pageState">Loading workspace...</div>;
  }

  if (!user) {
    return <div className="pageState">{error || "Unable to load dashboard."}</div>;
  }

  return (
    <AppShell
      user={user}
      badge={`${user.role} dashboard`}
      title="Operational overview"
      subtitle="A role-based workspace designed for real academic operations, exam preparation, and secure assessment delivery."
      actions={
        <>
 feature/alma-sprint1-shell-role-entry
          {canAccessExamWorkspace(user.role) ? <Link className="btn" to="/exams">Exam workspace</Link> : null}
          {canManageUsers(user.role) ? (

          <Link className="btn" to="/exams">Exam workspace</Link>
 feature/agnesa-admin-academic-structure
          {isAdmin(user.role) ? <Link className="btn" to="/admin/academic">Academic setup</Link> : null}
          {isAdmin(user.role) ? <Link className="btn btnPrimary" to="/admin/users">User management</Link> : null}

          {isAdmin(user.role) ? (
main
            <>
              <Link className="btn" to="/admin/courses">Academic catalog</Link>
              <Link className="btn btnPrimary" to="/admin/users">User management</Link>
            </>
          ) : null}
 feature/alma-sprint1-shell-role-entry
          {!isAdmin(user.role) && !canAccessExamWorkspace(user.role) ? <Link className="btn" to="/dashboard">Refresh workspace</Link> : null}

main
main
        </>
      }
    >
      <RoleDashboardPanels role={user.role} />
    </AppShell>
  );
}
