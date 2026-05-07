import axios from "axios";

const API = "http://localhost:5000/api/tasks";

// TOKEN CONFIG
const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET TASKS
export const getTasks = async () => {
  const response = await axios.get(
    API,
    getConfig()
  );

  return response.data;
};

// CREATE TASK
export const createTask = async (taskData) => {
  const response = await axios.post(
    API,
    taskData,
    getConfig()
  );

  return response.data;
};

// UPDATE TASK
export const updateTask = async (
  id,
  taskData
) => {
  const response = await axios.put(
    `${API}/${id}`,
    taskData,
    getConfig()
  );

  return response.data;
};

// DELETE TASK
export const deleteTask = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    getConfig()
  );

  return response.data;
};