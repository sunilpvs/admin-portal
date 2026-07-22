import axiosInstance from '../../utils/axiosInstance';

export const getLeaveTypes = async () => {
    try {
        const response = await axiosInstance.get('api/lms/leave-type/get.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching leave types:', error);
        throw error;
    }
}

export const getLeaveTypeById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/lms/leave-type/get.php?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching leave type by id:', error);
        throw error;
    }
}

export const getLeaveTypeCombo = async () => {
    try {
        const response = await axiosInstance.get('api/lms/leave-type/get.php?type=combo');
        return response.data;
    } catch (error) {
        console.error('Error fetching leave type combo:', error);
        throw error;
    }
}

export const addLeaveType = async (payload) => {
    try {
        const response = await axiosInstance.post('api/lms/leave-type/create.php', payload);
        return response.data;
    } catch (error) {
        console.error('Error adding leave type:', error);
        throw error;
    }
}

export const editLeaveType = async (id, payload) => {
    try {
        const response = await axiosInstance.put(`api/lms/leave-type/update.php?id=${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error editing leave type:', error);
        throw error;
    }
}

export const deleteLeaveType = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/lms/leave-type/delete.php?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting leave type:', error);
        throw error;
    }
}
