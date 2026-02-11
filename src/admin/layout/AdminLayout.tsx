/**
 * AdminLayout component - Modern Glassy Layout
 * Main layout wrapper with beautiful gradients and smooth animations
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import SecondSidebar from './SecondSidebar';
import { Topbar } from './Topbar';
import ROUTES from '../routes/routePaths';
import { CurrencyProvider } from '../context/CurrencyContext';

/**
 * Modern glassy admin layout component
 */
export const AdminLayout: React.FC = () => {
  const location = useLocation();
  // State to track if user manually collapsed the sidebar (via toggle button)
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  
  // Check if People, Vendor, Accounts, Communication, FP&A, or Alerts section is active by examining the current route
  // Support both /admin/* and /owner/* routes
  const isPeopleActive = location.pathname.startsWith(ROUTES.PEOPLE) || location.pathname.startsWith('/owner/people') || location.pathname.startsWith('/admin/people');
  // Vendor Management (main sidebar) should show second sidebar like Accounts
  const isVendorManagementActive = location.pathname.startsWith(ROUTES.VENDOR_MANAGEMENT) || location.pathname.startsWith('/owner/vendor/management') || location.pathname.startsWith('/admin/vendor/management');
  const isVendorActive = location.pathname.startsWith(ROUTES.VENDOR) || location.pathname.startsWith('/owner/vendor') || location.pathname.startsWith('/admin/vendor');
  const isAccountsActive = location.pathname.startsWith(ROUTES.ACCOUNTS) || location.pathname.startsWith('/owner/accounts') || location.pathname.startsWith('/admin/accounts');
  const isCommunicationActive = location.pathname.startsWith(ROUTES.COMM) || location.pathname.startsWith('/owner/communication') || location.pathname.startsWith('/admin/communication');
  const isFPAActive = location.pathname.startsWith(ROUTES.FPA) || location.pathname.startsWith('/owner/fpa') || location.pathname.startsWith('/admin/fpa');
  const isAlertsActive = location.pathname.startsWith(ROUTES.ALERTS) || location.pathname.startsWith('/owner/alerts') || location.pathname.startsWith('/admin/alerts');
  // Settings does NOT show second sidebar - it shows cards directly
  // const isSettingsActive = location.pathname.startsWith(ROUTES.SETTINGS) || location.pathname.startsWith('/owner/settings') || location.pathname.startsWith('/admin/settings');
  const isSecondSidebarActive = isPeopleActive || isVendorActive || isAccountsActive || isCommunicationActive || isFPAActive || isAlertsActive;
  
  /**
   * Sidebar Collapse Logic:
   * 
   * The sidebar should be collapsed in two scenarios:
   * 1. When "People" or "Vendor" (but NOT Vendor Management) is active (automatic collapse) - to make room for second sidebar
   * 2. When user manually toggles it (via toggle button)
   * 
   * When navigating away from People/Vendor:
   * - If sidebar was collapsed only because People/Vendor was active, expand it back
   * - If user manually collapsed it, keep it collapsed (respect user preference)
   * 
   * This useEffect handles the automatic collapse/expand based on People/Vendor route
   */
  useEffect(() => {
    if (isSecondSidebarActive) {
      // People, Vendor, Accounts, Communication, FP&A, or Alerts is active: collapse sidebar automatically to show second sidebar
      // Don't change isManuallyCollapsed here - we want to preserve user's manual preference
    } else {
      // Second sidebar is not active: expand sidebar back
      // Only reset if it wasn't manually collapsed by user
      // If user manually collapsed it, they probably want it to stay collapsed
      // So we only auto-expand if it was collapsed due to second sidebar being active
      // For simplicity, we'll auto-expand when leaving (user can manually collapse again if needed)
      setIsManuallyCollapsed(false);
    }
  }, [isSecondSidebarActive]);
  
  /**
   * Determine final collapsed state:
   * - Collapsed if second sidebar is active (automatic) OR manually collapsed by user
   */
  const isSidebarCollapsed = isSecondSidebarActive || isManuallyCollapsed;

  return (
    <CurrencyProvider>
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Sidebar - Collapses to icons when People is active or manually toggled */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      {/* Second Sidebar - Only appears when People, Vendor, Accounts, Communication, or FP&A is active */}
      <SecondSidebar isVisible={isSecondSidebarActive} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <Topbar
          onToggleSidebar={() => {
            /**
             * Toggle sidebar collapse state
             * This allows users to manually collapse/expand the sidebar
             * When People is active, this toggle will override the automatic collapse
             */
            setIsManuallyCollapsed(!isManuallyCollapsed);
          }}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
    </CurrencyProvider>
  );
};
