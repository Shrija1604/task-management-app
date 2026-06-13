import api from "./api";

export const getAttachmentsByTask = async (taskId) => {
  const response = await api.get(`/attachments/task/${taskId}`);
  return response.data;
};

export const addAttachment = async (taskId, attachmentData) => {
  const response = await api.post(`/attachments/task/${taskId}`, attachmentData);
  return response.data;
};

export const deleteAttachment = async (id) => {
  const response = await api.delete(`/attachments/${id}`);
  return response.data;
};
