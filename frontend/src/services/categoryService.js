import API from "./api";

// GET ALL CATEGORIES
export const getCategories = async () => {
  const response = await API.get("/categories");
  return response.data;
};

// CREATE CATEGORY (admin only)
export const createCategory = async (data) => {
  const response = await API.post("/categories", data);
  return response.data;
};

// UPDATE CATEGORY (admin only)
export const updateCategory = async (id, data) => {
  const response = await API.put(`/categories/${id}`, data);
  return response.data;
};

// DELETE CATEGORY (admin only)
export const deleteCategory = async (id) => {
  const response = await API.delete(`/categories/${id}`);
  return response.data;
};
