// src/pages/TaskPage.js

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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    category: "General",
  });

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  // PROTECT PAGE
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  // HANDLE INPUTS
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE / UPDATE TASK
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // UPDATE
      if (editingId) {
        await updateTask(editingId, formData);

        alert("Task Updated Successfully");
      }

      // CREATE
      else {
        await createTask(formData);

        alert("Task Added Successfully");
      }

      // RESET FORM
      setFormData({
        title: "",
        description: "",
        status: "pending",
        category: "General",
      });

      setEditingId(null);

      fetchTasks();
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  // DELETE TASK
  const deleteHandler = async (id) => {
    try {
      await deleteTask(id);

      alert("Task Deleted Successfully");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT TASK
  const editHandler = (task) => {
    setEditingId(task._id);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      category: task.category,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      <div className="task-page">

        {/* TASK FORM */}
        <form
          onSubmit={submitHandler}
          className="task-form"
        >
          <h2>
            {editingId
              ? "Update Task"
              : "Create New Task"}
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={changeHandler}
            required
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={formData.description}
            onChange={changeHandler}
            rows="4"
          />

          <select
            name="status"
            value={formData.status}
            onChange={changeHandler}
          >
            <option value="pending">
              Pending
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>
          </select>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={changeHandler}
          />

          <button type="submit">
            {editingId
              ? "Update Task"
              : "Add Task"}
          </button>
        </form>

        {/* TASK LIST */}
        {loading ? (
          <Loader />
        ) : (
          <div className="task-grid">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="task-wrapper"
                >
                  <TaskCard
                    task={task}
                    onDelete={deleteHandler}
                  />

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editHandler(task)
                    }
                  >
                    Edit
                  </button>
                </div>
              ))
            ) : (
              <h2 className="no-task">
                No Tasks Available
              </h2>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TaskPage;