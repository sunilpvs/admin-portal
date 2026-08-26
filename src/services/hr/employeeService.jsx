import axiosInstance from "../../utils/axiosInstance";

export const extractEmployeeFromResponse = (response) => {
    if (!response) return null;

    if (Array.isArray(response.employee)) {
        return response.employee[0] || null;
    }

    if (Array.isArray(response.employees)) {
        return response.employees[0] || null;
    }

    return response.employee || null;
};

export const getEmployees = async (page, limit) => {
    try {
        const response = await axiosInstance.get(`api/hr/employee?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

export const getEmployeeById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/hr/employee?id=${id}`);
        return extractEmployeeFromResponse(response.data);
    } catch (error) {
        console.error('Error fetching employee with the given id: ', error);
        throw error;
    }
};

export const addEmployee = async (payload) => {
    try {
        const response = await axiosInstance.post('api/hr/employee', payload);
        return response.data;
    } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
    }
};

export const importEmployeesFromExcel = async (formData) => {
    try {
        const response = await axiosInstance.post('api/hr/employee', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error importing employees from Excel:', error);
        throw error;
    }
};

export const checkDuplicateEmail = async (email) => {
    try {
        const response = await axiosInstance.get(
            `api/hr/employee?check-email-exists=${encodeURIComponent(email)}`
        );
        return response.data;
    } catch (error) {
        console.error('Error checking duplicate email:', error);
        throw error;
    }
};

