import axiosInstance from '../../utils/axiosInstance'

export const getBankDetails = (id) => {
    return axiosInstance.get(`api/vms/bank?vendor_id=${id}`);
}

export const addBankDetails = (id, payload) => {
    return axiosInstance.post(`api/vms/bank?vendor_id=${id}`,payload );
}

export const addComplianceDetails = (id, payload) => {
    return axiosInstance.post(`api/vms/bank?vendor_id=${id}`,payload );
}