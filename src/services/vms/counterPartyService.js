import axiosInstance from "../../utils/axiosInstance";

export const getCounterPartyInfo = (id) => {
    return axiosInstance.get(`api/vms/counterparty?id=${id}`);
};

export const addCounterParty = (payload) => {
    return axiosInstance.post(`api/vms/counterparty?ref_id=VNDR202500`, payload);
}

