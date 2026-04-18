<<<<<<< HEAD
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * ProtectedCheckoutRoute
 * If user is NOT logged in → redirect to /login with a message
 * If user IS logged in → allow through to checkout
 */
const ProtectedCheckoutRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect to login, remembering they wanted to go to checkout
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "Please log in to place your order.",
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedCheckoutRoute;
=======
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
>>>>>>> 59a4ae99967cb506889ed09948870305d515e698
