import axios from 'axios';

export const axiosInstance = axios.create({ 
    baseURL: "http://localhost:5000/api",
    withCredentials: true,  // Send cookies with every request
});

// Request interceptor to handle FormData
axiosInstance.interceptors.request.use(
    config => {
        // Don't set Content-Type for FormData - let browser set it automatically
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    error => Promise.reject(error)
);

// Error handling interceptor
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Clear auth data on 401
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);