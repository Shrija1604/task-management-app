import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [editingId, setEditingId] = useState(null);

  // ======================
  // FETCH TASKS
  // ======================
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ======================
  // INPUT CHANGE
  // ======================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ======================
  // ADD / UPDATE TASK
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateTask(editingId, form);
        setEditingId(null);
      } else {
        await createTask(form);
      }

      setForm({ title: "", description: "", status: "pending" });
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // EDIT TASK
  // ======================
  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditingId(task._id);
  };

  // ======================
  // DELETE TASK
  // ======================
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // TOGGLE STATUS
  // ======================
  const toggleStatus = async (task) => {
    const newStatus =
      task.status === "completed" ? "pending" : "completed";

    await updateTask(task._id, { ...task, status: newStatus });
    loadTasks();
  };

  return (
    <div className="task-container">
      <h2>Task Dashboard</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit">
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* ================= TASK LIST ================= */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <span
                  className={
                    task.status === "completed"
                      ? "status done"
                      : "status pending"
                  }
                >
                  {task.status}
                </span>

                <div className="btn-group">
                  <button onClick={() => handleEdit(task)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(task._id)}>
                    Delete
                  </button>

                  <button onClick={() => toggleStatus(task)}>
                    Toggle
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TaskPage;