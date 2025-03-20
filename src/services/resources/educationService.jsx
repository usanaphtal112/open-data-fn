import apiClient from '../api/client';
import { endpoints } from '../api/endpoints';

export const educationService = {
  // Get all schools
  getSchools: async () => {
    try {
      const response = await apiClient.get(endpoints.education.schools);
      return response.data;
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  },

  // Get school detail by ID
  getSchoolDetail: async (id) => {
    try {
      const response = await apiClient.get(endpoints.education.schoolDetails(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching school detail for ID ${id}:`, error);
      throw error;
    }
  }
};

export default educationService;