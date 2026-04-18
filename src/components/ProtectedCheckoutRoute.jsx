import { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios";

export const AuthContext = createContext();

const getTokenFromCookie = () => {
  const name = "authToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  for (let cookie of decodedCookie.split(";")) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) return cookie.substring(name.length);
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

  // Fetch user profile from backend — sets logged-in state
  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
    } catch {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    } finally {
      setLoading(false);
    }
  };

  // On mount — verify stored session is still valid
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedUser && storedLogin && JSON.parse(storedLogin)) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      fetchUserProfile(); // re-verify with backend
    } else {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      setLoading(false);
    }
  }, []);

  // LOGIN — simple flow, no 2FA
  const loginUser = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    await fetchUserProfile();
    return res.data;
  };

  // REGISTER — does NOT log user in (email verification required)
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
    // Returns { emailSent, email, name, message } — no cookie set
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    // Also call backend to clear cookie
    axiosInstance.post("/auth/logout").catch(() => {});
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
