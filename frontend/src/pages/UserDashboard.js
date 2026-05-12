import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/tasks/stats");
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    {
      title: "Total Tasks",
      value: stats?.total ?? 0,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      color: "var(--accent-primary)",
      bg: "rgba(124,58,237,0.12)",
    },
    {
      title: "Pending",
      value: stats?.pending ?? 0,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
    },
    {
      title: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "#6366f1",
      bg: "rgba(99,102,241,0.12)",
    },
    {
      title: "Completed",
      value: stats?.completed ?? 0,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "#10b981",
      bg: "rgba(16,185,129,0.12)",
    },
  ];

  const completionPct =
    stats?.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const inProgressPct =
    stats?.total > 0
      ? Math.round((stats.inProgress / stats.total) * 100)
      : 0;

  const priorityMap = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };

  return (
    <div className="main-content">
      {/* ── TOPBAR ── */}
      <div className="topbar">
        <div>
          <h1>Welcome back, {user.name?.split(" ")[0] || "User"}! 👋</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Here's what's happening with your tasks today.
          </p>
        </div>
        <div className="topbar-right">
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: "700", fontSize: "16px" }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>
              {user.role?.toUpperCase()}
            </div>
          </div>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, var(--accent-primary), #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "20px",
              fontWeight: "800",
              boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
              flexShrink: 0,
            }}
          >
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
            padding: "14px 20px",
            borderRadius: "14px",
            marginBottom: "24px",
            fontWeight: "600",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card" style={{ cursor: "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {card.title}
                </h3>
                <div style={{ fontSize: "42px", fontWeight: "800", color: card.color, lineHeight: 1 }}>
                  {card.value}
                </div>
              </div>
              <div
                style={{
                  background: card.bg,
                  padding: "12px",
                  borderRadius: "14px",
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={card.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CHARTS + UPCOMING ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px", marginTop: "4px" }}>
        {/* Donut Progress */}
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px" }}>
          <h2 style={{ marginBottom: "28px", fontSize: "18px", fontWeight: "700", alignSelf: "flex-start" }}>
            Completion Rate
          </h2>
          <div style={{ position: "relative", width: "180px", height: "180px" }}>
            <svg width="180" height="180" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              {/* In Progress arc */}
              <circle
                cx="21" cy="21" r="15.915"
                fill="transparent"
                stroke="#6366f1"
                strokeWidth="4"
                strokeDasharray={`${inProgressPct} ${100 - inProgressPct}`}
                strokeDashoffset="25"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
              {/* Completed arc */}
              <circle
                cx="21" cy="21" r="15.915"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray={`${completionPct} ${100 - completionPct}`}
                strokeDashoffset={`${25 - inProgressPct}`}
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "800" }}>{completionPct}%</div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "600" }}>Done</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", marginTop: "24px", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#10b981" }} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Completed ({stats?.completed ?? 0})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#6366f1" }} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>In Progress ({stats?.inProgress ?? 0})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: "rgba(255,255,255,0.12)" }} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Pending ({stats?.pending ?? 0})</span>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Upcoming (7 days)</h2>
            <Link to="/tasks" style={{ fontSize: "13px", color: "var(--accent-primary)", fontWeight: "700", textDecoration: "none" }}>
              View All →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {!stats?.upcoming || stats.upcoming.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 20px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>
                <p style={{ fontWeight: "600" }}>No upcoming deadlines!</p>
              </div>
            ) : (
              stats.upcoming.map((t) => (
                <div
                  key={t._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "14px",
                    border: "1px solid var(--border-color)",
                    gap: "12px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      Due {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: "11px",
                        background: `${priorityMap[t.priority]}20`,
                        color: priorityMap[t.priority],
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {t.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="stat-card" style={{ marginTop: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {[
            { label: "➕ New Task", to: "/tasks", color: "var(--accent-primary)" },
            { label: "📅 Calendar", to: "/calendar", color: "#6366f1" },
            { label: "📊 Statistics", to: "/statistics", color: "#10b981" },
            { label: "👤 Profile", to: "/profile", color: "#f59e0b" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                padding: "12px 22px",
                borderRadius: "14px",
                background: `${item.color}15`,
                color: item.color,
                fontWeight: "700",
                fontSize: "14px",
                textDecoration: "none",
                border: `1px solid ${item.color}30`,
                transition: "0.2s",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
