import axiosInstance from '../../utils/axiosInstance';

export const getLeavePolicies = async () => {
    try {
        const response = await axiosInstance.get('api/lms/leave-policy/get.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching leave policies:', error);
        throw error;
    }
}

export const getLeavePolicyById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/lms/leave-policy/get.php?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching leave policy with the given id: ', error);
        throw error;
    }
}


export const addLeavePolicy = async (payload) => {
    try {
        const response = await axiosInstance.post('api/lms/leave-policy/create.php', payload);
        return response.data;
    } catch (error) {
        console.error('Error adding leave policy:', error);
        throw error;
    }

}

export const editLeavePolicy = async (id, payload) => {
    try {
        const response = await axiosInstance.put(`api/lms/leave-policy/update.php?id=${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error editing leave policy:', error);
        throw error;
    }
}

export const deleteLeavePolicy = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/lms/leave-policy/delete.php?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting leave policy:', error);
        throw error;
    }
}

