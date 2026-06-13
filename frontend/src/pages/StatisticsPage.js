import React, { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          API.get("/tasks/stats"),
          API.get("/tasks"),
        ]);
        setStats(statsRes.data);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const categoryMap = {};
  tasks.forEach((t) => {
    const cat = t.category || "General";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const priorityMap = { High: 0, Medium: 0, Low: 0 };
  tasks.forEach((t) => {
    if (priorityMap[t.priority] !== undefined) priorityMap[t.priority]++;
  });
  const priorityColors = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };

  const total = stats?.total || 1; // avoid div/0

  const catColors = [
    "#7c3aed", "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4",
  ];

  const completionPct = Math.round(((stats?.completed || 0) / total) * 100);

  return (
    <div className="main-content">
      <div className="topbar">
        <div>
          <h1>Statistics & Analytics</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Visual breakdown of your productivity.
          </p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        {[
          { label: "Total", value: stats?.total ?? 0, color: "var(--accent-primary)" },
          { label: "Completed", value: stats?.completed ?? 0, color: "#10b981" },
          { label: "In Progress", value: stats?.inProgress ?? 0, color: "#6366f1" },
          { label: "Pending", value: stats?.pending ?? 0, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ color: "var(--text-secondary)", fontWeight: "600", fontSize: "13px", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

        <div className="stat-card">
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>Priority Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(priorityMap).map(([priority, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={priority}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "700", color: priorityColors[priority], fontSize: "14px" }}>
                      {priority} Priority
                    </span>
                    <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-secondary)" }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: priorityColors[priority],
                        borderRadius: "999px",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stat-card">
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>Category Breakdown</h2>
          {categories.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "30px" }}>No tasks yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {categories.map(([cat, count], idx) => {
                const pct = Math.round((count / (stats?.total || 1)) * 100);
                const color = catColors[idx % catColors.length];
                return (
                  <div key={cat}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>
                        {cat}
                      </span>
                      <span style={{ fontWeight: "600", fontSize: "13px", color: "var(--text-secondary)" }}>
                        {count} tasks
                      </span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: color,
                          borderRadius: "999px",
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "28px", alignSelf: "flex-start" }}>
            Overall Completion
          </h2>
          <div style={{ position: "relative", width: "160px", height: "160px" }}>
            <svg width="160" height="160" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle
                cx="21" cy="21" r="15.915"
                fill="transparent"
                stroke="url(#gradient)"
                strokeWidth="5"
                strokeDasharray={`${completionPct} ${100 - completionPct}`}
                strokeDashoffset="25"
                style={{ transition: "stroke-dasharray 1.2s ease" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <div style={{ fontSize: "26px", fontWeight: "800" }}>{completionPct}%</div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "600" }}>Done</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>Status Overview</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "To Do", count: stats?.pending ?? 0, color: "#94a3b8" },
              { label: "In Progress", count: stats?.inProgress ?? 0, color: "#6366f1" },
              { label: "Done", count: stats?.completed ?? 0, color: "#10b981" },
            ].map((s) => {
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: s.color }} />
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>{s.label}</span>
                    </div>
                    <span style={{ fontWeight: "700", color: "var(--text-secondary)", fontSize: "14px" }}>
                      {s.count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: s.color,
                        borderRadius: "999px",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
