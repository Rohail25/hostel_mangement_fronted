/**
 * API Configuration
 * Centralized configuration for API base URL and all route endpoints
 */

// Base API URL - Change this to your backend URL
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hostel-mgt-backend.hmstech.org/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Log the API base URL on module load for debugging
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔧 Environment Variable VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || 'Not set (using default)');

/**
 * API Route Constants
 * All API endpoints are defined here for easy maintenance
 */
export const API_ROUTES = {
  // Authentication Routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    REFRESH_TOKEN: '/refresh-token',
    VERIFY_EMAIL: '/verify-email',
  },

  // User Routes
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    USERS: '/users',
    USER_BY_ID: (id: string | number) => `/users/${id}`,
  },

  // Hostel Routes
  HOSTEL: {
    LIST: '/admin/hostels',
    CREATE: '/admin/hostels',
    BY_ID: (id: string | number) => `/admin/hostels/${id}`,
    UPDATE: (id: string | number) => `/admin/hostels/${id}`,
    DELETE: (id: string | number) => `/admin/hostels/${id}`,
    SEARCH: '/admin/hostels/search',
    BY_CITY: '/admin/hostels/city',
    ARCHITECTURE: (id: string | number) => `/admin/hostels/${id}/architecture`,
  },

  // Tenant Routes
  TENANT: {
    LIST: '/admin/tenants',
    CREATE: '/admin/tenant',
    BY_ID: (id: string | number) => `/admin/tenant/${id}`,
    UPDATE: (id: string | number) => `/admin/tenant/${id}`,
    DELETE: (id: string | number) => `/admin/tenant/${id}`,
    SEARCH: '/admin/tenants/search',
    BY_HOSTEL: (hostelId: string | number) => `/admin/tenants/hostel/${hostelId}`,
  },

  // Floor/Block Routes (UI shows "Block", backend uses "Floor")
  FLOOR: {
    CREATE: '/admin/floor',
    LIST: '/admin/floors',
    BY_ID: (id: string | number) => `/admin/floor/${id}`,
    UPDATE: (id: string | number) => `/admin/floor/${id}`,
    DELETE: (id: string | number) => `/admin/floor/${id}`,
    BY_HOSTEL: (hostelId: string | number) => `/admin/floors/hostel/${hostelId}`,
  },

  // Room Routes
  ROOM: {
    CREATE: '/admin/room',
    LIST: '/admin/rooms',
    BY_ID: (id: string | number) => `/admin/room/${id}`,
    UPDATE: (id: string | number) => `/admin/room/${id}`,
    DELETE: (id: string | number) => `/admin/room/${id}`,
    BY_HOSTEL: (hostelId: string | number) => `/admin/room/hostel/${hostelId}`,
    BY_FLOOR: (floorId: string | number) => `/admin/room/floor/${floorId}`,
    UPDATE_STATUS: (id: string | number) => `/admin/room/${id}/status`,
    MAINTENANCE: (id: string | number) => `/admin/rooms/${id}/maintenance`,
  },

  // Allocation Routes
  ALLOCATION: {
    FLOORS: '/floors',
    ROOMS_BY_FLOOR: (floorId: string | number) => `/room/floor/${floorId}`,
    BEDS_BY_ROOM: (roomId: string | number) => `/beds/room/${roomId}`,
    UPDATE_BED: (bedId: string | number) => `/admin/allocation/bed/${bedId}`,
  },

  // Bed Routes
  BED: {
    CREATE: '/admin/bed',
    LIST: '/admin/beds',
    BY_ID: (id: string | number) => `/admin/bed/${id}`,
    UPDATE: (id: string | number) => `/admin/bed/${id}`,
    DELETE: (id: string | number) => `/admin/bed/${id}`,
    BEDS_BY_ROOM: (roomId: string | number) => `/admin/beds/room/${roomId}`,
  },

  // Employee Routes
  EMPLOYEE: {
    LIST: '/employees',
    CREATE: '/employees',
    BY_ID: (id: string | number) => `/employees/${id}`,
    UPDATE: (id: string | number) => `/employees/${id}`,
    DELETE: (id: string | number) => `/employees/${id}`,
    SEARCH: '/employees/search',
    BY_HOSTEL: (hostelId: string | number) => `/employees/hostel/${hostelId}`,
  },

  // Account/Transaction Routes
  ACCOUNT: {
    TRANSACTIONS: '/transactions',
    CREATE: '/transactions',
    BY_ID: (id: string | number) => `/transactions/${id}`,
    UPDATE: (id: string | number) => `/transactions/${id}`,
    DELETE: (id: string | number) => `/transactions/${id}`,
    SUMMARY: '/transactions/summary',
    BY_HOSTEL: (hostelId: string | number) => `/transactions/hostel/${hostelId}`,
    // Payables and Receivables
    PAYABLES: '/admin/accounts/payables',
    PAYABLE_BILLS: '/admin/accounts/payable/bills',
    PAYABLE_VENDOR: '/admin/accounts/payable/vendor',
    PAYABLE_LAUNDRY: '/admin/accounts/payable/laundry',
    RECEIVABLES: '/admin/accounts/receivables',
    RECEIVABLE_RECEIVED: '/admin/accounts/receivable/received',
  },

  // Expense/Bill Routes
  EXPENSE: {
    LIST: '/admin/expenses',
    CREATE: '/admin/expenses',
    BY_ID: (id: string | number) => `/admin/expenses/${id}`,
    UPDATE: (id: string | number) => `/admin/expenses/${id}`,
    DELETE: (id: string | number) => `/admin/expenses/${id}`,
    UPDATE_STATUS: (id: string | number) => `/admin/expenses/${id}/status`,
  },

  // Vendor Routes
  VENDOR: {
    LIST: '/admin/vendors',
    CREATE: '/admin/vendors',
    BY_ID: (id: string | number) => `/admin/vendors/${id}`,
    BY_HOSTEL: (hostelId: string | number) => `/admin/vendors/hostel/${hostelId}`,
    UPDATE: (id: string | number) => `/admin/vendors/${id}`,
    DELETE: (id: string | number) => `/admin/vendors/${id}`,
    SEARCH: '/admin/vendors/search',
  },

  // Vendor Category Routes
  VENDOR_CATEGORY: {
    LIST: '/admin/vendor-categories',
    CREATE: '/admin/vendor-categories',
    BY_ID: (id: string | number) => `/admin/vendor-categories/${id}`,
    UPDATE: (id: string | number) => `/admin/vendor-categories/${id}`,
    DELETE: (id: string | number) => `/admin/vendor-categories/${id}`,
  },

  // Alert Routes
  ALERT: {
    LIST: '/admin/alerts',
    CREATE: '/admin/alerts',
    BY_ID: (id: string | number) => `/admin/alerts/${id}`,
    UPDATE: (id: string | number) => `/admin/alerts/${id}`,
    UPDATE_STATUS: (id: string | number) => `/admin/alerts/${id}/status`,
    DELETE: (id: string | number) => `/admin/alerts/${id}`,
    MARK_READ: (id: string | number) => `/admin/alerts/${id}/read`,
    UNASSIGNED: '/admin/alerts/unassigned',
    STATS: '/admin/alerts/stats',
  },

  // Communication Routes
  COMMUNICATION: {
    MESSAGES: '/messages',
    SEND: '/messages/send',
    BY_ID: (id: string | number) => `/messages/${id}`,
    BY_TARGET: (target: string) => `/messages/target/${target}`,
  },

  // Finance Routes
  FINANCE: {
    MONTHLY: '/finance/monthly',
    YEARLY: '/finance/yearly',
    DASHBOARD: '/finance/dashboard',
  },

  // FP&A Routes
  FPA: {
    SUMMARY: '/admin/fpa/summary',
    MONTHLY_COMPARISON: '/admin/fpa/monthly-comparison',
    CATEGORIES: '/admin/fpa/categories',
    CASH_FLOW: '/admin/fpa/cash-flow',
    RATIOS: '/admin/fpa/ratios',
    PRINT: '/admin/fpa/print',
  },

  // Dashboard Routes
  DASHBOARD: {
    OVERVIEW: '/admin/dashboard/overview',
  },

  // Settings Routes
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    PERSONAL_INFO: '/admin/settings/profile/personal-info',
    PROFILE_INFO: '/admin/settings/profile-info',
    CHANGE_PASSWORD: '/admin/settings/profile/password',
  },
} as const;

/**
 * Helper function to build full API URL
 * @param route - API route path
 * @returns Full API URL
 */
export const buildApiUrl = (route: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  return `${API_BASE_URL}${cleanRoute}`;
};

