/**
 * Admin routes configuration
 * Defines all routes for the admin panel
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminLayout } from '../layout/AdminLayout';

// Lazy load pages for better performance
const Overview = React.lazy(() => import('../pages/Overview'));
const PeopleHub = React.lazy(() => import('../pages/People/PeopleHub'));
const AccountsList = React.lazy(() => import('../pages/Accounts/AccountsList'));
const HostelList = React.lazy(() => import('../pages/Hostel/HostelList'));
const HostelCreate = React.lazy(() => import('../pages/Hostel/HostelCreate'));
const HostelView = React.lazy(() => import('../pages/Hostel/HostelView'));
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
    <ProtectedRoute allowedRoles={['admin', 'owner']}>
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
          <Route index element={<Navigate to="/admin/overview" replace />} />

          {/* Main pages */}
          <Route path="overview" element={<Overview />} />

          {/* People */}
          <Route path="people" element={<PeopleHub />} />
          <Route path="people/tenants" element={<PeopleHub />} />
          <Route path="people/employees" element={<PeopleHub />} />
          <Route path="people/vendors/list" element={<PeopleHub />} />
          <Route path="people/vendors/management" element={<PeopleHub />} />
          <Route path="people/vendors" element={<Navigate to="/admin/people/vendors/list" replace />} />
          <Route path="people/prospects" element={<PeopleHub />} />

          {/* Accounts */}
          <Route path="accounts" element={<AccountsList />} />
          <Route path="accounts/payable" element={<AccountsList />} />
          <Route path="accounts/payable/all" element={<AccountsList />} />
          <Route path="accounts/payable/bills" element={<AccountsList />} />
          <Route path="accounts/payable/vendor" element={<AccountsList />} />
          <Route path="accounts/payable/laundry" element={<AccountsList />} />
          <Route path="accounts/receivable" element={<AccountsList />} />
          <Route path="accounts/receivable/all" element={<AccountsList />} />
          <Route path="accounts/receivable/received" element={<AccountsList />} />

          {/* Hostel Management */}
          <Route path="hostel" element={<HostelList />} />
          <Route path="hostel/create" element={<HostelCreate />} />
          <Route path="hostel/:id" element={<HostelView />} />
          <Route path="hostel/:id/edit" element={<HostelEdit />} />

          {/* Alerts */}
          <Route path="alerts" element={<AlertsList />} />
          <Route path="alerts/bills" element={<AlertsList />} />
          <Route path="alerts/maintenance" element={<AlertsList />} />
          <Route path="alerts/bin" element={<AlertsList />} />

          {/* Vendor Management */}
          <Route path="vendor" element={<Navigate to="/admin/vendor/management" replace />} />
          <Route path="vendor/management" element={<VendorList />} />
          <Route path="vendor/list" element={<VendorList />} />

          {/* Communication */}
          <Route path="communication" element={<CommunicationBoard />} />
          <Route path="communication/tenants" element={<CommunicationBoard />} />
          <Route path="communication/employees" element={<CommunicationBoard />} />
          <Route path="communication/vendors" element={<CommunicationBoard />} />

          {/* FP&A */}
          <Route path="fpa" element={<FinanceDashboard />} />
          <Route path="fpa/monthly" element={<FinanceDashboard />} />
          <Route path="fpa/yearly" element={<FinanceDashboard />} />

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
    </ProtectedRoute>
  );
};

