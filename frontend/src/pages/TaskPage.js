import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import TaskCard from "../components/TaskCard";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";

const TaskPage = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    category: "General",
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      // Ensure tasks is always an array
      setTasks(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  // --- FIXED FILTER & SORT LOGIC ---
  const displayedTasks = tasks
    .filter((task) => {
      // Use ?? "" to handle undefined/null properties safely
      const title = (task.title ?? "").toLowerCase();
      const category = (task.category ?? "").toLowerCase();
      const search = (searchTerm ?? "").toLowerCase();

      return title.includes(search) || category.includes(search);
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "title") return (a.title ?? "").localeCompare(b.title ?? "");
      return 0;
    });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTask(editingId, formData);
        alert("Task Updated Successfully");
      } else {
        await createTask(formData);
        alert("Task Added Successfully");
      }
      setFormData({ title: "", description: "", status: "pending", category: "General" });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteTask(id);
      alert("Task Deleted Successfully");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const editHandler = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? "pending",
      category: task.category ?? "General",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <div className="task-page">
        <form onSubmit={submitHandler} className="task-form">
          <h2>{editingId ? "Update Task" : "Create New Task"}</h2>
          <input type="text" name="title" placeholder="Task Title" value={formData.title} onChange={changeHandler} required />
          <textarea name="description" placeholder="Task Description" value={formData.description} onChange={changeHandler} rows="4" />
          <select name="status" value={formData.status} onChange={changeHandler}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={changeHandler} />
          <button type="submit">{editingId ? "Update Task" : "Add Task"}</button>
        </form>

        <hr className="divider" />

        <div className="task-controls">
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">A-Z Title</option>
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="task-grid">
            {displayedTasks.length > 0 ? (
              displayedTasks.map((task) => (
                <div key={task._id} className="task-wrapper">
                  <TaskCard task={task} onDelete={deleteHandler} />
                  <button className="edit-btn" onClick={() => editHandler(task)}>Edit</button>
                </div>
              ))
            ) : (
              <h2 className="no-task">No Tasks Found</h2>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TaskPage;