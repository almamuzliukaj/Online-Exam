import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStoredUser, getToken, login, me } from "../lib/auth";
import { getDefaultRouteForRole } from "../lib/permissions";

const presets = [
  { label: "Admin demo", email: "admin@onlineexam.com", password: "Password123!" },
  { label: "Professor demo", email: "prof@onlineexam.com", password: "Password123!" },
  { label: "Assistant demo", email: "assistant@onlineexam.com", password: "Password123!" },
  { label: "Student demo", email: "student@onlineexam.com", password: "Password123!" },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@onlineexam.com");
  const [password, setPassword] = useState("Password123!");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function resumeSession() {
      if (!getToken()) return;

      const storedUser = getStoredUser();
      if (storedUser?.role) {
        navigate(getDefaultRouteForRole(storedUser.role), { replace: true });
        return;
      }

      const profile = await me();
      if (profile?.role) {
        navigate(getDefaultRouteForRole(profile.role), { replace: true });
      }
    }

    resumeSession();
  }, [navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const authResponse = await login(email, password);
      const profile = await me();
      const role = profile?.role || authResponse?.role;
      const requestedPath = location.state?.from?.pathname;
      const fallbackPath = getDefaultRouteForRole(role);

      navigate(requestedPath || fallbackPath, { replace: true });
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      setError(String(apiMessage));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginShell">
      <div className="loginBackdrop" />
      <div className="loginContent">
        <section className="loginIntro">
          <div className="eyebrow">University exam management platform</div>
          <h1 className="loginTitle">A cleaner operational entry point for every academic role.</h1>
          <p className="loginText">
            Sign in to a workspace that adapts its navigation, dashboard focus, and protected routes for administrators, professors, assistants, and students.
          </p>

          <div className="loginFeatureGrid">
            <article className="featureTile">
              <strong>Role-aware shell</strong>
              <span>Shared sidebar, header, and responsive layout reused across protected pages.</span>
            </article>
            <article className="featureTile">
              <strong>Secure entry flow</strong>
              <span>Login resolves the current role and sends each user to the right starting workspace.</span>
            </article>
            <article className="featureTile">
              <strong>Professional navigation</strong>
              <span>Each role sees only the navigation and operations that belong to that access level.</span>
            </article>
          </div>
        </section>

        <section className="loginPanel">
          <div className="brand brandLarge">
            <img className="brandLogo" src="/logo-itm.svg" alt="ITM Exam logo" />
            <span>
              <strong>ITM Exam</strong>
              <small>Role-based university workspace</small>
            </span>
          </div>

          <div className="stackLg">
            <div>
              <h2 className="panelTitle">Sign in</h2>
              <p className="panelText">Account provisioning is handled by administrators. Use a role demo or sign in with your assigned credentials.</p>
            </div>

            <div className="presetRow">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="presetChip"
                  onClick={() => {
                    setEmail(preset.email);
                    setPassword(preset.password);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <form className="stackLg" onSubmit={onSubmit}>
              {error ? <div className="alert">{error}</div> : null}

              <div className="field">
                <label className="label">Email address</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@faculty.edu"
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Password</label>
                <div className="inputWrap">
                  <input
                    className="input"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="btn inputRightBtn"
                    onClick={() => setShow((value) => !value)}
                    disabled={loading}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="btn btnPrimary btnBlock" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Enter workspace"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
