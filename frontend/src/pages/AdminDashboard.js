import React, { useState, useEffect } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const { data } = await API.get("/admin/stats");
        setData(data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Could not load admin data. Access denied.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  useEffect(() => {
    if (activeTab === "tasks") {
      const fetchSystemTasks = async () => {
        try {
          setTasksLoading(true);
          const { data } = await API.get("/admin/tasks");
          setTasks(data);
        } catch (err) {
          console.error("Error fetching system tasks:", err);
        } finally {
          setTasksLoading(false);
        }
      };
      fetchSystemTasks();
    }
  }, [activeTab]);

  const deleteUserHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user and all their tasks? This cannot be undone.")) {
      try {
        setDeleting(id);
        await API.delete(`/admin/users/${id}`);
        setData((prev) => ({
          ...prev,
          users: prev.users.filter((u) => u._id !== id),
          totalUsers: prev.totalUsers - 1,
        }));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) return <Loader />;

  const statCards = [
    {
      title: "Total Users",
      value: data?.totalUsers ?? 0,
      icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
      color: "var(--accent-primary)",
      bg: "rgba(124,58,237,0.12)",
    },
    {
      title: "Total Tasks",
      value: data?.totalTasks ?? 0,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      color: "#6366f1",
      bg: "rgba(99,102,241,0.12)",
    },
    {
      title: "Completion Rate",
      value: `${data?.completionRate ?? 0}%`,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "#10b981",
      bg: "rgba(16,185,129,0.12)",
    },
  ];

  return (
    <div className="main-content">
      <div className="topbar">
        <div>
          <h1>Admin Command Center</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Manage users and monitor system-wide activity.
          </p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "700" }}>
          🔐 Admin Access
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "14px 20px", borderRadius: "14px", marginBottom: "24px", fontWeight: "600" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase" }}>{card.title}</h3>
                <div style={{ fontSize: "42px", fontWeight: "800", color: card.color, lineHeight: 1 }}>{card.value}</div>
              </div>
              <div style={{ background: card.bg, padding: "12px", borderRadius: "14px", color: card.color }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={card.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab("users")}
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'users' ? '3px solid var(--accent-primary)' : 'none', color: activeTab === 'users' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer' }}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab("tasks")}
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'tasks' ? '3px solid var(--accent-primary)' : 'none', color: activeTab === 'tasks' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer' }}
        >
          System Activity
        </button>
      </div>

      {activeTab === "users" ? (
        <div className="stat-card">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  {["User", "Email", "Role", "Tasks", "Completion", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.users?.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: u.role === "admin" ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800" }}>
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: "600" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px", color: "var(--text-secondary)" }}>{u.email}</td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "6px", background: u.role === "admin" ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.08)", fontSize: "11px", color: u.role === "admin" ? "#a78bfa" : "var(--text-secondary)", fontWeight: "700" }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px", fontWeight: "700" }}>{u.taskCount}</td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "80px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ width: `${u.completionRate}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #10b981)" }} />
                        </div>
                        <span style={{ fontSize: "12px" }}>{u.completionRate}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      {u.role !== "admin" && (
                        <button onClick={() => deleteUserHandler(u._id)} disabled={deleting === u._id} className="photo-upload-btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                          {deleting === u._id ? "..." : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="stat-card">
          {tasksLoading ? <Loader /> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    {["Task", "Assigned To", "Status", "Priority", "Created At"].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "14px", fontWeight: "600" }}>{t.title}</td>
                      <td style={{ padding: "14px" }}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{t.user?.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.user?.email}</div>
                      </td>
                      <td style={{ padding: "14px" }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '11px', fontWeight: '700' }}>{t.status}</span>
                      </td>
                      <td style={{ padding: "14px" }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          background: t.priority === 'High' ? 'rgba(239,68,68,0.1)' : t.priority === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                          color: t.priority === 'High' ? '#ef4444' : t.priority === 'Medium' ? '#f59e0b' : '#10b981',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: "14px", color: "var(--text-secondary)", fontSize: '12px' }}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
