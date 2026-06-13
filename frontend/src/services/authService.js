import API from "./api";

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgotpassword", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await API.put(`/auth/resetpassword/${token}`, { password });
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await API.put("/auth/profile", userData);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await API.delete("/auth/account");
  return response.data;
};