import axiosInstance from "../../utils/axiosInstance";

export const getPaginatedOfficeLocations = (page = 1, limit = 10) => {
  return axiosInstance.get(
    `api/admin/office-locations?page=${page}&limit=${limit}`
  );
};

export const getOfficeLocationById = (id) => {
  return axiosInstance.get(`api/admin/office-locations?id=${id}`);
};

export const addOfficeLocation = (payload) => {
  return axiosInstance.post("api/admin/office-locations", payload);
};

export const editOfficeLocation = (id, payload) => {
  return axiosInstance.put(`api/admin/office-locations?id=${id}`, payload);
};

export const getOfficeLocationCombo = () => {
  return axiosInstance.get(
    `api/admin/office-locations?type=combo`
  );
}