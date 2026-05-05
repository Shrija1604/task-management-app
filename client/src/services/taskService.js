import axios from "axios";

const API = "http://localhost:5000/api/tasks";

const getToken = () => localStorage.getItem("token");

export const getTasks = async () => {
  return await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};

export const createTask = async (data) => {
  return await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};

export const updateTask = async (id, data) => {
  return await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};

export const deleteTask = async (id) => {
  return await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};