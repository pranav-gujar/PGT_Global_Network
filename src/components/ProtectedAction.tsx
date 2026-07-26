import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedActionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
  onAction?: () => void
}

const ProtectedAction: React.FC<ProtectedActionProps> = ({ 
  children, 
  fallback, 
  requireAuth = true,
  onAction 
}) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    if (loading) {
      e.preventDefault()
      return // ⏳ Don’t allow action until we know if logged in
    }

    if (requireAuth && !user) {
      e.preventDefault()
      navigate(`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`)
    } else if (onAction) {
      onAction()
    }
  }

  // While loading, keep UI stable (don’t flash fallback)
  if (loading) {
    return (
      <div className="opacity-50 cursor-not-allowed w-full">
        {children}
      </div>
    )
  }

  return (
    <div onClick={handleClick} className="w-full">
      {requireAuth && !user && fallback ? fallback : children}
    </div>
  )
}

export default ProtectedAction

