/**
 * Route path constants
 * Centralized route definitions to avoid magic strings
 */

export const ROUTES = {
  ROOT: '/admin',
  OVERVIEW: '/admin/overview',
  TENANTS: '/admin/people/tenants',
  EMPLOYEES: '/admin/people/employees',
  ACCOUNTS: '/admin/accounts',
  HOSTEL: '/admin/hostel',
  HOSTEL_CREATE: '/admin/hostel/create',
  HOSTEL_EDIT: (id: string | number) => `/admin/hostel/${id}/edit`,
  ALERTS: '/admin/alerts',
  VENDOR: '/admin/vendor',
  COMM: '/admin/communication',
  FPA: '/admin/fpa',
  SETTINGS: '/admin/settings',
} as const;

export default ROUTES;

