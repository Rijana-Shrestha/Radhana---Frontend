import axios from "axios";

// Read token from localStorage first (works on all browsers including mobile Safari)
// Fall back to cookie for backward compatibility
const getToken = () => {
  const localToken = localStorage.getItem("authToken");
  if (localToken) return localToken;

  // Cookie fallback (works on desktop where cross-site cookies are allowed)
  const name = "authToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  for (let cookie of decodedCookie.split(";")) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) return cookie.substring(name.length);
  }
  return null;
};

export const axiosInstance = axios.create({
  baseURL: "https://radhana-art.onrender.com/api",
  withCredentials: true,
});

// Request interceptor - attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - capture token from body (mobile-safe) + handle 401
axiosInstance.interceptors.response.use(
  (response) => {
    // If backend returns token in response body, store it in localStorage
    // This ensures mobile browsers (which block cross-site cookies) stay logged in
    const token = response.data?.authToken;
    if (token) {
      localStorage.setItem("authToken", token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authToken");
      // Use hash-compatible redirect so HashRouter handles it correctly
      window.location.replace("/#/login");
    }
    return Promise.reject(error);
  },
);