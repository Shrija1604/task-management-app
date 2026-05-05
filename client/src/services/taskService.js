import axios from "axios";

const API = "http://localhost:5000/api/tasks";

// helper for token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

// GET TASKS
export const getTasks = () => {
  return axios.get(API, authHeader());
};

// CREATE TASK
export const createTask = (data) => {
  return axios.post(API, data, authHeader());
};

// UPDATE TASK
export const updateTask = (id, data) => {
  return axios.put(`${API}/${id}`, data, authHeader());
};

// DELETE TASK
export const deleteTask = (id) => {
  return axios.delete(`${API}/${id}`, authHeader());
};