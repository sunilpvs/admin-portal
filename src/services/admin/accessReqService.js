import axiosInstance from "../../utils/axiosInstance";

export const getPaginatedAccessRequests = (page = 1, limit = 10) => {
    return axiosInstance.get(`api/admin/access-request?page=${page}&limit=${limit}`);
}

export const getAllAccessRequests = () => {
    return axiosInstance.get(`api/admin/access-request`);
}

export const getAccessRequestById = (id) => {
    return axiosInstance.get(`api/admin/access-request?id=${id}`);
}

export const sendAccessRequest = (payload) => {
    return axiosInstance.post(`api/admin/access-request`, payload);
}

export const updateAccessRequest = (id, payload) => {
    return axiosInstance.put(`api/admin/access-request?id=${id}`, payload);
}

export const getPendingAccessRequests = () => {
    return axiosInstance.get(`api/admin/access-request?type=pending`);
}


export const getAdminAccessStatus = () => {
    return axiosInstance.get(`auth/access-status.php?type=admin`);
}

export const deleteUser = (payload) => {
    return axiosInstance.delete(`api/admin/access-request`, payload);
}

export const getPaginatedUsers = (page = 1, limit = 10) => {
    return axiosInstance.get(`api/admin/access-request?type=all_users&page=${page}&limit=${limit}`);
}

export const getEmailFromToken = () => {
    return axiosInstance.get(`api/admin/access-request?type=email`);
}

