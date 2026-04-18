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
