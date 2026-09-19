import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/balanceiq.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userName = localStorage.getItem("name");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      navigate(["MANAGER","HR","ADMIN"].includes(role) ? "/manager" : "/employee");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate(["MANAGER","HR","ADMIN"].includes(data.role) ? "/manager" : "/employee");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="biq-login-page">

      {/* ── Left: Form ── */}
      <div className="biq-login-panel" style={{ background: "var(--cream-100)" }}>
        <div className="biq-login-form-wrap">

          <div style={{ marginBottom: "48px" }}>
            <div className="biq-login-logo">Balance<span style={{ color: "var(--green-500)" }}>IQ</span></div>
            <div className="biq-login-tagline">Your workplace wellness companion</div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 600, fontFamily: "var(--font-display)", marginBottom: "6px" }}>
              Welcome back
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Sign in to view your wellness dashboard
            </p>
          </div>

          <div style={{ height: "1px", background: "var(--border-subtle)", margin: "24px 0" }} />

          <div className="biq-form-group">
            <label className="biq-label">Work email</label>
            <input
              className="biq-input"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="biq-form-group">
            <label className="biq-label">Password</label>
            <input
              className="biq-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="biq-btn biq-btn-primary"
            style={{ width: "100%", marginTop: "8px", padding: "13px 20px", fontSize: "15px", borderRadius: "var(--radius-md)" }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p style={{ textAlign: "center", marginTop: "15px" }}>
  Don't have an account?{" "}
  <a href="/register">Register</a>
</p>

          <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "24px" }}>
            BalanceIQ is a confidential employee wellness platform.
            <br />Your data is private and secure.
          </p>
        </div>
      </div>

      {/* ── Right: Art Panel ── */}
      <div className="biq-login-art">
        {/* decorative rings */}
        <svg className="biq-art-circles" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="300" cy="350" r="220" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="60" />
          <circle cx="300" cy="350" r="150" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="40" />
          <circle cx="300" cy="350" r="90"  fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
          <circle cx="80"  cy="100" r="60"  fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="30" />
          <circle cx="520" cy="600" r="80"  fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="40" />
        </svg>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "340px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
            fontSize: "28px"
          }}>
            🌿
          </div>

          <blockquote className="biq-login-art-quote">
            "Balance is not something you find, it's something you create."
          </blockquote>

          <p className="biq-login-art-sub" style={{ marginTop: "20px" }}>
            Track your mood, manage your energy, and work sustainably.
          </p>

          <div style={{
            display: "flex", gap: "32px", justifyContent: "center",
            marginTop: "48px"
          }}>
            {[
              { label: "Check-ins", val: "Daily" },
              { label: "Insights", val: "AI" },
              { label: "Privacy", val: "100%" }
            ].map(({ label, val }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", fontFamily: "var(--font-display)" }}>{val}</div>
                <div style={{ fontSize: "11px", color: "var(--green-200)", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;