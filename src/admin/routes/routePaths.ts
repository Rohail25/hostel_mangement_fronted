/**
 * Route path constants
 * Centralized route definitions to avoid magic strings
 */

export const ROUTES = {
  ROOT: '/admin',
  OVERVIEW: '/admin/overview',
  PEOPLE: '/admin/people',
  TENANTS: '/admin/people/tenants',
  EMPLOYEES: '/admin/people/employees',
  OWNERS: '/admin/people/owners',
  VENDORS: '/admin/people/vendors',
  VENDOR_LIST_PEOPLE: '/admin/people/vendors/list',
  VENDOR_MANAGEMENT_PEOPLE: '/admin/people/vendors/management',
  PROSPECTS: '/admin/people/prospects',
  ACCOUNTS: '/admin/accounts',
  ACCOUNTS_PAYABLE: '/admin/accounts/payable',
  ACCOUNTS_PAYABLE_ALL: '/admin/accounts/payable/all',
  ACCOUNTS_PAYABLE_BILLS: '/admin/accounts/payable/bills',
  ACCOUNTS_PAYABLE_VENDOR: '/admin/accounts/payable/vendor',
  ACCOUNTS_PAYABLE_LAUNDRY: '/admin/accounts/payable/laundry',
  ACCOUNTS_RECEIVABLE: '/admin/accounts/receivable',
  ACCOUNTS_RECEIVABLE_ALL: '/admin/accounts/receivable/all',
  ACCOUNTS_RECEIVABLE_RECEIVED: '/admin/accounts/receivable/received',
  HOSTEL: '/admin/hostel',
  HOSTEL_CREATE: '/admin/hostel/create',
  HOSTEL_VIEW: (id: string | number) => `/admin/hostel/${id}`,
  HOSTEL_EDIT: (id: string | number) => `/admin/hostel/${id}/edit`,
  ALERTS: '/admin/alerts',
  ALERTS_BILLS: '/admin/alerts/bills',
  ALERTS_MAINTENANCE: '/admin/alerts/maintenance',
  ALERTS_BIN: '/admin/alerts/bin',
  VENDOR: '/admin/vendor',
  VENDOR_LIST: '/admin/vendor/list',
  VENDOR_MANAGEMENT: '/admin/vendor/management',
  VENDOR_RECORDS: '/admin/vendor/records',
  COMM: '/admin/communication',
  COMM_TENANTS: '/admin/communication/tenants',
  COMM_EMPLOYEES: '/admin/communication/employees',
  COMM_VENDORS: '/admin/communication/vendors',
  FPA: '/admin/fpa',
  FPA_MONTHLY: '/admin/fpa/monthly',
  FPA_YEARLY: '/admin/fpa/yearly',
  SETTINGS: '/admin/settings',
} as const;

export default ROUTES;

