import axios from 'axios';
import tokenManager from '../resources/tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.rwandadataplatform.org/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Essential for sending cookies
});

// List of endpoints that don't need token refresh
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/refresh-token',
  '/auth/register'
];

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Skip token checks for auth endpoints
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => 
      config.url.includes(endpoint)
    );
    
    if (!isAuthEndpoint) {
      try {
        // Get a valid token (will refresh if needed)
        const token = await tokenManager.getValidToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
          console.log('Added token to request:', config.url);
        }
      } catch (error) {
        console.error('Error getting valid token:', error);
        // If we're not already on the login page, redirect
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login due to token error');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => 
      originalRequest.url.includes(endpoint)
    );
    
    // Handle 401 responses that aren't from auth endpoints and haven't been retried
    if (error.response && 
        error.response.status === 401 && 
        !originalRequest._retry && 
        !isAuthEndpoint) {
      
      console.log('Received 401 response, attempting to refresh token');
      originalRequest._retry = true;
      
      try {
        // Force a token refresh
        const newToken = await tokenManager.refreshToken();
        
        // Update the request with new token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (error) {
        console.error('Token refresh failed after 401:', error);
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login after failed refresh');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;