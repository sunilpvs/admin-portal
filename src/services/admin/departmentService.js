import axiosInstance from "../../utils/axiosInstance";

// Get paginated departments
export const getPaginatedDepartments = (page = 1, limit = 10) => {
  return axiosInstance.get(`api/admin/department?page=${page}&limit=${limit}`);
};

// Get department by ID
export const getDepartmentById = (id) => {
  return axiosInstance.get(`api/admin/department?id=${id}`);
};

export const getDepartmentCombo = async () => {
  try {
    const response = await axiosInstance.get(`api/admin/department?type=combo`);
    return response.data;
  } catch (error) {
    console.error("Error fetching department combo list:", error);
    throw error;
  }
}

// Add a new department (JSON payload) or bulk import (FormData with 'file' key)
export const addDepartment = (payload) => {
  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

  return axiosInstance.post("api/admin/department", payload, config);
};

// Update department
export const editDepartment = (id, payload) => {
  return axiosInstance.put(`api/admin/department?id=${id}`, payload);
};

// Delete department
export const deleteDepartment = (id) => {
  return axiosInstance.delete(`api/admin/department?id=${id}`);
};

// Download Excel import template
export const getExcelTemplate = () => {
  return axiosInstance.get("api/admin/department?download-template=true", {
    responseType: "blob",
  });
};
