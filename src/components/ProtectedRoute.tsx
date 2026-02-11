import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../admin/context/AuthContext'
import { routePermissions } from '../utils/permissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  requiredPermission?: { resource: string; action: string }
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  requiredPermission 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, hasPermission } = useAuth()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login (only after loading is complete)
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const userRoleType = user.roleType || 'user'

  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRoleType)) {
      // Redirect to appropriate dashboard based on user's role
      const redirectPath = getRoleBasePath(userRoleType)
      return <Navigate to={redirectPath} replace />
    }
  }

  // Owner can access all admin routes (like admin) - data will be filtered by backend
  if (userRoleType === 'owner') {
    // Owner can access both /owner and /admin routes (full feature access)
    if (!location.pathname.startsWith('/owner') && !location.pathname.startsWith('/admin')) {
      return <Navigate to="/owner/overview" replace />
    }
    // Owner bypasses all permission checks - allow access (like admin)
    return <>{children}</>
  }

  // For employees, check permissions if required
  if (userRoleType === 'employee' && !user.isAdmin) {
    // Check explicit permission requirement
    if (requiredPermission) {
      if (!hasPermission(requiredPermission.resource, requiredPermission.action)) {
        // Redirect to employee dashboard if no permission
        return <Navigate to="/employee/overview" replace />
      }
    } else {
      // Check route-based permission
      const routePermission = routePermissions[location.pathname]
      if (routePermission) {
        if (!hasPermission(routePermission.resource, routePermission.action)) {
          // Redirect to employee dashboard if no permission
          return <Navigate to="/employee/overview" replace />
        }
      }
    }
  }

  // Admin can only access admin routes (when in admin routes)
  if (userRoleType === 'admin' && allowedRoles?.includes('admin') && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin/overview" replace />
  }

  return <>{children}</>
}

// Get base path for each role type
export const getRoleBasePath = (roleType: string): string => {
  switch (roleType) {
    case 'admin':
      return '/admin/overview'
    case 'owner':
      return '/owner/overview'
    case 'employee':
      return '/employee/overview'
    default:
      return '/user/overview'
  }
}

// Get role-specific prefix for routes
export const getRolePrefix = (roleType: string): string => {
  switch (roleType) {
    case 'admin':
      return '/admin'
    case 'owner':
      return '/owner'
    case 'employee':
      return '/employee'
    default:
      return '/user'
  }
}
