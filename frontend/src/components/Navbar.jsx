import { useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";
import styles from "./Navbar.module.css";

/**
 * @param {{ userEmail?: string; userRole?: string }} props
 */
export default function Navbar({ userEmail, userRole }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon} aria-hidden="true">🎓</span>
        <span className={styles.brandName}>OnlineExam</span>
      </div>

      <div className={styles.actions}>
        {userEmail && (
          <div className={styles.chip}>
            <span className={styles.avatar} aria-hidden="true">{initials}</span>
            <span className={styles.chipText}>
              <span className={styles.chipEmail}>{userEmail}</span>
              {userRole && (
                <span className={styles.chipRole}>{userRole}</span>
              )}
            </span>
          </div>
        )}

        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Logout"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
