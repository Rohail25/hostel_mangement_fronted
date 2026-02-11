import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
  PlusIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import ROUTES from "../routes/routePaths";
import { useAuth } from "../context/AuthContext";
import { canSeeSidebarTab } from "../../utils/sidebarPermissions";

interface NavItem {
  key: string; // Unique key for permission checking
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  requiredPermission?: { resource: string; action: string };
  allowedRoles?: string[]; // Roles that can see this item
}

// Base navigation items with role and permission requirements
const baseNavItems: NavItem[] = [
  { 
    key: 'overview',
    label: "Overview", 
    path: ROUTES.OVERVIEW, 
    icon: ChartBarIcon,
    allowedRoles: ['admin', 'owner', 'employee']
  },
  { 
    key: 'people',
    label: "People", 
    path: ROUTES.PEOPLE, 
    icon: UsersIcon,
    allowedRoles: ['admin', 'owner', 'employee'],
    requiredPermission: { resource: 'people', action: 'view_list' }
  },
  { 
    key: 'vendorManagement',
    label: "Vendor Management", 
    path: ROUTES.VENDOR_MANAGEMENT, 
    icon: BuildingStorefrontIcon,
    allowedRoles: ['admin'],
    requiredPermission: { resource: 'vendor_management', action: 'view_list' }
  },
  { 
    key: 'accounts',
    label: "Accounts", 
    path: ROUTES.ACCOUNTS, 
    icon: CurrencyDollarIcon,
    allowedRoles: ['admin'],
    requiredPermission: { resource: 'accounts', action: 'view_list' }
  },
  { 
    key: 'hostelManagement',
    label: "Hostel Management", 
    path: ROUTES.HOSTEL, 
    icon: BuildingOfficeIcon,
    allowedRoles: ['admin', 'owner', 'employee'],
    requiredPermission: { resource: 'hostel_management', action: 'view_list' }
  },
  { 
    key: 'alerts',
    label: "Alerts", 
    path: ROUTES.ALERTS, 
    icon: BellAlertIcon,
    allowedRoles: ['admin'],
    requiredPermission: { resource: 'alerts', action: 'view_list' }
  },
  { 
    key: 'communication',
    label: "Communication", 
    path: ROUTES.COMM, 
    icon: ChatBubbleLeftRightIcon,
    allowedRoles: ['admin'],
    requiredPermission: { resource: 'communication', action: 'view_list' }
  },
  { 
    key: 'fpa',
    label: "FP&A", 
    path: ROUTES.FPA, 
    icon: PresentationChartLineIcon,
    allowedRoles: ['admin'],
    requiredPermission: { resource: 'fpa', action: 'view_list' }
  },
  { 
    key: 'settings',
    label: "Settings", 
    path: ROUTES.SETTINGS, 
    icon: Cog6ToothIcon,
    allowedRoles: ['admin', 'owner', 'employee']
  },
];

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  
  // Check if People section is active to conditionally hide labels
  const isPeopleActive = location.pathname.startsWith(ROUTES.PEOPLE);
  
  // Get user's role type
  const userRoleType = user?.roleType || 'user';
  const isAdmin = user?.isAdmin || false;
  
  /**
   * Filter navigation items based on role and permissions
   * Rules:
   * - Admin: See all tabs
   * - Owner: See all tabs (data filtered by backend)
   * - Employee: Only see tabs they have permissions for
   */
  const getFilteredNavItems = (): NavItem[] => {
    // Admin and Owner can see all tabs
    if (isAdmin || userRoleType === 'admin' || userRoleType === 'owner') {
      return baseNavItems;
    }
    
    // For employees and other roles, filter based on permissions
    return baseNavItems.filter(item => {
      // Check if user has permission to see this tab
      return canSeeSidebarTab(
        item.key,
        userRoleType,
        isAdmin,
        hasPermission,
        true // This is main sidebar
      );
    });
  };
  
  const navItems = getFilteredNavItems();
  
  // Get role-specific route prefix
  const getRoutePrefix = (): string => {
    switch (userRoleType) {
      case 'admin':
        return '/admin';
      case 'owner':
        return '/owner';
      case 'employee':
        return '/employee';
      default:
        return '/user';
    }
  };
  
  const routePrefix = getRoutePrefix();
  
  // Adjust paths based on current role
  const adjustPath = (path: string): string => {
    // If path starts with /admin but user is not admin, replace with role prefix
    if (path.startsWith('/admin') && userRoleType !== 'admin') {
      return path.replace('/admin', routePrefix);
    }
    return path;
  };

  /**
   * Sidebar Component:
   * 
   * This component renders the main navigation sidebar.
   * 
   * Props:
   * - isCollapsed: Boolean that determines if sidebar should show only icons (true) or full width with labels (false)
   * 
   * Behavior:
   * - When collapsed: Shows only icons, width = 80px
   * - When expanded: Shows icons + labels, width = 256px
   * - Smooth animation between states (0.3s transition)
   * - When People is active, labels are hidden even if sidebar is expanded (for nested sidebar layout)
   */
  return (
    <motion.aside
      animate={{
        width: isCollapsed ? 80 : 256,  // 80px for icons-only, 256px for full width
      }}
      transition={{ 
        duration: 0.3,      // Animation duration: 300ms
        ease: 'easeInOut'   // Smooth start and end, slower in middle
      }}
      className={`h-screen bg-[#1A2B4D] flex flex-col overflow-hidden font-sans`}
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      {/* --- Logo Section --- */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Door Icon - Split Pink/Green */}
          <div className="flex rounded-lg overflow-hidden">
            <div className="w-5 h-5 bg-[#FF3380]"></div>
            <div className="w-5 h-5 bg-[#00FF88]"></div>
          </div>
          <motion.h1
            animate={{ opacity: isCollapsed || isPeopleActive ? 0 : 1, width: isCollapsed || isPeopleActive ? 0 : 'auto' }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold text-white tracking-tight overflow-hidden"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            Hostel Manager
          </motion.h1>
        </div>
        {/* {!isCollapsed && (
          <MagnifyingGlassIcon className="w-5 h-5 text-white cursor-pointer hover:opacity-80 transition-opacity" />
        )} */}
      </div>

      {/* --- Create New Button --- */}
      <AnimatePresence>
        {!isCollapsed && !isPeopleActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-4 overflow-hidden"
          >
            <button className="w-full flex items-center justify-center gap-2 bg-[#FF3380] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#FF1A6E] transition-colors shadow-sm">
              <PlusIcon className="w-5 h-5" />
              <span>Create New</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Navigation --- */}
      <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const adjustedPath = adjustPath(item.path);
          const isPeopleRoute = adjustedPath.includes('/people');

          return (
            <React.Fragment key={adjustedPath}>
              <NavLink
                to={adjustedPath}
                className={({ isActive: navIsActive }) =>
                  `w-full flex items-center ${
                    isPeopleActive ? "justify-center" : (isCollapsed ? "justify-center" : "justify-start")
                  } px-4 py-3 rounded-lg text-base font-normal text-white transition-all duration-200 ${
                    navIsActive || (isPeopleRoute && isPeopleActive)
                      ? "bg-[#2176FF] text-white"
                      : "hover:bg-white/10 text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <motion.span
                    animate={{ opacity: isCollapsed || isPeopleActive ? 0 : 1, width: isCollapsed || isPeopleActive ? 0 : 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="font-sans overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </div>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      {/* --- Footer Profile --- */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!isCollapsed && !isPeopleActive && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
                <p className="text-xs text-white/70">{user?.email || ''}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
