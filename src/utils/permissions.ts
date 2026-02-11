/**
 * Permission utility functions
 * Used for checking user permissions in the frontend
 */

import { useAuth } from '../admin/context/AuthContext'

/**
 * Resource-action mapping for routes
 * Maps route paths to required permissions
 */
export const routePermissions: Record<string, { resource: string; action: string }> = {
  // Admin routes
  '/admin/people': { resource: 'tenants', action: 'view_list' },
  '/admin/people/tenants': { resource: 'tenants', action: 'view_list' },
  '/admin/people/employees': { resource: 'employees', action: 'view_list' },
  '/admin/people/vendors': { resource: 'vendors', action: 'view_list' },
  '/admin/people/prospects': { resource: 'prospects', action: 'view_list' },
  '/admin/accounts': { resource: 'accounts', action: 'view_list' },
  '/admin/hostel': { resource: 'hostels', action: 'view_list' },
  '/admin/alerts': { resource: 'alerts', action: 'view_list' },
  '/admin/vendor': { resource: 'vendors', action: 'view_list' },
  '/admin/vendor/management': { resource: 'vendors', action: 'view_list' },
  '/admin/communication': { resource: 'communication', action: 'view_list' },
  '/admin/fpa': { resource: 'finance', action: 'view_list' },
  '/admin/settings': { resource: 'settings', action: 'view' },
  
  // Owner routes - owners have access to their own data (no permission check needed, handled by backend)
  '/owner/people': { resource: 'tenants', action: 'view_list' },
  '/owner/hostel': { resource: 'hostels', action: 'view_list' },
  '/owner/settings': { resource: 'settings', action: 'view' },
  
  // Employee routes - based on permissions
  '/employee/people': { resource: 'tenants', action: 'view_list' },
  '/employee/hostel': { resource: 'hostels', action: 'view_list' },
  '/employee/settings': { resource: 'settings', action: 'view' },
}

/**
 * Check if user can access a route based on role and permissions
 * @param roleType - User's role type
 * @param path - Route path
 * @param hasPermission - Function to check permission
 * @returns boolean
 */
export const canAccessRoute = (
  roleType: string,
  path: string,
  hasPermission: (resource: string, action: string) => boolean
): boolean => {
  // Admin can access everything
  if (roleType === 'admin') {
    return true
  }
  
  // Owner can access both admin and owner routes (full feature access, data filtered by backend)
  if (roleType === 'owner') {
    return path.startsWith('/owner') || path.startsWith('/admin')
  }
  
  // Employee needs permission check
  if (roleType === 'employee') {
    // Check if route requires permission
    const permission = routePermissions[path]
    if (permission) {
      return hasPermission(permission.resource, permission.action)
    }
    // If no permission mapping, allow access (for overview, etc.)
    return path.startsWith('/employee')
  }
  
  // User role
  if (roleType === 'user') {
    return path.startsWith('/user')
  }
  
  return false
}

/**
 * Hook to check if user has permission
 * @param resource - Resource name
 * @param action - Action name
 * @returns boolean
 */
export const useHasPermission = () => {
  const { hasPermission } = useAuth()
  return hasPermission
}
