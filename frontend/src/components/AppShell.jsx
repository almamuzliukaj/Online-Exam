import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

const navigationByRole = {
  Admin: [
    { to: "/dashboard", label: "Overview" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/courses", label: "Courses" },
    { to: "/admin/offerings", label: "Offerings" },
    { to: "/exams", label: "Exams" },
  ],
  Professor: [
    { to: "/dashboard", label: "Overview" },
    { to: "/exams", label: "My exams" },
    { to: "/exams/new", label: "Create exam" },
  ],
  Assistant: [
    { to: "/dashboard", label: "Overview" },
    { to: "/exams", label: "Assigned exams" },
  ],
  Student: [
    { to: "/dashboard", label: "Overview" },
    { to: "/exams", label: "Available exams" },
  ],
};

export default function AppShell({
  user,
  title,
  subtitle,
  badge,
  actions,
  children,
}) {
  const navigate = useNavigate();
  const items = navigationByRole[user?.role] || navigationByRole.Student;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="sidebarTop">
          <Link className="brand brandLarge" to="/dashboard">
            <span className="logoMark" />
            <span>
              <strong>Online Exam</strong>
              <small>Faculty Operations Suite</small>
            </span>
          </Link>

          <div className="sidebarIdentity">
            <div className="avatarCircle">{getInitials(user?.email)}</div>
            <div>
              <div className="sidebarLabel">Signed in</div>
              <div className="sidebarValue">{user?.email || "Unknown user"}</div>
              <div className="sidebarMeta">{user?.role || "Guest"}</div>
            </div>
          </div>
        </div>

        <nav className="sidebarNav">
          <div className="sidebarSectionTitle">Workspace</div>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `navItem${isActive ? " navItemActive" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebarFoot">
          <div className="supportPanel">
            <div className="sidebarSectionTitle">Operational note</div>
            <p>
              This workspace is structured for role-based academic operations and secure exam delivery.
            </p>
          </div>
          <button className="btn btnGhost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="mainPanel">
        <header className="topbar">
          <div>
            {badge ? <div className="eyebrow">{badge}</div> : null}
            <h1 className="pageTitle">{title}</h1>
            {subtitle ? <p className="pageSubtitle">{subtitle}</p> : null}
          </div>
          <div className="topbarActions">{actions}</div>
        </header>

        <main className="contentArea">{children}</main>
      </div>
    </div>
  );
}

function getInitials(email) {
  if (!email) return "OE";
  return email.slice(0, 2).toUpperCase();
}
