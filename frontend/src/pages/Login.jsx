import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/auth";

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
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <div className="center">
        <div className="card authCard">
          <div className="cardHeader">
            <div className="brand">
              <img className="brandLogo" src="/logo-itm.svg" alt="ITM Exam logo" />
              <span>ITM Exam</span>
            </div>
            <h1 className="h1" style={{ marginTop: 14 }}>Welcome back</h1>
            <p className="p">Sign in to access your exam workspace.</p>
          </div>

          <div className="cardBody">
            <form className="authForm" onSubmit={onSubmit}>
              {error ? <div className="alert">{error}</div> : null}

              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="field">
                <div className="label">Password</div>
                <div className="inputWrap">
                  <input
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={show ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn inputRightBtn"
                    onClick={() => setShow((s) => !s)}
                    disabled={loading}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="btn btnPrimary" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="small">Account creation is managed by the administrator.</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
