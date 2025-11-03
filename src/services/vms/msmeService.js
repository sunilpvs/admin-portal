import axiosInstance from '../../utils/axiosInstance'

export const getMsmeDetails = (id) => {
    return axiosInstance.get(`api/vms/msme?vendor_id=${id}`);
}

export const addMsmeDetail = (id, payload) => {
    return axiosInstance.post(`api/vms/msme?vendor_id=${id}`, payload);
}

export const addMsmeDetails = (id, payload) => {
    return axiosInstance.post(`api/vms/msme?vendor_id=${id}`, payload);
}

export const addBranches = (id, payload) => {
    return axiosInstance.post(`api/vms/msme?vendor_id=${id}`, payload);
}



