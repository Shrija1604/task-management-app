import React, { useState, useEffect } from "react";
import API from "../services/api";
import Loader from "../components/Loader";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

const CATEGORY_ICONS = ["📋", "💼", "🏠", "💪", "📚", "🎯", "🔬", "🎨", "🌐", "🚀", "💡", "📁", "🏆", "🛠️", "❤️"];
const CATEGORY_COLORS = [
  "#7c3aed", "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#3b82f6", "#ec4899", "#06b6d4", "#84cc16", "#f97316",
];

const EMPTY_CAT = { name: "", color: "#7c3aed", icon: "📁", description: "" };

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  // Category form state
  const [catForm, setCatForm] = useState(EMPTY_CAT);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState("");
  const [catSuccess, setCatSuccess] = useState("");
  const [deletingCat, setDeletingCat] = useState(null);

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
    if (activeTab === "categories") {
      fetchCategories();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const cats = await getCategories();
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

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

  const deleteTaskHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this task? This cannot be undone.")) {
      try {
        await API.delete(`/admin/tasks/${id}`);
        setTasks((prev) => prev.filter((t) => t._id !== id));
        setData((prev) => ({ ...prev, totalTasks: prev.totalTasks - 1 }));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete task");
      }
    }
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    setCatError("");
    setCatSuccess("");
    if (!catForm.name.trim()) {
      setCatError("Category name is required.");
      return;
    }
    try {
      setCatSaving(true);
      if (editingCatId) {
        await updateCategory(editingCatId, catForm);
        setCatSuccess("Category updated successfully!");
      } else {
        await createCategory(catForm);
        setCatSuccess("Category created successfully!");
      }
      setCatForm(EMPTY_CAT);
      setEditingCatId(null);
      await fetchCategories();
    } catch (err) {
      setCatError(err.response?.data?.message || "Failed to save category.");
    } finally {
      setCatSaving(false);
    }
  };

  const handleEditCat = (cat) => {
    setEditingCatId(cat._id);
    setCatForm({ name: cat.name, color: cat.color, icon: cat.icon, description: cat.description || "" });
    setCatError("");
    setCatSuccess("");
  };

  const handleDeleteCat = async (id) => {
    if (window.confirm("Delete this category? Tasks using it will keep their category name.")) {
      try {
        setDeletingCat(id);
        await deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c._id !== id));
        setCatSuccess("Category deleted.");
      } catch (err) {
        setCatError(err.response?.data?.message || "Failed to delete category.");
      } finally {
        setDeletingCat(null);
      }
    }
  };

  const cancelCatEdit = () => {
    setEditingCatId(null);
    setCatForm(EMPTY_CAT);
    setCatError("");
    setCatSuccess("");
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
    {
      title: "Categories",
      value: categories.length || "–",
      icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
    },
  ];

  const tabs = [
    { id: "users", label: "👥 User Management" },
    { id: "tasks", label: "📋 System Activity" },
    { id: "categories", label: "🏷️ Categories" },
    { id: "insights", label: "📊 System Insights" },
  ];

  return (
    <div className="main-content">
      <div className="topbar">
        <div>
          <h1>Admin Command Center</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Manage users, tasks, and categories system-wide.
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
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "0" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 22px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "3px solid var(--accent-primary)" : "3px solid transparent",
              color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── USER MANAGEMENT TAB ── */}
      {activeTab === "users" && (
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
                {data?.users?.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>No users found.</td>
                  </tr>
                ) : (
                  data?.users?.map((u) => (
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
                          <button onClick={() => deleteUserHandler(u._id)} disabled={deleting === u._id} className="photo-upload-btn" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                            {deleting === u._id ? "..." : "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SYSTEM ACTIVITY TAB ── */}
      {activeTab === "tasks" && (
        <div className="stat-card">
          {tasksLoading ? <Loader /> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    {["Task", "Assigned To", "Status", "Priority", "Category", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>No tasks in the system.</td>
                    </tr>
                  ) : (
                    tasks.map((t) => (
                      <tr key={t._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "14px", fontWeight: "600" }}>{t.title}</td>
                        <td style={{ padding: "14px" }}>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>{t.user?.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{t.user?.email}</div>
                        </td>
                        <td style={{ padding: "14px" }}>
                          <span style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", fontSize: "11px", fontWeight: "700" }}>{t.status}</span>
                        </td>
                        <td style={{ padding: "14px" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            background: t.priority === "High" ? "rgba(239,68,68,0.1)" : t.priority === "Medium" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                            color: t.priority === "High" ? "#ef4444" : t.priority === "Medium" ? "#f59e0b" : "#10b981",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}>
                            {t.priority}
                          </span>
                        </td>
                        <td style={{ padding: "14px", color: "var(--text-secondary)", fontSize: "13px" }}>{t.category || "General"}</td>
                        <td style={{ padding: "14px" }}>
                          <button
                            onClick={() => deleteTaskHandler(t._id)}
                            className="photo-upload-btn"
                            style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 10px", fontSize: "11px" }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── CATEGORIES TAB ── */}
      {activeTab === "categories" && (
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>
          {/* Category Form */}
          <div className="stat-card" style={{ position: "sticky", top: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
              {editingCatId ? "✏️ Edit Category" : "➕ New Category"}
            </h2>

            {catError && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "10px 14px", borderRadius: "10px", marginBottom: "16px", fontWeight: "600", fontSize: "13px" }}>
                ⚠️ {catError}
              </div>
            )}
            {catSuccess && (
              <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "10px 14px", borderRadius: "10px", marginBottom: "16px", fontWeight: "600", fontSize: "13px" }}>
                ✅ {catSuccess}
              </div>
            )}

            <form onSubmit={handleCatSubmit}>
              <div className="input-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Health & Wellness"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Optional description"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Icon</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CATEGORY_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCatForm({ ...catForm, icon: ic })}
                      style={{
                        width: "36px",
                        height: "36px",
                        border: catForm.icon === ic ? "2px solid var(--accent-primary)" : "1px solid var(--border-color)",
                        borderRadius: "8px",
                        background: catForm.icon === ic ? "rgba(124,58,237,0.15)" : "transparent",
                        fontSize: "18px",
                        cursor: "pointer",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Color</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {CATEGORY_COLORS.map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setCatForm({ ...catForm, color: clr })}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: clr,
                        border: catForm.color === clr ? "3px solid white" : "2px solid transparent",
                        cursor: "pointer",
                        padding: "0",
                        boxShadow: catForm.color === clr ? `0 0 0 2px ${clr}` : "none",
                      }}
                    />
                  ))}
                </div>
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Custom:</span>
                  <input
                    type="color"
                    value={catForm.color}
                    onChange={(e) => setCatForm({ ...catForm, color: e.target.value })}
                    style={{ width: "40px", height: "30px", padding: "0 2px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "13px", fontWeight: "700", color: catForm.color }}>{catForm.color}</span>
                </div>
              </div>

              {/* Preview */}
              <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${catForm.color}15`, border: `1px solid ${catForm.color}30`, display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <span style={{ fontSize: "20px" }}>{catForm.icon}</span>
                <span style={{ fontWeight: "700", color: catForm.color }}>{catForm.name || "Preview"}</span>
              </div>

              <button type="submit" className="auth-btn" disabled={catSaving}>
                {catSaving ? "Saving..." : editingCatId ? "Update Category" : "Create Category"}
              </button>
              {editingCatId && (
                <button
                  type="button"
                  onClick={cancelCatEdit}
                  style={{ width: "100%", marginTop: "10px", background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-secondary)", fontWeight: "600", cursor: "pointer", padding: "12px", borderRadius: "12px" }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Category List */}
          <div>
            {categoriesLoading ? <Loader /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {categories.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏷️</div>
                    <h3>No Categories Yet</h3>
                    <p>Create your first category using the form.</p>
                  </div>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="stat-card"
                      style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px" }}
                    >
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${cat.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                        {cat.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontWeight: "700", fontSize: "15px" }}>{cat.name}</span>
                          {cat.isDefault && (
                            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", background: "rgba(124,58,237,0.15)", color: "#a78bfa", fontWeight: "700" }}>Default</span>
                          )}
                        </div>
                        {cat.description && (
                          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>{cat.description}</div>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: cat.color }} />
                        <button
                          onClick={() => handleEditCat(cat)}
                          style={{ padding: "6px 14px", borderRadius: "8px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa", fontWeight: "700", fontSize: "13px", cursor: "pointer", width: "auto" }}
                        >
                          Edit
                        </button>
                        {!cat.isDefault && (
                          <button
                            onClick={() => handleDeleteCat(cat._id)}
                            disabled={deletingCat === cat._id}
                            style={{ padding: "6px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontWeight: "700", fontSize: "13px", cursor: "pointer", width: "auto" }}
                          >
                            {deletingCat === cat._id ? "..." : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SYSTEM INSIGHTS TAB ── */}
      {activeTab === "insights" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Status Breakdown */}
          <div className="stat-card">
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>System-wide Status</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Done", count: data?.breakdown?.status?.completed ?? 0, color: "#10b981" },
                { label: "In Progress", count: data?.breakdown?.status?.inProgress ?? 0, color: "#6366f1" },
                { label: "Pending", count: data?.breakdown?.status?.pending ?? 0, color: "#f59e0b" },
              ].map((s) => {
                const pct = data?.totalTasks > 0 ? Math.round((s.count / data.totalTasks) * 100) : 0;
                return (
                  <div key={s.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: s.color }}>{s.label}</span>
                      <span style={{ fontWeight: "600", fontSize: "13px", color: "var(--text-secondary)" }}>{s.count} ({pct}%)</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: s.color, transition: "width 1s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="stat-card">
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>System-wide Priorities</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "High", count: data?.breakdown?.priority?.High ?? 0, color: "#ef4444" },
                { label: "Medium", count: data?.breakdown?.priority?.Medium ?? 0, color: "#f59e0b" },
                { label: "Low", count: data?.breakdown?.priority?.Low ?? 0, color: "#10b981" },
              ].map((s) => {
                const pct = data?.totalTasks > 0 ? Math.round((s.count / data.totalTasks) * 100) : 0;
                return (
                  <div key={s.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: s.color }}>{s.label} Priority</span>
                      <span style={{ fontWeight: "600", fontSize: "13px", color: "var(--text-secondary)" }}>{s.count} ({pct}%)</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: s.color, transition: "width 1s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
