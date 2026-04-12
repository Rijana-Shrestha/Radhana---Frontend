import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// ProtectedRoute for admin dashboard - only admins can access
const ProtectedAdminRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext)
  
  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }
  
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />
  }
  
  // Check if user has admin role
  const isAdmin = user.roles && user.roles.includes('ADMIN')
  
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default ProtectedAdminRoute
