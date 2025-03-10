import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { endpoints } from '../api/endpoints';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.rwandadataplatform.org/api';

// /**
//  * Get the access token from session storage
//  * @returns {string|null} JWT access token or null if not found
//  */
// export const getAccessToken = () => {
//   const obfuscatedToken = sessionStorage.getItem('__sd_parcel_A1qx0se3E6u9i');
//   if (!obfuscatedToken) return null;
//   return deobfuscateToken(obfuscatedToken);
// };

/**
 * Retrieve the JWT from sessionStorage and reconstruct it
 * @returns {string|null} Reconstructed JWT or null if missing
 */
export const getAccessToken = () => {
  const storedKeys = sessionStorage.getItem('x1a');
  if (!storedKeys) return null;

  const keys = storedKeys.split('|');
  if (keys.length !== 3) return null;

  const parts = keys.map((key) => decryptPart(sessionStorage.getItem(key)));

  if (parts.some((part) => !part)) {
    return null;
  }

  return parts.join('.');
};

/**
 * Clear all token parts from sessionStorage
 */
export const clearAccessToken = () => {
  const storedKeys = sessionStorage.getItem('x1a');
  if (storedKeys) {
    storedKeys.split('|').forEach((key) => sessionStorage.removeItem(key));
    sessionStorage.removeItem('x1a');
  }
};


/**
 * Deobfuscate token to get the original JWT
 * @param {string} obfuscatedToken - Obfuscated token from session storage
 * @returns {string} Original JWT token
 */
const deobfuscateToken = (obfuscatedToken) => {
  const parts = obfuscatedToken.split('_');
  if (parts.length < 2) return null;
  // Return everything after the first underscore
  return parts.slice(1).join('_');
};

/**
 * Obfuscate token before storing it
 * @param {string} token - JWT token to obfuscate
 * @returns {string} Obfuscated token
 */
const obfuscateToken = (token) => {
  const prefix = generateTokenPrefix();
  return `${prefix}_${token}`;
};
/**
 * Generate a random string to obscure the token
 * @returns {string} A random prefix for token obfuscation
 */
const generateTokenPrefix = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// /**
//  * Store the access token in session storage with obfuscation
//  * @param {string} token - JWT access token
//  */
// const storeAccessToken = (token) => {
//   const obfuscatedToken = obfuscateToken(token);
//   sessionStorage.setItem('__sd_parcel_A1qx0se3E6u9i', obfuscatedToken);
// };
/**
 * Encrypt a given string using basic obfuscation
 * @param {string} data - The string to encrypt
 * @returns {string} Obfuscated/encrypted string
 */
const encryptPart = (data) => {
  return btoa(data.split('').reverse().join('')); // Reverse + Base64 encoding
};

/**
 * Decrypt an encrypted string
 * @param {string} encryptedData - The string to decrypt
 * @returns {string} Decrypted original string
 */
const decryptPart = (encryptedData) => {
  return atob(encryptedData).split('').reverse().join(''); // Reverse + Base64 decoding
};

/**
 * Store the access token in sessionStorage securely
 * @param {string} token - JWT access token
 */
export const storeAccessToken = (token) => {
  const parts = token.split('.'); // JWT format: header.payload.signature
  if (parts.length !== 3) {
    console.error('Invalid JWT structure');
    return;
  }

  const keys = [
    generateRandomKey(), 
    generateRandomKey(), 
    generateRandomKey()
  ];

  sessionStorage.setItem(keys[0], encryptPart(parts[0]));
  sessionStorage.setItem(keys[1], encryptPart(parts[1]));
  sessionStorage.setItem(keys[2], encryptPart(parts[2]));

  // Store the keys in an obfuscated way
  sessionStorage.setItem('x1a', keys.join('|')); 
};

/**
 * Generate a random storage key
 * @returns {string} Randomized key
 */
const generateRandomKey = () => {
  return 'key_' + Math.random().toString(36).substring(2, 12);
};


/**
 * Check if the current token is expired
 * @returns {boolean} True if token is expired or not present
 */
export const isTokenExpired = () => {
  const token = getAccessToken();
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    console.log('Token expiration:', new Date(decoded.exp * 1000));
    console.log('Current time:', new Date(currentTime * 1000));
    console.log('Is token expired:', decoded.exp < currentTime);
    
    // Return true if token is expired
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Direct axios instance for refresh requests only - avoids interceptor loops
const refreshAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Essential for sending cookies
});

