import React, { useEffect, useState, useCallback } from "react";
import Loader from "../components/Loader";
import TaskCard from "../components/TaskCard";
import CalendarView from "../components/CalendarView";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";
import { getCategories } from "../services/categoryService";

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  category: "General",
  dueDate: "",
};

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState("grid");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    getCategories()
      .then((cats) => setCategories(Array.isArray(cats) ? cats : []))
      .catch(() => setCategories([]));
  }, [fetchTasks]);

  const displayedTasks = tasks
    .filter((task) => {
      const title = (task.title ?? "").toLowerCase();
      const description = (task.description ?? "").toLowerCase();
      const search = (searchTerm ?? "").toLowerCase();
      const matchesSearch = title.includes(search) || description.includes(search);
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "title") return (a.title ?? "").localeCompare(b.title ?? "");
      if (sortBy === "priority") {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Task title is required.");
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await updateTask(editingId, formData);
      } else {
        await createTask(formData);
      }
      cancelEdit();
      await fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      alert(error.response?.data?.message || "Failed to save task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
      }
    }
  };

  const editHandler = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? "To Do",
      priority: task.priority ?? "Medium",
      category: task.category ?? "General",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusBadgeColor = {
    "To Do": { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
    "In Progress": { bg: "rgba(124,58,237,0.15)", color: "#a78bfa" },
    "Done": { bg: "rgba(16,185,129,0.15)", color: "#10b981" },
  };

  return (
    <div className="main-content">
      <div className="topbar">
        <div>
          <h1>My Tasks</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setView("grid")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: view === "grid" ? "var(--accent-primary)" : "var(--card-bg)",
              color: view === "grid" ? "#fff" : "var(--text-secondary)",
              border: "1px solid var(--border-color)",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Grid View
          </button>
          <button
            onClick={() => setView("calendar")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: view === "calendar" ? "var(--accent-primary)" : "var(--card-bg)",
              color: view === "calendar" ? "#fff" : "var(--text-secondary)",
              border: "1px solid var(--border-color)",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Calendar
          </button>
        </div>
      </div>

      <div className="task-page-layout">
        {/* ── FORM PANEL ── */}
        <div className="stat-card task-form-panel">
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "var(--text-primary)" }}>
            {editingId ? "✏️ Update Task" : "➕ New Task"}
          </h2>
          <form onSubmit={submitHandler}>
            <div className="input-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Add details..."
                value={formData.description}
                onChange={changeHandler}
                rows="3"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="input-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={changeHandler}>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="input-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={changeHandler}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={changeHandler}>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id || cat.name} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="General">📋 General</option>
                    <option value="Work">💼 Work</option>
                    <option value="Personal">🏠 Personal</option>
                    <option value="Fitness">💪 Fitness</option>
                    <option value="Education">📚 Education</option>
                  </>
                )}
              </select>
            </div>
            <div className="input-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={changeHandler}
              />
            </div>
            <button type="submit" className="auth-btn" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Task" : "Create Task"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  background: "transparent",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "12px",
                  borderRadius: "14px",
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* ── TASK LIST PANEL ── */}
        <div className="task-list-section">
          {view === "grid" ? (
            <>
              {/* Filters & Search */}
              <div className="task-filters">
                <input
                  type="text"
                  placeholder="🔍 Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1 }}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due Date</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              {/* Status Summary Pills */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                {["To Do", "In Progress", "Done"].map((s) => {
                  const count = tasks.filter((t) => t.status === s).length;
                  const style = statusBadgeColor[s];
                  return (
                    <span
                      key={s}
                      onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        background: filterStatus === s ? style.color : style.bg,
                        color: filterStatus === s ? "#fff" : style.color,
                        border: `1px solid ${style.color}`,
                        transition: "0.2s",
                      }}
                    >
                      {s} ({count})
                    </span>
                  );
                })}
              </div>

              {loading ? (
                <Loader />
              ) : displayedTasks.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                  <h3>No Tasks Found</h3>
                  <p>
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter."
                      : "Create your first task to get started!"}
                  </p>
                </div>
              ) : (
                <div className="task-grid">
                  {displayedTasks.map((task) => (
                    <div key={task._id} style={{ position: "relative" }}>
                      <TaskCard task={task} onDelete={deleteHandler} />
                      <button
                        onClick={() => editHandler(task)}
                        title="Edit task"
                        style={{
                          position: "absolute",
                          right: "48px",
                          top: "14px",
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "4px",
                          boxShadow: "none",
                          width: "auto",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4L18.5 2.5z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <CalendarView tasks={tasks} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;