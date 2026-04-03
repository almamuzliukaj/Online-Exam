import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, me } from "../lib/auth";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await me();
        if (!cancelled) setProfile(data);
      } catch {
        logout();
        if (!cancelled) navigate("/login", { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.loadingPage} aria-busy="true" aria-label="Loading dashboard">
        <span className={styles.spinner} aria-hidden="true" />
        <span>Loading…</span>
      </div>
    );
  }

  const roleLabel =
    profile?.role === "Admin" ? "Administrator" :
    profile?.role === "Professor" ? "Professor" :
    profile?.role || "Student";

  return (
    <div className={styles.layout}>
      <Navbar userEmail={profile?.email} userRole={profile?.role} />

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Welcome header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Dashboard</h1>
              <p className={styles.pageSubtitle}>
                Welcome back, <strong>{profile?.email}</strong>
              </p>
            </div>
            <span className={styles.roleBadge}>{roleLabel}</span>
          </div>

          {/* Stats row */}
          <div className={styles.statsGrid}>
            <StatCard icon="📋" label="Active Exams" value="—" />
            <StatCard icon="📚" label="Courses" value="—" />
            <StatCard icon="👥" label="Students" value="—" />
            <StatCard icon="✅" label="Completed" value="—" />
          </div>

          {/* Profile detail card */}
          <Card className={styles.profileCard}>
            <h2 className={styles.sectionTitle}>Account Details</h2>
            <dl className={styles.details}>
              <div className={styles.detailRow}>
                <dt className={styles.detailLabel}>Email</dt>
                <dd className={styles.detailValue}>{profile?.email}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt className={styles.detailLabel}>Role</dt>
                <dd className={styles.detailValue}>{roleLabel}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt className={styles.detailLabel}>Auth mode</dt>
                <dd className={styles.detailValue}>
                  {import.meta.env.VITE_USE_MOCK_AUTH === "true"
                    ? <span className={styles.badge}>Mock (dev)</span>
                    : <span className={[styles.badge, styles.badgeLive].join(" ")}>Live API</span>
                  }
                </dd>
              </div>
            </dl>
          </Card>

        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card className={styles.statCard}>
      <span className={styles.statIcon} aria-hidden="true">{icon}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </Card>
  );
}
