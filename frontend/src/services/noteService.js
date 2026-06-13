import api from "./api";

export const getNotesByTask = async (taskId) => {
  const response = await api.get(`/notes/task/${taskId}`);
  return response.data;
};

export const createNote = async (taskId, content) => {
  const response = await api.post(`/notes/task/${taskId}`, { content });
  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await api.delete(`/notes/${noteId}`);
  return response.data;
};
