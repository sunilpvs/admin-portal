import axiosInstance from '../../utils/axiosInstance'

export const getGstDetails = (id) => {
    return axiosInstance.get(`api/vms/gst?vendor_id=${id}`);
}

export const addGstDetails = (id, payload) => {
    return axiosInstance.post(`api/vms/gst?vendor_id=${id}`, payload);
}

export const addFinancialDetails = (id, payload) => {
    return axiosInstance.post(`api/vms/gst?vendor_id=${id}`, payload);
}

export const addNatureOfBusiness = (id, payload) => {
    return axiosInstance.post(`api/vms/gst?vendor_id=${id}`, payload);
}




