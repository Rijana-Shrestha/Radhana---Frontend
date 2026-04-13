import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://radhana-art.onrender.com/api",
  withCredentials: true, // Send cookies with every request
});

// Request interceptor to handle FormData and auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization header if token exists
    const token = getTokenFromStorage();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData - let browser set it automatically
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Helper function to get token from cookie or localStorage
const getTokenFromStorage = () => {
  // First try localStorage (new approach)
  let token = localStorage.getItem("authToken");
  if (token) return token;
  
  // Fallback to cookie (legacy)
  const name = "authToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  return null;
};

// Error handling interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