// Refresh access token function
const refreshAccessTokenDirectly = async () => {
  console.log('Starting access token refresh process...');
  
  try {
    console.log('Sending refresh token request to:', endpoints.auth.refreshToken);
    const response = await refreshAxios.post(endpoints.auth.refreshToken, {});
    
    console.log('Refresh token response received:', response.status);
    
    if (response.data && response.data.access_token) {
      console.log('New access token received');
      storeAccessToken(response.data.access_token);
      return response.data.access_token;
    } else {
      console.error('No access token in response data:', response.data);
      throw new Error('No access token received');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server:');
      console.error('Request details:', {
        url: endpoints.auth.refreshToken,
        method: 'POST',
        withCredentials: true
      });
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
};

class TokenManager {
  constructor() {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
    this.refreshTimeoutId = null;
    
    // Initialize token monitoring
    this.startTokenMonitor();
  }
  
  // Monitor token expiration and refresh proactively
  startTokenMonitor() {
    console.log('Starting token monitor');
    this.checkTokenExpiration();
    
    // Check token expiration every 30 seconds
    setInterval(() => {
      this.checkTokenExpiration();
    }, 30000);
  }
  
  // Check if token is expired or about to expire
  checkTokenExpiration() {
    const token = getAccessToken();
    
    if (!token) {
      console.log('No token to monitor');
      return;
    }
    
    try {
      // If token is expired or expiring within 60 seconds, refresh it
      if (this.shouldRefreshToken()) {
        console.log('Token needs refresh (proactive check)');
        this.refreshToken();
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
  }
  
  // Determine if token should be refreshed (expired or expiring soon)
  shouldRefreshToken() {
    const token = getAccessToken();
    if (!token) return false;
    
    try {
      // If token is already expired
      if (isTokenExpired()) {
        console.log('Token is already expired');
        return true;
      }
      
      // Get expiration time from token
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      // Refresh if token expires in less than 60 seconds
      const shouldRefresh = expiresAt - currentTime < 300000;
      if (shouldRefresh) {
        console.log('Token will expire soon, refreshing proactively');
      }
      return shouldRefresh;
    } catch (error) {
      console.error('Error determining if token should be refreshed:', error);
      return false;
    }
  }
  
  // Get a valid token, refreshing if necessary
  async getValidToken() {
    const token = getAccessToken();
    
    // If no token or token is expired or expiring soon
    if (!token || this.shouldRefreshToken()) {
      console.log('Getting fresh token');
      return this.refreshToken();
    }
    
    return token;
  }
  
  // Add a callback to the subscribers array
  subscribeTokenRefresh(callback) {
    this.refreshSubscribers.push(callback);
    return () => {
      this.refreshSubscribers = this.refreshSubscribers.filter(cb => cb !== callback);
    };
  }
  
  // Execute all subscribers when token refresh is complete
  onRefreshed(token) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }
  
  // Refresh the token
  async refreshToken() {
    // Prevent multiple concurrent refresh attempts
    if (this.isRefreshing) {
      console.log('Already refreshing, waiting for completion');
      return new Promise((resolve, reject) => {
        this.subscribeTokenRefresh(token => {
          resolve(token);
        });
        
        // Add timeout to prevent hanging indefinitely
        setTimeout(() => reject(new Error('Token refresh timeout')), 10000);
      });
    }
    
    console.log('Starting token refresh...');
    this.isRefreshing = true;
    
    try {
      // Clear any existing refresh timeout
      if (this.refreshTimeoutId) {
        clearTimeout(this.refreshTimeoutId);
      }
      
      // Perform the token refresh
      const newToken = await refreshAccessTokenDirectly();
      console.log('Token refreshed successfully');
      
      // Update status and notify subscribers
      this.isRefreshing = false;
      this.onRefreshed(newToken);
      
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.isRefreshing = false;
      // Clear session storage
      sessionStorage.removeItem('__sd_parcel_A1qx0se3E6u9i');

      // Redirect user to login page
      window.location.href = '/login';
      throw error;
    }
  }
}

// Create and export a singleton instance
const tokenManager = new TokenManager();

export default tokenManager;