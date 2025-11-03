/**
 * SettingsForm page
 * User settings and preferences
 */

import React, { useState, useEffect } from 'react';
import { Toast } from '../../components/Toast';
import type { ToastType } from '../../types/common';

interface SettingsData {
  name: string;
  email: string;
  password: string;
  permissions: {
    approveRefunds: boolean;
    editHostels: boolean;
    inviteVendors: boolean;
    manageEmployees: boolean;
    viewFinancials: boolean;
    sendMessages: boolean;
  };
}

const STORAGE_KEY = 'hm_admin_settings';

/**
 * Settings form page
 */
const SettingsForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    name: 'Admin User',
    email: 'admin@hostel.com',
    password: '',
    permissions: {
      approveRefunds: true,
      editHostels: true,
      inviteVendors: true,
      manageEmployees: true,
      viewFinancials: true,
      sendMessages: true,
    },
  });
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Handle save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setToast({
        open: true,
        type: 'success',
        message: 'Settings saved successfully!',
      });
    } catch (error) {
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to save settings. Please try again.',
      });
    }
  };

  // Handle permission toggle
  const togglePermission = (key: keyof SettingsData['permissions']) => {
    setSettings((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Profile Information
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
                className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={settings.password}
                  onChange={(e) =>
                    setSettings({ ...settings, password: e.target.value })
                  }
                  placeholder="Leave blank to keep current password"
                  className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Permissions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Manager Permissions
          </h2>
          <div className="space-y-4">
            {[
              {
                key: 'approveRefunds' as const,
                label: 'Approve Refunds',
                description: 'Process and approve tenant refund requests',
              },
              {
                key: 'editHostels' as const,
                label: 'Edit Hostels',
                description: 'Create, edit, and delete hostel properties',
              },
              {
                key: 'inviteVendors' as const,
                label: 'Invite Vendors',
                description: 'Add new vendors to the system',
              },
              {
                key: 'manageEmployees' as const,
                label: 'Manage Employees',
                description: 'Add, edit, and remove employee records',
              },
              {
                key: 'viewFinancials' as const,
                label: 'View Financials',
                description: 'Access financial reports and analytics',
              },
              {
                key: 'sendMessages' as const,
                label: 'Send Messages',
                description: 'Send communications to tenants, employees, and vendors',
              },
            ].map((perm) => (
              <label
                key={perm.key}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={settings.permissions[perm.key]}
                  onChange={() => togglePermission(perm.key)}
                  className="mt-1 w-5 h-5 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                />
                <div>
                  <p className="font-medium text-slate-900">{perm.label}</p>
                  <p className="text-sm text-slate-600">{perm.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* Toast notification */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default SettingsForm;

