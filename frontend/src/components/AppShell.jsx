import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";
import { getRoleNavigation, normalizeRole } from "../lib/permissions";

export default function AppShell({
  user,
  title,
  subtitle,
  badge,
  actions,
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const role = normalizeRole(user?.role);
  const items = getRoleNavigation(role);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout({ redirect: false });
    navigate("/login");
  }

  return (
    <div className="appShell">
      <aside className={`sidebar${isSidebarOpen ? " sidebarOpen" : ""}`}>
        <div className="sidebarTop">
          <Link className="brand brandLarge" to="/dashboard">
            <img className="brandLogo" src="/logo-itm.svg" alt="ITM Exam logo" />
            <span>
              <strong>ITM Exam</strong>
              <small>University Assessment Platform</small>
            </span>
          </Link>

          <div className="sidebarIdentity">
            <div className="avatarCircle">{getInitials(user)}</div>
            <div>
              <div className="sidebarLabel">Signed in</div>
              <div className="sidebarValue">{user?.fullName || user?.email || "Unknown user"}</div>
              <div className="sidebarMeta">{role}</div>
            </div>
          </div>
        </div>

        <div className="sidebarBody">
          <nav className="sidebarNav">
            <div className="sidebarSectionTitle">Navigation</div>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `navItem${isActive ? " navItemActive" : ""}`}
              >
                <span className="navItemLabel">{item.label}</span>
                <span className="navItemMeta">{item.description}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebarFoot">
            <div className="supportPanel">
              <div className="sidebarSectionTitle">Access model</div>
              <p>{getOperationalNote(role)}</p>
            </div>
            <div className="sidebarSectionTitle">Session</div>
            <button className="btn btnGhost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className={`shellBackdrop${isSidebarOpen ? " shellBackdropVisible" : ""}`} onClick={() => setIsSidebarOpen(false)} />

      <div className="mainPanel">
        <div className="mainPanelInner">
          <header className="topbar">
            <div className="topbarIntro">
              <button className="shellMenuBtn" type="button" onClick={() => setIsSidebarOpen((value) => !value)}>
                Menu
              </button>
              {badge ? <div className="eyebrow">{badge}</div> : null}
              <h1 className="pageTitle">{title}</h1>
              {subtitle ? <p className="pageSubtitle">{subtitle}</p> : null}
            </div>

            <div className="topbarMeta">
              <div className="topbarIdentity">
                <span className="topbarRolePill">{role}</span>
                <div className="topbarUserBlock">
                  <strong>{user?.fullName || user?.email}</strong>
                  <span>{user?.email}</span>
                </div>
              </div>
              <div className="topbarActions">{actions}</div>
            </div>
          </header>

          <main className="contentArea">{children}</main>
        </div>
      </div>
    </div>
  );
}

function getInitials(user) {
  const source = user?.fullName || user?.email || "ITM Exam";
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "IE";
}

function getOperationalNote(role) {
  if (role === "Admin") {
    return "Administrators manage users and academic configuration, while exam content remains separated from this workspace.";
  }

  if (role === "Professor") {
    return "You should only see exam workspaces and question flows tied to your own teaching responsibilities.";
  }

  if (role === "Assistant") {
    return "This workspace is limited to assigned offerings and exam support activities relevant to your role.";
  }

  return "Students only see eligible exam actions, current-semester visibility, and published result information.";
}
