import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import RoleDashboardPanels from "../components/RoleDashboardPanels";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { isAdmin } from "../lib/permissions";

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
          <Link className="btn" to="/exams">Exam workspace</Link>
          {isAdmin(user.role) ? (
            <>
              <Link className="btn" to="/admin/courses">Academic catalog</Link>
              <Link className="btn btnPrimary" to="/admin/users">User management</Link>
            </>
          ) : null}
        </>
      }
    >
      <RoleDashboardPanels role={user.role} />
    </AppShell>
  );
}
