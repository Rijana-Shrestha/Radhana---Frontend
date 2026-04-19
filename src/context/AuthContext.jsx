import { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem("isLoggedIn");
    return stored ? JSON.parse(stored) : false;
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // Only clear session on 401 (truly unauthorized / token expired)
      // Don't clear on network errors or 5xx — mobile networks are unreliable
      if (error.response?.status === 401) {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authToken");
      }
      // For network errors / 500s, keep the stored session so user stays logged in
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn && JSON.parse(storedIsLoggedIn)) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      // Verify token is still valid with backend
      fetchUserProfile();
    } else {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authToken");
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    if (res.data?.twoFactorRequired) {
      return res.data;
    }
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    // authToken is saved automatically by the axios response interceptor
    await fetchUserProfile();
    return res.data;
  };

  const registerUser = async (name, email, phone, password, confirmPassword) => {
    const res = await axiosInstance.post("/auth/register", {
      name,
      email,
      phone,
      password,
      confirmPassword,
    });
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    await fetchUserProfile();
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken"); // ← clear stored token
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        registerUser,
        isLoggedIn,
        user,
        loading,
        logout,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};