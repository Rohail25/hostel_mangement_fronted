/**
 * SecondSidebar Component
 * 
 * This component displays a nested sidebar that appears when "People" is selected.
 * It shows the Directory navigation with: Tenants, Owners, Vendors, Prospects
 * 
 * Features:
 * - Smooth slide-in/slide-out animation
 * - Active section highlighting
 * - Search functionality
 * - Back navigation
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ROUTES from '../routes/routePaths';
import { useAuth } from '../context/AuthContext';
import { canSeeSidebarTab } from '../../utils/sidebarPermissions';

interface SecondSidebarProps {
  isVisible: boolean;
}

interface PeopleSection {
  id: string;
  key: string; // For permission checking
  label: string;
  path: string;
}

interface VendorSection {
  id: string;
  key: string; // For permission checking
  label: string;
  path: string;
}

interface AccountsSection {
  id: string;
  key: string; // For permission checking
  label: string;
  path: string;
}

interface CommunicationSection {
  id: string;
  key: string; // For permission checking
  label: string;
  path: string;
}

interface FPASection {
  id: string;
  key: string; // For permission checking
  label: string;
  path: string;
}

interface AlertsSection {
  id: string;
  key: string; // For permission checking
  label: string;
  path: string;
}

interface SettingsSection {
  id: string;
  key: string; // For permission checking
  label: string;
  path?: string;
  onClick?: () => void;
  alwaysVisible?: boolean; // Personal Information and Change Password are always visible
}

const SecondSidebar: React.FC<SecondSidebarProps> = ({ isVisible }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  
  // Get user's role type
  const userRoleType = user?.roleType || 'user';
  const isAdmin = user?.isAdmin || false;

  // Helper function to adjust path for owner routes
  const adjustPathForRole = (path: string): string => {
    if (location.pathname.startsWith('/owner')) {
      return path.replace('/admin', '/owner');
    }
    return path;
  };

  // Check which section we're in - support both /admin/* and /owner/* routes
  const isPeopleSection = location.pathname.startsWith(ROUTES.PEOPLE) || location.pathname.startsWith('/owner/people') || location.pathname.startsWith('/admin/people');
  const isVendorSection = location.pathname.startsWith(ROUTES.VENDOR) || location.pathname.startsWith('/owner/vendor') || location.pathname.startsWith('/admin/vendor');
  const isAccountsSection = location.pathname.startsWith(ROUTES.ACCOUNTS) || location.pathname.startsWith('/owner/accounts') || location.pathname.startsWith('/admin/accounts');
  const isCommunicationSection = location.pathname.startsWith(ROUTES.COMM) || location.pathname.startsWith('/owner/communication') || location.pathname.startsWith('/admin/communication');
  const isFPASection = location.pathname.startsWith(ROUTES.FPA) || location.pathname.startsWith('/owner/fpa') || location.pathname.startsWith('/admin/fpa');
  const isAlertsSection = location.pathname.startsWith(ROUTES.ALERTS) || location.pathname.startsWith('/owner/alerts') || location.pathname.startsWith('/admin/alerts');
  const isSettingsSection = location.pathname.startsWith(ROUTES.SETTINGS) || location.pathname.startsWith('/owner/settings') || location.pathname.startsWith('/admin/settings');

  // Get active section from URL for People
  const getActivePeopleSection = (): string | null => {
    if (location.pathname.includes('/tenants')) return 'Tenants';
    if (location.pathname.includes('/employees')) return 'Employees';
    if (location.pathname.includes('/prospects')) return 'Prospects';
    return null;
  };

  // Get active section from URL for Vendor Management
  const getActiveVendorSection = (): string | null => {
    if (location.pathname.includes('/vendor/management')) return 'Vendor Management';
    if (location.pathname.includes('/vendor/list')) return 'Vendor List';
    if (location.pathname.includes('/vendor')) return 'Vendor Management'; // Default to Vendor Management
    return null;
  };

  // Get active section from URL for Accounts
  const getActiveAccountsSection = (): string | null => {
    // Check for base accounts route first (All)
    if (location.pathname === ROUTES.ACCOUNTS || location.pathname === ROUTES.ACCOUNTS + '/') return 'All';
    if (location.pathname.includes('/accounts/payable/bills')) return 'Bills';
    if (location.pathname.includes('/accounts/payable/vendor')) return 'Vendor';
    if (location.pathname.includes('/accounts/payable/laundry')) return 'Laundry';
    if (location.pathname.includes('/accounts/payable')) return 'Payable';
    if (location.pathname.includes('/accounts/receivable/received')) return 'Received';
    if (location.pathname.includes('/accounts/receivable')) return 'Receivable';
    return null;
  };

  // Get active section from URL for Communication
  const getActiveCommunicationSection = (): string | null => {
    if (location.pathname.includes('/communication/tenants')) return 'Tenants';
    if (location.pathname.includes('/communication/employees')) return 'Employees';
    if (location.pathname.includes('/communication/vendors')) return 'Vendors';
    return null;
  };

  // Get active section from URL for FP&A
  const getActiveFPASection = (): string | null => {
    if (location.pathname.includes('/fpa/monthly')) return 'Monthly';
    if (location.pathname.includes('/fpa/yearly')) return 'Yearly';
    return null;
  };

  // Get active section from URL for Alerts
  const getActiveAlertsSection = (): string | null => {
    if (location.pathname.includes('/alerts/bills')) return 'Bills';
    if (location.pathname.includes('/alerts/maintenance')) return 'Maintenance';
    return null;
  };

  const activePeopleSection = getActivePeopleSection();
  const activeVendorSection = getActiveVendorSection();
  const activeAccountsSection = getActiveAccountsSection();
  const activeCommunicationSection = getActiveCommunicationSection();
  const activeFPASection = getActiveFPASection();
  const activeAlertsSection = getActiveAlertsSection();

  // Helper function to filter sections based on permissions
  const filterSections = <T extends { key: string; alwaysVisible?: boolean }>(
    sections: T[]
  ): T[] => {
    return sections.filter(section => {
      // Always show sections marked as alwaysVisible (Personal Information, Change Password)
      if (section.alwaysVisible) {
        return true;
      }
      
      // Admin and Owner can see all sections
      if (isAdmin || userRoleType === 'admin' || userRoleType === 'owner') {
        return true;
      }
      
      // For employees, check permissions
      return canSeeSidebarTab(
        section.key,
        userRoleType,
        isAdmin,
        hasPermission,
        false // This is second sidebar
      );
    });
  };

  // Directory sections for People
  const peopleSections: PeopleSection[] = filterSections([
    { id: 'Tenants', key: 'tenants', label: 'Tenants', path: ROUTES.TENANTS },
    { id: 'Employees', key: 'employees', label: 'Employees', path: ROUTES.EMPLOYEES },
    { id: 'Vendors', key: 'vendorList', label: 'Vendor', path: ROUTES.VENDOR_LIST_PEOPLE },
    { id: 'Prospects', key: 'prospects', label: 'Prospects', path: ROUTES.PROSPECTS },
  ]);

  // Directory sections for Vendor Management
  const vendorSections: VendorSection[] = filterSections([
    { id: 'Vendor Management', key: 'vendorManagement', label: 'Vendor Management', path: ROUTES.VENDOR_MANAGEMENT },
    { id: 'Vendor List', key: 'vendorList', label: 'Vendor List', path: ROUTES.VENDOR_LIST },
  ]);

  // Directory sections for Accounts - Hierarchical structure
  const accountsMainSections: AccountsSection[] = filterSections([
    { id: 'All', key: 'accountsAll', label: 'All', path: ROUTES.ACCOUNTS },
    { id: 'Payable', key: 'accountsPayable', label: 'Payable', path: ROUTES.ACCOUNTS_PAYABLE },
    { id: 'Receivable', key: 'accountsReceivable', label: 'Receivable', path: ROUTES.ACCOUNTS_RECEIVABLE },
  ]);

  const accountsPayableSubSections: AccountsSection[] = filterSections([
    { id: 'Bills', key: 'bills', label: 'Bills', path: ROUTES.ACCOUNTS_PAYABLE_BILLS },
    { id: 'Vendor', key: 'accountsVendor', label: 'Vendor', path: ROUTES.ACCOUNTS_PAYABLE_VENDOR },
    { id: 'Laundry', key: 'laundry', label: 'Laundry', path: ROUTES.ACCOUNTS_PAYABLE_LAUNDRY },
  ]);

  const accountsReceivableSubSections: AccountsSection[] = filterSections([
    { id: 'Received', key: 'received', label: 'Received', path: ROUTES.ACCOUNTS_RECEIVABLE_RECEIVED },
  ]);

  // Directory sections for Communication
  const communicationSections: CommunicationSection[] = filterSections([
    { id: 'Tenants', key: 'commTenants', label: 'Tenants', path: ROUTES.COMM_TENANTS },
    { id: 'Employees', key: 'commEmployees', label: 'Employees', path: ROUTES.COMM_EMPLOYEES },
    { id: 'Vendors', key: 'commVendors', label: 'Vendors', path: ROUTES.COMM_VENDORS },
  ]);

  // Directory sections for FP&A
  const fpaSections: FPASection[] = filterSections([
    { id: 'Monthly', key: 'fpaMonthly', label: 'Monthly', path: ROUTES.FPA_MONTHLY },
    { id: 'Yearly', key: 'fpaYearly', label: 'Yearly', path: ROUTES.FPA_YEARLY },
  ]);

  // Directory sections for Alerts
  const alertsSections: AlertsSection[] = filterSections([
    { id: 'Bills', key: 'alertsBills', label: 'Bills', path: ROUTES.ALERTS_BILLS },
    { id: 'Maintenance', key: 'alertsMaintenance', label: 'Maintenance', path: ROUTES.ALERTS_MAINTENANCE },
    { id: 'Alert Bin', key: 'alertsBin', label: 'Alert Bin', path: ROUTES.ALERTS_BIN },
  ]);

  // Settings sections - Always show Personal Information and Change Password for all users
  const settingsSections: SettingsSection[] = filterSections([
    { id: 'Personal Information', key: 'personalInformation', label: 'Personal Information', alwaysVisible: true },
    { id: 'Change Password', key: 'changePassword', label: 'Change Password', alwaysVisible: true },
    { id: 'Hostel Info', key: 'hostelInfo', label: 'Hostel Info' },
    { id: 'User Roles', key: 'userRoles', label: 'User Roles' },
    { id: 'Vendor Category', key: 'vendorCategory', label: 'Vendor Category' },
    { id: 'Vendor Service', key: 'vendorService', label: 'Vendor Service' },
    { id: 'Currency', key: 'currency', label: 'Currency' },
  ]);

  // Get active section from URL for Settings
  const getActiveSettingsSection = (): string | null => {
    // Settings sections are handled by card clicks, not routes
    // We can detect based on query params or state, but for now return null
    return null;
  };

  const activeSettingsSection = getActiveSettingsSection();

  /**
   * SecondSidebar Component:
   * 
   * This nested sidebar appears when "People" is selected in the main sidebar.
   * It displays the Directory navigation with sub-items: Tenants, Employees, Owners, Vendors, Prospects
   * 
   * Props:
   * - isVisible: Boolean that controls whether the sidebar should be shown
   * 
   * Animation:
   * - Slides in from 0px to 240px width when isVisible becomes true
   * - Slides out from 240px to 0px when isVisible becomes false
   * - Uses AnimatePresence to handle mount/unmount animations smoothly
   * 
   * State Management:
   * - Visibility is controlled by parent (AdminLayout) based on route
   * - Automatically hides when navigating away from People section
   */
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}      // Start: Hidden, no width
          animate={{ width: 240, opacity: 1 }}     // End: Visible, 240px wide
          exit={{ width: 0, opacity: 0 }}          // Exit: Hide again, collapse width
          transition={{ 
            duration: 0.3,      // Animation duration: 300ms
            ease: 'easeInOut'   // Smooth transition
          }}
          className="h-screen bg-[#1A2B4D] border-r border-white/10 flex flex-col overflow-hidden"
        >
          {/* Search Bar */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/60 px-0 py-2 text-sm focus:outline-none focus:border-white transition-colors"
              />
              <span className="absolute right-0 top-2 text-white/60 text-xs">⌘K</span>
            </div>
          </div>

          {/* Directory Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Back Navigation */}
            <button
              onClick={() => {
                // Navigate to appropriate overview based on current route
                if (location.pathname.startsWith('/owner')) {
                  navigate('/owner/overview');
                } else {
                  navigate('/admin/overview');
                }
              }}
              className="flex items-center gap-2 text-white/80 hover:text-white text-xs font-medium transition-colors mb-4"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-bold">
                {isPeopleSection ? 'PEOPLE' : 
                 isVendorSection ? 'VENDOR' :
                 isAccountsSection ? 'ACCOUNTS' : 
                 isCommunicationSection ? 'COMMUNICATION' : 
                 isFPASection ? 'FP&A' :
                 isAlertsSection ? 'ALERTS' :
                 isSettingsSection ? 'SETTINGS' :
                 'VENDOR'}
              </span>
            </button>

            {/* Directory Label */}
            <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
              {isPeopleSection ? 'DIRECTORY' : 
               isVendorSection ? 'VENDOR SECTIONS' :
               isAccountsSection ? 'ACCOUNTS SECTIONS' : 
               isCommunicationSection ? 'COMMUNICATION SECTIONS' : 
               isFPASection ? 'FP&A SECTIONS' :
               isAlertsSection ? 'ALERTS SECTIONS' :
               isSettingsSection ? 'SETTINGS SECTIONS' :
               'VENDOR SECTIONS'}
            </h2>

            {/* Directory Items */}
            <nav className="space-y-1">
              {isVendorSection ? (
                vendorSections.map((section) => {
                  const isSectionActive = activeVendorSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => navigate(adjustPathForRole(section.path))}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isSectionActive
                          ? 'bg-[#2176FF] text-white shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{section.label}</span>
                    </button>
                  );
                })
              ) : isPeopleSection ? (
                peopleSections.map((section) => {
                  const isSectionActive = activePeopleSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => navigate(adjustPathForRole(section.path))}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        isSectionActive
                          ? 'bg-[#2176FF] text-white shadow-sm'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{section.label}</span>
                    </button>
                  );
                })
              ) : isAccountsSection ? (
                <>
                  {/* Main Sections - All, Payable, and Receivable (No sub-items in sidebar) */}
                  {accountsMainSections.map((section) => {
                    const isAll = section.id === 'All';
                    const isPayable = section.id === 'Payable';
                    const isReceivable = section.id === 'Receivable';
                    
                    // Determine if this section is active
                    const isSectionActive = isAll 
                      ? activeAccountsSection === 'All'
                      : isPayable
                      ? (activeAccountsSection === 'Payable' || ['Bills', 'Vendor', 'Laundry'].includes(activeAccountsSection || ''))
                      : isReceivable
                      ? (activeAccountsSection === 'Receivable' || activeAccountsSection === 'Received')
                      : false;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => navigate(adjustPathForRole(section.path))}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          isSectionActive
                            ? 'bg-[#2176FF] text-white shadow-sm'
                            : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </>
              ) : isCommunicationSection ? (
                communicationSections.map((section) => {
                  const isSectionActive = activeCommunicationSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => navigate(adjustPathForRole(section.path))}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isSectionActive
                          ? 'bg-[#2176FF] text-white shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{section.label}</span>
                    </button>
                  );
                })
              ) : isFPASection ? (
                fpaSections.map((section) => {
                  const isSectionActive = activeFPASection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => navigate(adjustPathForRole(section.path))}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isSectionActive
                          ? 'bg-[#2176FF] text-white shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{section.label}</span>
                    </button>
                  );
                })
              ) : isAlertsSection ? (
                alertsSections.map((section) => {
                  const isSectionActive = activeAlertsSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => navigate(adjustPathForRole(section.path))}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isSectionActive
                          ? 'bg-[#2176FF] text-white shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{section.label}</span>
                    </button>
                  );
                })
              ) : isSettingsSection ? (
                settingsSections.map((section) => {
                  const isSectionActive = activeSettingsSection === section.id;
                  // Map section labels to setting card IDs
                  const cardIdMap: { [key: string]: string } = {
                    'Personal Information': 'personal-info',
                    'Change Password': 'login-password',
                    'Hostel Info': 'company-info',
                    'User Roles': 'user-roles',
                    'Vendor Category': 'vendor-category',
                    'Vendor Service': 'vendor-service',
                    'Currency': 'currency',
                  };
                  const cardId = cardIdMap[section.label] || section.id.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        // Scroll to the card and trigger click
                        const cardElement = document.getElementById(`setting-card-${cardId}`);
                        if (cardElement) {
                          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          // Trigger click after a short delay to ensure scroll completes
                          setTimeout(() => {
                            cardElement.click();
                          }, 300);
                        } else {
                          // Fallback: scroll to top
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isSectionActive
                          ? 'bg-[#2176FF] text-white shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{section.label}</span>
                    </button>
                  );
                })
              ) : null}
            </nav>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default SecondSidebar;

