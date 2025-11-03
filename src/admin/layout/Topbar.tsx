/**
 * Topbar component - Modern Glassy Navigation Bar
 * Beautiful gradient topbar with search and notifications
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import ROUTES from '../routes/routePaths';

interface TopbarProps {
  onToggleSidebar: () => void;
}

/**
 * Modern glassy topbar component
 */
export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Clear any stored authentication data
    // localStorage.removeItem('token');
    // sessionStorage.clear();
    
    // Navigate to home page
    navigate('/');
  };

  // Generate page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === ROUTES.OVERVIEW) return 'Overview';
    if (path === ROUTES.TENANTS) return 'Tenants';
    if (path === ROUTES.EMPLOYEES) return 'Employees';
    if (path === ROUTES.ACCOUNTS) return 'Accounts';
    if (path === ROUTES.HOSTEL) return 'Hostel Management';
    if (path === ROUTES.HOSTEL_CREATE) return 'Create Hostel';
    if (path.includes('/hostel/') && path.includes('/edit'))
      return 'Edit Hostel';
    if (path === ROUTES.ALERTS) return 'Alerts';
    if (path === ROUTES.VENDOR) return 'Vendors';
    if (path === ROUTES.COMM) return 'Communication';
    if (path === ROUTES.FPA) return 'Financial Planning & Analysis';
    if (path === ROUTES.SETTINGS) return 'Settings';
    return 'Admin Panel';
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-strong border-b border-white/20 sticky top-0 z-40 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4" style={{ padding: "10px 20px" }}
      >
        {/* Left side */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors lg:hidden glass"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6 text-slate-700" />
          </motion.button>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold  bg-clip-text text-blue-500">
              {getPageTitle()}
            </h2>
            <p className="text-md text-slate-500  mt-0.5">
              Welcome back, Admin
            </p>
          </motion.div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ">
          {/* Quick search */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative group">
              {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
              </div> */}
              {/* <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2.5 w-64 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all placeholder:text-slate-400 text-sm font-medium"
              /> */}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative p-2.5 rounded-xl glass hover:bg-white/50 transition-all group"
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6 text-slate-600 group-hover:text-brand-600 transition-colors" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
            />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
          </motion.button>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3  rounded-xl glass hover:bg-white/50 transition-all cursor-pointer group"
            style={{ padding: "0px 10px" }}
          >
            <div className="w-9 h-9  rounded-full bg-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-semibold text-sm">AD</span>
            </div>
            <div className="block">
              <p className="text-sm font-semibold text-slate-900">Qureshi</p>
              <p className="text-xs text-slate-500"> Admin</p>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleLogout}
            className="flex items-center gap-2 p-10 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all group"
            aria-label="Logout"
            style={{ padding: "5px 5px" }}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
