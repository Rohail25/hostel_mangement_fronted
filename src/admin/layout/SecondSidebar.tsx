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

interface SecondSidebarProps {
  isVisible: boolean;
}

interface PeopleSection {
  id: string;
  label: string;
  path: string;
}

interface VendorSection {
  id: string;
  label: string;
  path: string;
}

interface AccountsSection {
  id: string;
  label: string;
  path: string;
}

interface CommunicationSection {
  id: string;
  label: string;
  path: string;
}

interface FPASection {
  id: string;
  label: string;
  path: string;
}

interface AlertsSection {
  id: string;
  label: string;
  path: string;
}

const SecondSidebar: React.FC<SecondSidebarProps> = ({ isVisible }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check which section we're in
  const isPeopleSection = location.pathname.startsWith(ROUTES.PEOPLE);
  const isVendorSection = location.pathname.startsWith(ROUTES.VENDOR);
  const isAccountsSection = location.pathname.startsWith(ROUTES.ACCOUNTS);
  const isCommunicationSection = location.pathname.startsWith(ROUTES.COMM);
  const isFPASection = location.pathname.startsWith(ROUTES.FPA);
  const isAlertsSection = location.pathname.startsWith(ROUTES.ALERTS);

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

  // Directory sections for People
  const peopleSections: PeopleSection[] = [
    { id: 'Tenants', label: 'Tenants', path: ROUTES.TENANTS },
    { id: 'Employees', label: 'Employees', path: ROUTES.EMPLOYEES },
    { id: 'Vendors', label: 'Vendor', path: ROUTES.VENDOR_LIST_PEOPLE },
    { id: 'Prospects', label: 'Prospects', path: ROUTES.PROSPECTS },
  ];

  // Directory sections for Vendor Management
  const vendorSections: VendorSection[] = [
    { id: 'Vendor Management', label: 'Vendor Management', path: ROUTES.VENDOR_MANAGEMENT },
    { id: 'Vendor List', label: 'Vendor List', path: ROUTES.VENDOR_LIST },
  ];

  // Directory sections for Accounts - Hierarchical structure
  const accountsMainSections: AccountsSection[] = [
    { id: 'All', label: 'All', path: ROUTES.ACCOUNTS },
    { id: 'Payable', label: 'Payable', path: ROUTES.ACCOUNTS_PAYABLE },
    { id: 'Receivable', label: 'Receivable', path: ROUTES.ACCOUNTS_RECEIVABLE },
  ];

  const accountsPayableSubSections: AccountsSection[] = [
    { id: 'Bills', label: 'Bills', path: ROUTES.ACCOUNTS_PAYABLE_BILLS },
    { id: 'Vendor', label: 'Vendor', path: ROUTES.ACCOUNTS_PAYABLE_VENDOR },
    { id: 'Laundry', label: 'Laundry', path: ROUTES.ACCOUNTS_PAYABLE_LAUNDRY },
  ];

  const accountsReceivableSubSections: AccountsSection[] = [
    { id: 'Received', label: 'Received', path: ROUTES.ACCOUNTS_RECEIVABLE_RECEIVED },
  ];

  // Directory sections for Communication
  const communicationSections: CommunicationSection[] = [
    { id: 'Tenants', label: 'Tenants', path: ROUTES.COMM_TENANTS },
    { id: 'Employees', label: 'Employees', path: ROUTES.COMM_EMPLOYEES },
    { id: 'Vendors', label: 'Vendors', path: ROUTES.COMM_VENDORS },
  ];

  // Directory sections for FP&A
  const fpaSections: FPASection[] = [
    { id: 'Monthly', label: 'Monthly', path: ROUTES.FPA_MONTHLY },
    { id: 'Yearly', label: 'Yearly', path: ROUTES.FPA_YEARLY },
  ];

  // Directory sections for Alerts
  const alertsSections: AlertsSection[] = [
    { id: 'Bills', label: 'Bills', path: ROUTES.ALERTS_BILLS },
    { id: 'Maintenance', label: 'Maintenance', path: ROUTES.ALERTS_MAINTENANCE },
    { id: 'Alert Bin', label: 'Alert Bin', path: ROUTES.ALERTS_BIN },
  ];

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
              onClick={() => navigate('/admin/overview')}
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
                      onClick={() => navigate(section.path)}
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
                      onClick={() => navigate(section.path)}
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
                        onClick={() => navigate(section.path)}
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
                      onClick={() => navigate(section.path)}
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
                      onClick={() => navigate(section.path)}
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
                      onClick={() => navigate(section.path)}
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

