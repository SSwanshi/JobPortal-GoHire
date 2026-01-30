import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token and handle FormData uploads
api.interceptors.request.use(
  (config) => {
    // Add JWT token to Authorization header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If the data is FormData, remove Content-Type header
    // Axios will automatically set it with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1️⃣ Network / backend-down errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error: Backend server may not be running');
      console.error('Attempted URL:', error.config?.url);
      console.error('Base URL:', error.config?.baseURL);

      error.message =
        'Cannot connect to server. Please ensure the backend server is running on port 3000.';
    }

    // 2️⃣ Unauthorized (JWT expired / invalid)
    if (error.response?.status === 401) {
      // Clear auth data ONLY
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // ❌ Do NOT redirect here
      // ✅ Let AuthContext / route guards handle it
    }

    return Promise.reject(error);
  }
);


export default api;

