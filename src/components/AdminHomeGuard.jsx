import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * AdminHomeGuard - Allows everyone to access home page
 * Admins can now view the store alongside regular users
 */
const AdminHomeGuard = ({ children }) => {
  const { loading, user } = useContext(AuthContext);
  console.log("AdminHomeGuard - User:", user);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  // Allow everyone to view the home page, including admins
  return children;
};

export default AdminHomeGuard;
