import { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios";

export const AuthContext = createContext();

// Helper function to extract token from cookies
const getTokenFromCookie = () => {
  const name = "authToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  return null;
};

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
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    // If there's a stored user and login flag, verify with backend
    if (storedUser && storedIsLoggedIn && JSON.parse(storedIsLoggedIn)) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);

      // Verify token is valid with backend
      fetchUserProfile();
    } else {
      // No stored session - definitely logged out
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    // If 2FA is required, return the response for Login page to handle
    if (res.data?.twoFactorRequired) {
      return res.data;
    }
    // Token is set in httpOnly cookie by backend automatically
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    // Fetch user profile after login
    await fetchUserProfile();
    return res.data;
  };

  const registerUser = async (
    name,
    email,
    phone,
    password,
    confirmPassword,
  ) => {
    const res = await axiosInstance.post("/auth/register", {
      name,
      email,
      phone,
      password,
      confirmPassword,
    });
    // Token is set in httpOnly cookie by backend automatically
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    // Fetch user profile after register
    await fetchUserProfile();
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        registerUser,
        isLoggedIn,
        getTokenFromCookie,
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
