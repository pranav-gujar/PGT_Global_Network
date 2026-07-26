import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('admin' | 'team_member' | 'volunteer' | 'user')[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, userRole, isEmailVerified, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  // If not authenticated, redirect to signin with a redirect parameter back here
  if (!user) {
    return (
      <Navigate 
        to={`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`} 
        replace 
      />
    )
  }

  // Enforce email verification
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  // Enforce role-based checks if specified
  if (allowedRoles) {
    if (userRole === null) {
      return <LoadingSpinner />
    }
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
