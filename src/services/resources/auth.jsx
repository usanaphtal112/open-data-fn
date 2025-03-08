
import apiClient from '../api/client';
import { endpoints } from '../api/endpoints';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise resolving to registration response
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post(endpoints.auth.register, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Promise resolving to login response with access token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post(endpoints.auth.login, credentials);
    
    // Store auth token in localStorage
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 * @returns {Boolean} - Authentication status
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};