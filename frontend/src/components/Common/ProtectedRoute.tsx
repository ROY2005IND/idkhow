import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import LoadingState from './LoadingState'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  allowedRoles?: string[]
  fallback?: ReactNode
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles,
  fallback
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, hasRole } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState text="Checking authentication..." />
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && user && !hasRole(allowedRoles as any)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
