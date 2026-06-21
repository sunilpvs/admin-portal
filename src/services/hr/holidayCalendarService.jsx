import axiosInstance from '../../utils/axiosInstance';

export const getPaginatedHolidays = async (page, limit) => {
  try {
    const response = await axiosInstance.get('api/hr/holiday-calendar', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching holidays list:', error);
    throw error;
  }
};

export const getHolidayById = async (id) => {
  try {
    const response = await axiosInstance.get(`api/hr/holiday-calendar?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching holiday by ID:', error);
    throw error;
  }
};

export const getBranches = async () => {
  try {
    const response = await axiosInstance.get('api/hr/holiday-calendar?type=branches');
    return response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const addHoliday = async (payload) => {
  try {
    const response = await axiosInstance.post('api/hr/holiday-calendar', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding holiday:', error);
    throw error;
  }
};

export const importHolidaysFromFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('api/hr/holiday-calendar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error importing holidays from file:', error);
    throw error;
  }
};

export const updateHoliday = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`api/hr/holiday-calendar?id=${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating holiday:', error);
    throw error;
  }
};

export const deleteHoliday = async (id) => {
  try {
    const response = await axiosInstance.delete(`api/hr/holiday-calendar?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting holiday:', error);
    throw error;
  }
};
