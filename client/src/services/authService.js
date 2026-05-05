import axios from "axios";

const API = "http://localhost:5000/api/auth";

// LOGIN
export const loginUser = async (data) => {
  return await axios.post(`${API}/login`, data);
};

// REGISTER
export const registerUser = async (data) => {
  return await axios.post(`${API}/register`, data);
};

// SAVE TOKEN
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// GET TOKEN
export const getToken = () => {
  return localStorage.getItem("token");
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
};