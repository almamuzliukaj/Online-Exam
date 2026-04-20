import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/auth";

const presets = [
  { label: "Admin demo", email: "admin@onlineexam.com", password: "Password123!" },
  { label: "Professor demo", email: "prof@onlineexam.com", password: "Password123!" },
  { label: "Student demo", email: "student@onlineexam.com", password: "Password123!" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@onlineexam.com");
  const [password, setPassword] = useState("Password123!");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      const apiMessage =
 feature/agnesa-admin-academic-structure
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message;
      setError(apiMessage || err?.message || "Login failed");

        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      setError(String(apiMessage));
main
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginShell">
      <div className="loginBackdrop" />
      <div className="loginContent">
        <section className="loginIntro">
          <div className="eyebrow">Exam operations platform</div>
          <h1 className="loginTitle">Run academic assessment with clarity, structure, and control.</h1>
          <p className="loginText">
            Built for departments that need role-based onboarding, exam preparation, question bank workflows, and a clean student-facing experience.
          </p>
          <div className="loginFeatureGrid">
            <article className="featureTile">
              <strong>Admin operations</strong>
              <span>User onboarding, imports, staff management, and semester control.</span>
            </article>
            <article className="featureTile">
              <strong>Teaching workflows</strong>
              <span>Question authoring, exam setup, publishing, and grading readiness.</span>
            </article>
            <article className="featureTile">
              <strong>Student delivery</strong>
              <span>Focused access to eligible exams, results, and carry-over opportunities.</span>
            </article>
          </div>
        </section>

        <section className="loginPanel">
          <div className="brand brandLarge">
            <span className="logoMark" />
            <span>
              <strong>Online Exam</strong>
              <small>Department workspace</small>
            </span>
          </div>

          <div className="stackLg">
            <div>
              <h2 className="panelTitle">Sign in</h2>
              <p className="panelText">Access your role-based workspace. Account provisioning is handled by the administrator.</p>
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
