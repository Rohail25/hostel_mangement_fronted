/**
 * Admin routes configuration
 * Defines all routes for the admin panel
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layout/AdminLayout';
import ROUTES from './routePaths';

// Lazy load pages for better performance
const Overview = React.lazy(() => import('../pages/Overview'));
const TenantsList = React.lazy(() => import('../pages/People/TenantsList'));
const EmployeesList = React.lazy(() => import('../pages/People/EmployeesList'));
const AccountsList = React.lazy(() => import('../pages/Accounts/AccountsList'));
const HostelList = React.lazy(() => import('../pages/Hostel/HostelList'));
const HostelCreate = React.lazy(() => import('../pages/Hostel/HostelCreate'));
const HostelEdit = React.lazy(() => import('../pages/Hostel/HostelEdit'));
const AlertsList = React.lazy(() => import('../pages/Alerts/AlertsList'));
const VendorList = React.lazy(() => import('../pages/Vendor/VendorList'));
const CommunicationBoard = React.lazy(
  () => import('../pages/Communication/CommunicationBoard')
);
const FinanceDashboard = React.lazy(() => import('../pages/FPA/FinanceDashboard'));
const SettingsForm = React.lazy(() => import('../pages/Settings/SettingsForm'));

/**
 * Admin routes component with nested routing
 */
export const AdminRoutes: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <Routes>
        <Route element={<AdminLayout />}>
          {/* Redirect /admin to /admin/overview */}
          <Route index element={<Navigate to={ROUTES.OVERVIEW} replace />} />

          {/* Main pages */}
          <Route path="overview" element={<Overview />} />

          {/* People */}
          <Route path="people/tenants" element={<TenantsList />} />
          <Route path="people/employees" element={<EmployeesList />} />

          {/* Accounts */}
          <Route path="accounts" element={<AccountsList />} />

          {/* Hostel Management */}
          <Route path="hostel" element={<HostelList />} />
          <Route path="hostel/create" element={<HostelCreate />} />
          <Route path="hostel/:id/edit" element={<HostelEdit />} />

          {/* Alerts */}
          <Route path="alerts" element={<AlertsList />} />

          {/* Vendor */}
          <Route path="vendor" element={<VendorList />} />

          {/* Communication */}
          <Route path="communication" element={<CommunicationBoard />} />

          {/* FP&A */}
          <Route path="fpa" element={<FinanceDashboard />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsForm />} />

          {/* 404 - catch all */}
          <Route
            path="*"
            element={
              <div className="text-center py-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  404 - Page Not Found
                </h1>
                <p className="text-slate-600">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            }
          />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

