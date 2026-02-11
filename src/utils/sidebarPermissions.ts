/**
 * Sidebar Permission Mapping Utility
 * 
 * Maps sidebar tabs to their corresponding permission resources.
 * This ensures that only users with the correct permissions can see specific tabs.
 * 
 * Rules:
 * - Admin: Can see all tabs (bypasses permission checks)
 * - Owner: Can see all tabs (data filtered by backend, but UI shows all)
 * - Employee: Must have view_list permission for the tab's resource to see it
 */

/**
 * Mapping of main sidebar tabs to their permission resources
 * Resource names match the database Permission.resource field
 */
export const MAIN_SIDEBAR_PERMISSIONS: Record<string, { resource: string; action: string }> = {
  overview: { resource: 'overview', action: 'view_list' },
  people: { resource: 'people', action: 'view_list' },
  vendorManagement: { resource: 'vendor_management', action: 'view_list' },
  accounts: { resource: 'accounts', action: 'view_list' },
  hostelManagement: { resource: 'hostel_management', action: 'view_list' },
  alerts: { resource: 'alerts', action: 'view_list' },
  communication: { resource: 'communication', action: 'view_list' },
  fpa: { resource: 'fpa', action: 'view_list' },
  settings: { resource: 'settings', action: 'view_list' },
};

/**
 * Mapping of second sidebar (sub-tabs) to their permission resources
 */
export const SECOND_SIDEBAR_PERMISSIONS: Record<string, { resource: string; action: string }> = {
  // People sub-tabs
  tenants: { resource: 'tenants', action: 'view_list' },
  employees: { resource: 'employees', action: 'view_list' },
  prospects: { resource: 'prospects', action: 'view_list' },
  
  // Vendor sub-tabs
  vendorList: { resource: 'vendor_list', action: 'view_list' },
  
  // Accounts sub-tabs
  accountsAll: { resource: 'accounts_all', action: 'view_list' },
  accountsPayable: { resource: 'accounts_payable', action: 'view_list' },
  accountsReceivable: { resource: 'accounts_receivable', action: 'view_list' },
  bills: { resource: 'bills', action: 'view_list' },
  accountsVendor: { resource: 'accounts_vendor', action: 'view_list' },
  laundry: { resource: 'laundry', action: 'view_list' },
  received: { resource: 'received', action: 'view_list' },
  
  // Communication sub-tabs
  commTenants: { resource: 'comm_tenants', action: 'view_list' },
  commEmployees: { resource: 'comm_employees', action: 'view_list' },
  commVendors: { resource: 'comm_vendors', action: 'view_list' },
  
  // FP&A sub-tabs
  fpaMonthly: { resource: 'fpa_monthly', action: 'view_list' },
  fpaYearly: { resource: 'fpa_yearly', action: 'view_list' },
  
  // Alerts sub-tabs
  alertsBills: { resource: 'alerts_bills', action: 'view_list' },
  alertsMaintenance: { resource: 'alerts_maintenance', action: 'view_list' },
  alertsBin: { resource: 'alerts_bin', action: 'view_list' },
  
  // Settings sub-tabs (Personal Information and Change Password are always accessible)
  personalInformation: { resource: 'personal_information', action: 'view_list' },
  changePassword: { resource: 'change_password', action: 'view_list' },
  hostelInfo: { resource: 'hostel_info', action: 'view_list' },
  userRoles: { resource: 'user_roles', action: 'view_list' },
  vendorCategory: { resource: 'vendor_category', action: 'view_list' },
  vendorService: { resource: 'vendor_service', action: 'view_list' },
  currency: { resource: 'currency', action: 'view_list' },
};

/**
 * Check if a user can see a sidebar tab based on their role and permissions
 * 
 * @param tabKey - The key of the tab (e.g., 'overview', 'people', 'tenants')
 * @param userRoleType - User's role type ('admin', 'owner', 'employee', 'user')
 * @param isAdmin - Whether user is admin (isAdmin flag)
 * @param hasPermission - Function to check if user has a specific permission
 * @param isMainSidebar - Whether this is a main sidebar tab (true) or second sidebar tab (false)
 * @returns boolean - Whether the tab should be visible
 */
export const canSeeSidebarTab = (
  tabKey: string,
  userRoleType: string,
  isAdmin: boolean,
  hasPermission: (resource: string, action: string) => boolean,
  isMainSidebar: boolean = true
): boolean => {
  // Admin can see everything
  if (isAdmin || userRoleType === 'admin') {
    return true;
  }
  
  // Owner can see all tabs (data is filtered by backend, but UI shows all)
  if (userRoleType === 'owner') {
    return true;
  }
  
  // For employees and other roles, check permissions
  const permissionMap = isMainSidebar ? MAIN_SIDEBAR_PERMISSIONS : SECOND_SIDEBAR_PERMISSIONS;
  const permission = permissionMap[tabKey];
  
  if (!permission) {
    // If no permission mapping exists, allow access (for backward compatibility)
    console.warn(`No permission mapping found for tab: ${tabKey}`);
    return true;
  }
  
  // Check if user has the required permission
  return hasPermission(permission.resource, permission.action);
};

/**
 * Filter sidebar tabs based on user role and permissions
 * 
 * @param tabs - Array of tab objects with a key property
 * @param userRoleType - User's role type
 * @param isAdmin - Whether user is admin
 * @param hasPermission - Function to check permissions
 * @param isMainSidebar - Whether these are main sidebar tabs
 * @returns Filtered array of tabs
 */
export const filterSidebarTabs = <T extends { key: string }>(
  tabs: T[],
  userRoleType: string,
  isAdmin: boolean,
  hasPermission: (resource: string, action: string) => boolean,
  isMainSidebar: boolean = true
): T[] => {
  return tabs.filter(tab => 
    canSeeSidebarTab(tab.key, userRoleType, isAdmin, hasPermission, isMainSidebar)
  );
};
