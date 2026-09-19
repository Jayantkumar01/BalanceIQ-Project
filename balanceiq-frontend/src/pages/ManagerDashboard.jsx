import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/balanceiq.css";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

/* ─── Nav Item ─── */
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

/* ─── Custom Tooltip ─── */
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
        <p key={p.name} style={{ color: p.color || "var(--text-primary)", fontWeight: 500 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
function ManagerDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [highRiskEmployees, setHighRiskEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [s, e, h, d] = await Promise.all([
          api.get("/dashboard/team-summary"),
          api.get("/dashboard/employees"),
          api.get("/dashboard/high-risk-employees"),
          api.get("/dashboard/department-summary"),
        ]);
        setSummary(s.data);
        setEmployees(e.data);
        setHighRiskEmployees(h.data);
        setDepartments(d.data);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  function handleLogout() { localStorage.clear(); navigate("/"); }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });

  if (!summary) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--cream-100)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>📊</div>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>Loading team data…</p>
        </div>
      </div>
    );
  }

  /* Chart data */
  const riskData = [
    { name: "High risk",  value: summary.highRiskEmployees },
    { name: "Healthy",    value: summary.totalEmployees - summary.highRiskEmployees },
  ];
  const RISK_COLORS = ["#E8705A", "#4A7C59"];

  const employeeBurnoutData = employees.map((e) => ({
    name: e.name,
    burnout:
      e.riskLevel === "HIGH"
        ? 100
        : e.riskLevel === "MEDIUM"
        ? 60
        : 20,
  risk:
    e.riskLevel?.toUpperCase() === "HIGH"
      ? 3
      : e.riskLevel?.toUpperCase() === "MEDIUM"
      ? 2
      : 1
}));



  const departmentBurnoutData = departments.map((d) => {
    const deptEmployees = employees.filter(
      (e) => e.department === d.department
    );

    const avgRisk =
      deptEmployees.reduce((sum, emp) => {
        return (
          sum +
          (emp.riskLevel === "HIGH"
            ? 100
            : emp.riskLevel === "MEDIUM"
            ? 60
            : 20)
        );
      }, 0) / (deptEmployees.length || 1);

    return {
      department: d.department,
      burnout: avgRisk
    };
  });

  const navPages = {
    overview: "Team Overview",
    risk: "High-Risk Employees",
    analytics: "Burnout Analytics",
    departments: "Department Summary",
    employees: "All Employees"
  };

  return (
    <div className="biq-layout">

      {/* ── Sidebar ── */}
      <aside className="biq-sidebar">
        <div className="biq-sidebar-logo">
          <div className="logo-mark">Balance<span style={{ color: "var(--green-400)" }}>IQ</span></div>
          <div className="logo-sub">Manager View</div>
        </div>

        <nav className="biq-nav">
          <NavItem icon="📊" label="Team overview"     active={activeNav === "overview"}     onClick={() => setActiveNav("overview")}     />
          <NavItem icon="⚠️" label="High-risk"         active={activeNav === "risk"}         onClick={() => setActiveNav("risk")}         />
          <NavItem icon="📈" label="Burnout analytics" active={activeNav === "analytics"}    onClick={() => setActiveNav("analytics")}    />
          <NavItem icon="🏢" label="Departments"       active={activeNav === "departments"}  onClick={() => setActiveNav("departments")}  />
          <NavItem icon="👥" label="All employees"     active={activeNav === "employees"}    onClick={() => setActiveNav("employees")}    />
        </nav>

        <div className="biq-sidebar-footer">
          <div className="biq-user-chip">
            <div className="biq-avatar" style={{ background: "var(--green-600)" }}>M</div>
            <div className="biq-user-info">
              <div className="name">Manager</div>
              <div className="role">Team Lead</div>
            </div>
          </div>
          <button className="biq-logout-btn" onClick={handleLogout}>
            <span>↩</span> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="biq-main">
        <div className="biq-topbar">
          <span className="biq-topbar-title">{navPages[activeNav]}</span>
          <span className="biq-topbar-date">{today}</span>
        </div>

        <div className="biq-page">

          {/* ══════ OVERVIEW ══════ */}
          {activeNav === "overview" && (
            <>
              {/* Summary stats */}
              <div className="biq-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                <StatCard
                  icon="👥" label="Total employees"
                  value={summary.totalEmployees}
                  accent="var(--sky-500)" bg="var(--sky-100)"
                />
                <StatCard
                  icon="⚠️" label="High-risk employees"
                  value={summary.highRiskEmployees}
                  accent="var(--coral-500)" bg="var(--coral-100)"
                  sub={`${((summary.highRiskEmployees / summary.totalEmployees) * 100).toFixed(0)}% of team`}
                />
                <StatCard
                  icon="🔥" label="Avg burnout score"
                  value={summary.averageBurnoutScore}
                  accent="var(--amber-500)" bg="var(--amber-100)"
                />
                <StatCard
                  icon="⏰" label="Avg working hours"
                  value={summary.averageWorkingHours}
                  accent="var(--green-500)" bg="var(--green-50)"
                  sub="Per employee"
                />
              </div>

              {/* Alert banner if high-risk > threshold */}
              {summary.highRiskEmployees > 0 && (
                <div style={{
                  background: "var(--coral-100)", border: "1px solid rgba(232,112,90,0.25)",
                  borderRadius: "var(--radius-md)", padding: "14px 20px",
                  display: "flex", alignItems: "center", gap: "12px",
                  marginBottom: "24px"
                }}>
                  <span style={{ fontSize: "20px" }}>⚠️</span>
                  <div>
                    <span style={{ fontWeight: 500, color: "#C44A30", fontSize: "14px" }}>
                      {summary.highRiskEmployees} employee{summary.highRiskEmployees !== 1 ? "s" : ""} flagged as high burnout risk.
                    </span>
                    <span style={{ color: "#C44A30", fontSize: "13px" }}> Consider scheduling wellness check-ins.</span>
                  </div>
                  <button
                    className="biq-btn"
                    style={{ marginLeft: "auto", background: "#C44A30", color: "#fff", padding: "7px 16px", fontSize: "13px" }}
                    onClick={() => setActiveNav("risk")}
                  >
                    View →
                  </button>
                </div>
              )}

              {/* Pie chart */}
              <div className="biq-card">
                <div className="biq-card-header">
                  <div className="biq-card-title">Risk distribution</div>
                </div>
                <div style={{ width: "100%", height: "280px" }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={riskData} dataKey="value" nameKey="name" outerRadius={110} innerRadius={55} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {riskData.map((_, i) => (
                          <Cell key={i} fill={RISK_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "13px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ══════ HIGH-RISK ══════ */}
          {activeNav === "risk" && (
            <div className="biq-card" style={{ padding: 0, overflow: "hidden" }}>
              {highRiskEmployees.length === 0 ? (
                <div className="biq-empty">
                  <div className="biq-empty-icon">✅</div>
                  <div className="biq-empty-text">No high-risk employees right now. Great news!</div>
                </div>
              ) : (
                <div className="biq-table-wrap" style={{ border: "none", borderRadius: 0 }}>
                  <table className="biq-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>ID</th>
                        <th>Burnout score</th>
                        <th>Risk level</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {highRiskEmployees.map((emp) => (
                        <tr key={emp.employeeId} className="high-risk-row">
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div className="biq-avatar" style={{ background: "var(--coral-100)", color: "#C44A30", width: "30px", height: "30px", fontSize: "11px" }}>
                                {emp.name?.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{emp.name}</span>
                            </div>
                          </td>
                          <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{emp.employeeId}</td>
                          <td>
                            <span style={{
                              display: "inline-block", padding: "3px 10px",
                              background: "var(--coral-100)", color: "#C44A30",
                              borderRadius: "var(--radius-full)", fontSize: "13px", fontWeight: 600
                            }}>
                              {emp.burnoutScore}
                            </span>
                          </td>
                          <td><RiskBadge risk={emp.riskLevel} /></td>
                          <td>
                            <button
  className="biq-btn biq-btn-outline"
  style={{ padding: "5px 12px", fontSize: "12px" }}
  onClick={() =>
    window.alert(`Schedule a wellness check-in with ${emp.name}`)
  }
>
  Schedule check-in
</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══════ ANALYTICS ══════ */}
          {activeNav === "analytics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="biq-card">
                <div className="biq-card-header">
                  <div>
                    <div className="biq-card-title">Individual AI Risk Levels</div>
                   <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
  AI predicted burnout risk per employee
</div>
                    <div className="biq-card-title">AI Burnout Risk Analysis</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>AI predicted risk level comparison</div>
                  </div>
                </div>
                <div style={{ width: "100%", height: "340px" }}>
                  <ResponsiveContainer>
                    <BarChart data={employeeBurnoutData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                     <YAxis
  domain={[1, 3]}
  ticks={[1, 2, 3]}
  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
/>
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "13px" }} />
                      <Bar dataKey="risk" name="AI Risk Level" fill="var(--coral-500)" radius={[4,4,0,0]} />
                      <Bar dataKey="burnout" name="AI Risk Score" fill="var(--coral-500)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="biq-card">
                <div className="biq-card-header">
                  <div>
                    <div className="biq-card-title">AI Risk Level by Department</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>Based on AI predicted employee risk</div>
                  </div>
                </div>
                <div style={{ width: "100%", height: "340px" }}>
                  <ResponsiveContainer>
                    <BarChart data={departmentBurnoutData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                      <XAxis dataKey="department" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                      <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "13px" }} />
                      <Bar dataKey="burnout" name="AI Risk Score" fill="var(--green-500)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ══════ DEPARTMENTS ══════ */}
          {activeNav === "departments" && (
            <div className="biq-card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="biq-table-wrap" style={{ border: "none", borderRadius: 0 }}>
                <table className="biq-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Headcount</th>
                      <th>Avg burnout</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => {
                      const deptEmployees = employees.filter(
  (e) => e.department === dept.department
);

const score =
  deptEmployees.reduce((sum, emp) => {
    return (
      sum +
      (emp.riskLevel === "HIGH"
        ? 100
        : emp.riskLevel === "MEDIUM"
        ? 60
        : 20)
    );
  }, 0) / (deptEmployees.length || 1);

const level =
  score >= 70 ? "high"
  : score >= 40 ? "medium"
  : "low";
                      return (
                        <tr key={dept.department}>
                          <td style={{ fontWeight: 500 }}>{dept.department}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{dept.employeeCount}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{
                                height: "6px", borderRadius: "3px",
                                width: `${Math.min(score * 10, 100)}%`,
                                background: level === "high" ? "var(--coral-500)" : level === "medium" ? "var(--amber-500)" : "var(--green-500)",
                                minWidth: "20px", maxWidth: "100px"
                              }} />
                              <span style={{ fontSize: "13px", fontWeight: 500 }}>{score}</span>
                            </div>
                          </td>
                          <td><RiskBadge risk={level === "high" ? "High" : level === "medium" ? "Medium" : "Low"} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════ ALL EMPLOYEES ══════ */}
          {activeNav === "employees" && (
            <div className="biq-card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="biq-table-wrap" style={{ border: "none", borderRadius: 0 }}>
                <table className="biq-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>ID</th>
                      <th>Department</th>
                      <th>Burnout score</th>
                      <th>Risk level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.employeeId}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="biq-avatar" style={{ width: "30px", height: "30px", fontSize: "11px" }}>
                              {emp.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{emp.name}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{emp.employeeId}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{emp.department}</td>
                        <td>
                          <span style={{ fontSize: "14px", fontWeight: 500 }}>{emp.burnoutScore}</span>
                        </td>
                        <td><RiskBadge risk={emp.riskLevel} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;