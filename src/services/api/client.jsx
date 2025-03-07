import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);
    return response.data; 
  } catch (error) {
    if (error.response) {
      // other respones
      switch (error.response.status) {
        case 400:
          throw new Error('Bad Request: Please check your input data.');
        case 409:
          throw new Error('Conflict: User already exists.');
        default:
          throw new Error('Registration failed. Please try again.');
      }
    } else {
      throw new Error('Network error. Please check your connection.');
    }
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("Invalid Credentials");
      }
      throw new Error(error.response.data.message || "Login failed.");
    } else {
      throw new Error("Network error. Please try again.");
    }
  }
};
