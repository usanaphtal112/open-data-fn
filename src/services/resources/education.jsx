import apiClient from '../api/client';
import { endpoints } from '../api/endpoints';

export const getSchools = async () => {
    try {
        const response = await apiClient.get(endpoints.education.schools);
        return response.data;
    } catch (error) {
        console.error('Error fetching schools:', error);
        throw error;
    }
};

export const getSchoolDetails = async (id) => {
    try {
        const response = await apiClient.get(endpoints.education.schoolDetails(id));
        return response.data;
    } catch (error) {
        console.error('Error fetching school details:', error);
        throw error;
    }
};