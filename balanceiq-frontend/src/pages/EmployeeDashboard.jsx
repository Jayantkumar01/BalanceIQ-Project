import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/balanceiq.css";

import {
  CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

/* ─── Sidebar Nav Item ─── */
function NavItem({ icon, label, active, onClick }) {
  return (
    <button className={`biq-nav-item ${active ? "active" : ""}`} onClick={onClick}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {label}
    </button>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, accent, bg, sub }) {
  return (
    <div className="biq-stat" style={{ "--stat-accent": accent, "--stat-bg": bg }}>
      <div className="biq-stat-icon">{icon}</div>
      <div className="biq-stat-label">{label}</div>
      <div className="biq-stat-value">{value ?? "—"}</div>
      {sub && <div className="biq-stat-sub">{sub}</div>}
    </div>
  );
}

/* ─── Risk Badge ─── */
function RiskBadge({ risk }) {
  const level = (risk || "").toLowerCase().includes("high") ? "high"
    : (risk || "").toLowerCase().includes("medium") ? "medium" : "low";
  const dot = level === "high" ? "🔴" : level === "medium" ? "🟡" : "🟢";
  return <span className={`biq-risk-badge ${level}`}>{dot} {risk || "Low"}</span>;
}

/* ─── Check-in Modal ─── */
function CheckInModal({ onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    moodRating: 7, focusRating: 7,
    tasksCompleted: "", meetingHours: "", remarks: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="biq-overlay">
      <div className="biq-modal">
        <div className="biq-modal-header">
          <div className="biq-modal-title">Daily Check-In</div>
          <div className="biq-modal-sub">How did today go? Be honest — this is for you.</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Mood */}
          <div className="biq-form-group">
            <label className="biq-label">Mood today</label>
            <div className="biq-rating-row">
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>😔 1</span>
              <input
                type="range" min="1" max="10" step="1"
                name="moodRating" value={form.moodRating}
                onChange={handleChange}
              />
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>10 😄</span>
              <span className="biq-rating-value" style={{ color: "var(--amber-500)" }}>{form.moodRating}</span>
            </div>
          </div>

          {/* Focus */}
          <div className="biq-form-group">
            <label className="biq-label">Focus level</label>
            <div className="biq-rating-row">
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>😵 1</span>
              <input
                type="range" min="1" max="10" step="1"
                name="focusRating" value={form.focusRating}
                onChange={handleChange}
              />
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>10 🎯</span>
              <span className="biq-rating-value" style={{ color: "var(--sky-500)" }}>{form.focusRating}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="biq-form-group" style={{ marginBottom: 0 }}>
              <label className="biq-label">Tasks completed</label>
              <input
                className="biq-input" type="number" name="tasksCompleted"
                placeholder="e.g. 5" min="0"
                value={form.tasksCompleted} onChange={handleChange}
              />
            </div>
            <div className="biq-form-group" style={{ marginBottom: 0 }}>
              <label className="biq-label">Meeting hours</label>
              <input
                className="biq-input" type="number" name="meetingHours"
                placeholder="e.g. 2" min="0" step="0.5"
                value={form.meetingHours} onChange={handleChange}
              />
            </div>
          </div>

          <div className="biq-form-group" style={{ marginTop: "14px" }}>
            <label className="biq-label">Any remarks? <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
            <textarea
              className="biq-textarea" name="remarks"
              placeholder="How are you feeling about your workload, stress levels, wins…"
              value={form.remarks} onChange={handleChange}
            />
          </div>

          <div className="biq-modal-footer">
            <button type="button" className="biq-btn biq-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="biq-btn biq-btn-primary" disabled={loading}>
              {loading ? "Submitting…" : "Submit check-in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Custom Chart Tooltip ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--cream-50)", border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "13px",
      boxShadow: "var(--shadow-md)"
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: "6px" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 500 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
function EmployeeDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState("00:00:00");

  /* ── Data Fetchers ── */
  async function fetchDashboard() {
    try { const r = await api.get("/dashboard/me"); setDashboard(r.data); }
    catch (e) { console.error(e); }
  }
  async function fetchRecommendations() {
    try { const r = await api.get("/ai/recommendations/me"); setRecommendation(r.data); }
    catch (e) { console.error(e); }
  }
  async function fetchHistory() {
    try { const r = await api.get("/activity/checkin/history"); setHistory(r.data); }
    catch (e) { console.error(e); }
  }

  useEffect(() => {
    fetchDashboard(); fetchRecommendations(); fetchHistory();
  }, []);

  /* ── Timer ── */
  useEffect(() => {
    if (!startTime) return;
    const timer = setInterval(() => {
      const diff = Math.floor((new Date() - startTime) / 1000);
      const hrs  = String(Math.floor(diff / 3600)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const secs = String(diff % 60).padStart(2, "0");
      setElapsed(`${hrs}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  /* ── Session ── */
  async function startSession() {
    try {
      const r = await api.post("/activity/session/start");
      setStartTime(new Date());
      fetchDashboard(); fetchRecommendations();
    } catch (e) { alert(e.response?.data?.error || "Failed to start shift"); }
  }

  async function endSession() {
    try {
      await api.post("/activity/session/end");
      setStartTime(null); setElapsed("00:00:00");
      fetchDashboard(); fetchRecommendations();
    } catch (e) { console.error(e); }
  }

  /* ── Check-in Submit ── */
  async function handleCheckInSubmit(form) {
    setCheckInLoading(true);
    try {
      const r = await api.post("/activity/checkin", {
        moodRating: Number(form.moodRating),
        focusRating: Number(form.focusRating),
        tasksCompleted: Number(form.tasksCompleted),
        meetingHours: Number(form.meetingHours),
        remarks: form.remarks
      });
      setShowCheckIn(false);
      fetchDashboard(); fetchRecommendations(); fetchHistory();
      await endSession();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to submit check-in");
    } finally {
      setCheckInLoading(false);
    }
  }

  function handleLogout() { localStorage.clear(); navigate("/"); }

  /* ── Greeting ── */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* ── Today's date ── */
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });

  if (!dashboard) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--cream-100)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🌿</div>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

const burnoutRisk =
  recommendation?.burnoutRisk ||
  "LOW";

const burnoutLevel = burnoutRisk.toLowerCase().includes("high")
  ? "high"
  : burnoutRisk.toLowerCase().includes("medium")
  ? "medium"
  : "low";

  const aiPoints =
  recommendation?.recommendations?.[0]
    ?.split(" - ")
    .filter(item => item.trim()) || [];

  console.log("dashboard", dashboard);
  console.log("recommendation", recommendation);

  return (
    <div className="biq-layout">

      {/* ── Sidebar ── */}
      <aside className="biq-sidebar">
        <div className="biq-sidebar-logo">
          <div className="logo-mark">Balance<span style={{ color: "var(--green-400)" }}>IQ</span></div>
          <div className="logo-sub">Wellness Platform</div>
        </div>

        <nav className="biq-nav">
          <NavItem icon="📊" label="Overview"       active={activeNav === "overview"}  onClick={() => setActiveNav("overview")}  />
          <NavItem icon="📈" label="Trends"         active={activeNav === "trends"}    onClick={() => setActiveNav("trends")}    />
          <NavItem icon="📋" label="History"        active={activeNav === "history"}   onClick={() => setActiveNav("history")}   />
          <NavItem icon="🤖" label="AI Insights"    active={activeNav === "ai"}        onClick={() => setActiveNav("ai")}        />
        </nav>

        <div className="biq-sidebar-footer">
          <div className="biq-user-chip">
            <div className="biq-avatar">ME</div>
            <div className="biq-user-info">
              <div className="name">Employee</div>
              <div className="role">Team Member</div>
            </div>
          </div>
          <button className="biq-logout-btn" onClick={handleLogout}>
            <span>↩</span> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="biq-main">
        {/* Top bar */}
        <div className="biq-topbar">
          <span className="biq-topbar-title">
            {{ overview: "Overview", trends: "Mood & Focus Trends", history: "Check-In History", ai: "AI Wellness Insights" }[activeNav]}
          </span>
          <span className="biq-topbar-date">{today}</span>
        </div>

        <div className="biq-page">

          {/* ══════ OVERVIEW ══════ */}
          {activeNav === "overview" && (
            <>
              {/* Session Hero */}
              <div className="biq-session-card">
                <div className="biq-session-left">
                  <div className="biq-session-greeting">
                    {greeting} 👋 </div>
                  <div className="biq-session-sub">Ready to have a balanced day?</div>
                </div>

                <div className="biq-session-center">
                  <div className={`biq-breath-ring ${startTime ? "pulsing" : ""}`}>
                    <div className="biq-timer-display">{elapsed}</div>
                  </div>
                  <div className="biq-timer-label">{startTime ? "Shift in progress" : "Not clocked in"}</div>
                </div>

                <div className="biq-session-actions">
                  {!startTime ? (
                    <button className="biq-btn biq-btn-ghost" onClick={startSession}>
                      ▶ Start shift
                    </button>
                  ) : (
                    <button className="biq-btn" style={{ background: "var(--coral-500)", color: "#fff" }}
                      onClick={() => setShowCheckIn(true)}>
                      ⏹ End shift & check in
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="biq-stats-grid">
                <StatCard
                  icon="⏰" label="Hours this week"
                  value={dashboard.totalHoursWorked}
                  accent="var(--sky-500)" bg="var(--sky-100)"
                  sub="Total logged"
                />
                <StatCard
                  icon="😊" label="Average mood"
                  value={dashboard.averageMood}
                  accent="var(--amber-500)" bg="var(--amber-100)"
                  sub="Out of 10"
                />
                <StatCard
                  icon="🎯" label="Average focus"
                  value={dashboard.averageFocus}
                  accent="var(--green-500)" bg="var(--green-50)"
                  sub="Out of 10"
                />
                <div className="biq-stat" style={{
                  "--stat-accent": burnoutLevel === "high" ? "var(--coral-500)" : burnoutLevel === "medium" ? "var(--amber-500)" : "var(--green-500)",
                  "--stat-bg": burnoutLevel === "high" ? "var(--coral-100)" : burnoutLevel === "medium" ? "var(--amber-100)" : "var(--green-50)"
                }}>
                  <div className="biq-stat-icon">🔥</div>
                  <div className="biq-stat-label">Burnout risk</div>
                  <div style={{ marginTop: "8px" }}><RiskBadge risk={burnoutRisk} /></div>
                </div>
              </div>

              {/* Quick AI summary */}
              {recommendation && (
                <div className="biq-ai-card">
                  <div className="biq-ai-header">
                    <span className="biq-ai-badge">AI Insights</span>
                    <span className="biq-ai-risk">Risk level: {burnoutRisk}</span>
                  </div>
   <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}
>
  {aiPoints?.map((item, index) => (
    <div
      key={index}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px 14px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <span
        style={{
          color: "#7ED957",
          fontWeight: "bold",
          fontSize: "16px"
        }}
      >
        ✓
      </span>

      <span
        style={{
          color: "#fff",
          lineHeight: "1.6"
        }}
      >
        {item}
      </span>
    </div>
  ))}
</div>
                  <button
                    className="biq-btn biq-btn-ghost"
                    style={{ marginTop: "16px", fontSize: "13px", padding: "7px 16px" }}
                    onClick={() => setActiveNav("ai")}
                  >
                    View all insights →
                  </button>
                </div>
              )}
            </>
          )}

          {/* ══════ TRENDS ══════ */}
          {activeNav === "trends" && (
            <div className="biq-card">
              <div className="biq-section-header">
                <div>
                  <div className="biq-section-title">Mood & focus over time</div>
                  <div className="biq-section-sub">Based on your daily check-ins</div>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="biq-empty">
                  <div className="biq-empty-icon">📈</div>
                  <div className="biq-empty-text">No check-in data yet. Complete your first check-in to see trends.</div>
                </div>
              ) : (
                <div style={{ width: "100%", height: "360px" }}>
                  <ResponsiveContainer>
                    <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                      <XAxis dataKey="workDate" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "13px" }} />
                      <Line type="monotone" dataKey="moodRating" name="Mood"  stroke="var(--amber-500)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--amber-500)" }} />
                      <Line type="monotone" dataKey="focusRating" name="Focus" stroke="var(--sky-500)"   strokeWidth={2.5} dot={{ r: 4, fill: "var(--sky-500)" }}   />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* ══════ HISTORY ══════ */}
          {activeNav === "history" && (
            <div className="biq-card" style={{ padding: 0, overflow: "hidden" }}>
              {history.length === 0 ? (
                <div className="biq-empty">
                  <div className="biq-empty-icon">📋</div>
                  <div className="biq-empty-text">No check-ins yet. Start your shift and complete a check-in to see your history here.</div>
                </div>
              ) : (
                <div className="biq-table-wrap" style={{ border: "none", borderRadius: 0 }}>
                  <table className="biq-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Mood</th>
                        <th>Focus</th>
                        <th>Tasks</th>
                        <th>Meeting hrs</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 500 }}>{item.workDate}</td>
                          <td>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              padding: "3px 10px", borderRadius: "var(--radius-full)",
                              background: "var(--amber-100)", color: "#A87012",
                              fontSize: "13px", fontWeight: 500
                            }}>
                              {item.moodRating}/10
                            </span>
                          </td>
                          <td>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              padding: "3px 10px", borderRadius: "var(--radius-full)",
                              background: "var(--sky-100)", color: "#2E6E96",
                              fontSize: "13px", fontWeight: 500
                            }}>
                              {item.focusRating}/10
                            </span>
                          </td>
                          <td>{item.tasksCompleted}</td>
                          <td>{item.meetingHours ?? "—"}</td>
                          <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                            {item.remarks ?? <span style={{ color: "var(--text-muted)" }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══════ AI INSIGHTS ══════ */}
          {activeNav === "ai" && (
            <>
              {recommendation ? (
                <>
                  <div className="biq-ai-card" style={{ marginBottom: "20px" }}>
                    <div className="biq-ai-header">
                      <span className="biq-ai-badge">🤖 AI Wellness Insights</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.75)",
                            fontSize: "13px",
                            marginBottom: "4px"
                          }}
                        >
                          Current Burnout Status
                        </div>
                        <div
                          style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#fff"
                          }}
                        >
                          {burnoutRisk}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "10px 18px",
                          borderRadius: "999px",
                          background:
                            burnoutLevel === "high"
                              ? "rgba(232,112,90,0.25)"
                              : burnoutLevel === "medium"
                              ? "rgba(245,177,66,0.25)"
                              : "rgba(74,124,89,0.25)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "#fff",
                          fontWeight: 600
                        }}
                      >
                        {burnoutLevel === "high"
                          ? "🔴 Immediate Attention"
                          : burnoutLevel === "medium"
                          ? "🟡 Monitor Closely"
                          : "🟢 Healthy State"}
                      </div>
                    </div>

                    <div
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "14px",
                        marginBottom: "12px",
                        fontWeight: 600
                      }}
                    >
                      Recommended Actions
                    </div>

                   <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}
>
  {recommendation.recommendations?.[0]
    ?.split(" - ")
    .filter(item => item.trim())
    .map((item, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "12px 14px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <span
          style={{
            color: "#7ED957",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          ✓
        </span>

        <span
          style={{
            color: "#fff",
            lineHeight: "1.6"
          }}
        >
          {item.trim()}
        </span>
      </div>
    ))}
</div>
                  </div>

                  <div className="biq-card">
                    <div className="biq-card-header">
                      <div className="biq-card-title">What affects your burnout score?</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {[
                        { label: "Hours worked",    icon: "⏰", desc: "Working beyond 8h/day increases risk" },
                        { label: "Meeting load",     icon: "🗓️", desc: "High meeting hours reduce deep work time" },
                        { label: "Mood trends",      icon: "😊", desc: "Consistently low mood is an early warning sign" },
                        { label: "Focus levels",     icon: "🎯", desc: "Inability to focus often signals fatigue" },
                      ].map(({ label, icon, desc }) => (
                        <div key={label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "var(--radius-sm)",
                            background: "var(--green-50)", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "18px", flexShrink: 0
                          }}>{icon}</div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{label}</div>
                            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="biq-card">
                  <div className="biq-empty">
                    <div className="biq-empty-icon">🤖</div>
                    <div className="biq-empty-text">AI insights will appear after your first check-in.</div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* ── Check-in Modal ── */}
      {showCheckIn && (
        <CheckInModal
          onSubmit={handleCheckInSubmit}
          onClose={() => setShowCheckIn(false)}
          loading={checkInLoading}
        />
      )}
    </div>
  );
}

export default EmployeeDashboard;