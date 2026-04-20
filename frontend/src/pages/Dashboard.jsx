import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppShell from "../components/AppShell";
import RoleDashboardPanels from "../components/RoleDashboardPanels";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { isAdmin } from "../lib/permissions";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, loading, error } = useCurrentUser();

  if (loading) {
    return <div className="pageState">{t("dashboard.loading")}</div>;
  }

  if (!user) {
    return <div className="pageState">{error || t("dashboard.error")}</div>;
  }

  return (
    <AppShell
      user={user}
      badge={t(`dashboard.badges.${user.role}`, { defaultValue: user.role })}
      title={t("dashboard.title")}
      subtitle={t("dashboard.subtitle")}
      actions={
        <>
          <Link className="btn" to="/exams">{t("dashboard.examWorkspace")}</Link>
          {isAdmin(user.role) ? <Link className="btn btnPrimary" to="/admin/users">{t("dashboard.userManagement")}</Link> : null}
        </>
      }
    >
      <RoleDashboardPanels role={user.role} />
    </AppShell>
  );
}
