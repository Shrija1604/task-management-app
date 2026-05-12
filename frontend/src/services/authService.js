import API from "./api";

// REGISTER
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// LOGIN
export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgotpassword", { email });
  return response.data;
};

// RESET PASSWORD
export const resetPassword = async (token, password) => {
  const response = await API.put(`/auth/resetpassword/${token}`, { password });
  return response.data;
};

// UPDATE PROFILE
export const updateProfile = async (userData) => {
  const response = await API.put("/auth/profile", userData);
  return response.data;
};