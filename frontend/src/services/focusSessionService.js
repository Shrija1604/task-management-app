import api from "./api";

export const getFocusSessionsByTask = async (taskId) => {
  const response = await api.get(`/focussessions/task/${taskId}`);
  return response.data;
};

export const addFocusSession = async (taskId, sessionData) => {
  const response = await api.post(`/focussessions/task/${taskId}`, sessionData);
  return response.data;
};

export const updateFocusSession = async (id, sessionData) => {
  const response = await api.put(`/focussessions/${id}`, sessionData);
  return response.data;
};

export const deleteFocusSession = async (id) => {
  const response = await api.delete(`/focussessions/${id}`);
  return response.data;
};
