/**
 * SettingsForm page
 * General Settings page with Personal and Company sections
 * Card-based layout matching the design image
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  BellIcon, 
  UsersIcon,
  KeyIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserPlusIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../../components/Button';
import jsPDF from 'jspdf';
import { Toast } from '../../components/Toast';
import type { ToastType } from '../../types/common';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { PersonalInfoModal } from '../../components/settings/PersonalInfoModal';
import { HostelInfoModal } from '../../components/settings/HostelInfoModal';
import { NewUserModal } from '../../components/settings/NewUserModal';
import { UserRolesList } from '../../components/settings/UserRolesList';
import { NewUserRoleModal } from '../../components/settings/NewUserRoleModal';
import { ViewRoleModal } from '../../components/settings/ViewRoleModal';
import { HostelsList } from '../../components/settings/HostelsList';
import { AddHostelForm } from '../../components/AddHostelForm';
import VendorCategoryList from '../../components/settings/VendorCategoryList';
import VendorServiceList from '../../components/settings/VendorServiceList';
import { CurrencyManagementCard } from '../../components/CurrencyManagementCard';
import { changePassword } from '../../services/settings.service';
import * as hostelService from '../../services/hostel.service';
import { api } from '../../../services/apiClient';
import { API_ROUTES } from '../../../services/api.config';
import { useAuth } from '../../context/AuthContext';
import type {
  PersonalInfoModalProps,
  HostelInfoModalProps,
  NewUserModalProps,
  User,
  NewUserFormData,
  UserRole,
  UserRoleFormData,
} from '../../types/settings';
import type { Hostel, HostelFormData } from '../../types/hostel';

interface SettingCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  permissionResource?: string; // Resource name for permission check (e.g., 'hostel_info', 'user_roles')
  permissionAction?: string; // Action name for permission check (e.g., 'view_list')
  alwaysVisible?: boolean; // If true, card is always visible (e.g., Personal Information, Change Password)
}

interface LoginPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change Password Modal Component with Sidebar Layout
 */
const LoginPasswordModal: React.FC<LoginPasswordModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'changePassword' | 'forgetPassword'>('changePassword');
  const [formData, setFormData] = useState<LoginPasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form when modal opens
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setForgetPasswordEmail('');
      setErrors({});
      setSuccess(null);
      setApiError(null);
      setActiveTab('changePassword');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
        // Close modal after showing success
        setTimeout(() => {
          onClose();
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const handleInputChange = (field: keyof LoginPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError(null);
    setSuccess(null);

    try {
      // Call the change password API
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (response && response.success) {
        setSuccess(response.message || 'Password changed successfully!');
        
        // Reset form
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
      } else {
        setApiError(response?.message || 'Failed to change password');
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      // Extract error message from the error object
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Password change endpoint not found. Please contact support.';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Invalid password. Please check your current password and try again.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Current password is incorrect. Please try again.';
      }
      
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgetPasswordEmail.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgetPasswordEmail)) {
      setErrors({ email: 'Invalid email format' });
      return;
    }
    
    setLoading(true);
    setApiError(null);
    setSuccess(null);
    
    try {
      // Call forget password API
      const response = await api.post('/admin/auth/forgot-password', {
        email: forgetPasswordEmail,
      });
      
      if (response.success) {
        setSuccess(response.message || 'Password reset link sent to your email!');
        setForgetPasswordEmail('');
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setApiError(response.message || 'Failed to send password reset link');
      }
    } catch (err: any) {
      console.error('Error sending password reset:', err);
      setApiError(err?.response?.data?.message || 'Failed to send password reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal with Sidebar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-64 bg-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <KeyIcon className="w-6 h-6 text-white" />
                    <h2 className="text-lg font-semibold text-white">Password</h2>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-2">
                  <button
                    onClick={() => setActiveTab('changePassword')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'changePassword'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <LockClosedIcon className="w-5 h-5" />
                    <span className="font-medium">Change Password</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('forgetPassword')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'forgetPassword'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                    <span className="font-medium">Forget Password</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeTab === 'changePassword' && 'CHANGE PASSWORD'}
                      {activeTab === 'forgetPassword' && 'FORGET PASSWORD'}
                    </h3>
                    <span className="block w-12 h-1 bg-pink-500 mt-1" />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {/* Form Content */}
                {activeTab === 'changePassword' ? (
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                      {/* Error and Success Messages */}
                      {(apiError || success) && (
                        <div className="mb-6">
                          {apiError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                              <p className="text-sm">{apiError}</p>
                            </div>
                          )}
                          {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                              <p className="text-sm">{success}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-6 max-w-md">
                        {/* Current Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Current Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={formData.currentPassword}
                              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                              placeholder="Enter current password"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.currentPassword
                                  ? 'border-red-300 focus:ring-red-500'
                                  : 'border-slate-300 focus:ring-blue-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                            >
                              <LockClosedIcon className="w-5 h-5" />
                            </button>
                          </div>
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                          )}
                        </div>

                        {/* New Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            New Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={formData.newPassword}
                              onChange={(e) => handleInputChange('newPassword', e.target.value)}
                              placeholder="Enter new password"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.newPassword
                                  ? 'border-red-300 focus:ring-red-500'
                                  : 'border-slate-300 focus:ring-blue-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                            >
                              <LockClosedIcon className="w-5 h-5" />
                            </button>
                          </div>
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                          )}
                          <p className="mt-1 text-xs text-slate-500">
                            Password must be at least 8 characters long
                          </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirm Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              placeholder="Confirm new password"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.confirmPassword
                                  ? 'border-red-300 focus:ring-red-500'
                                  : 'border-slate-300 focus:ring-blue-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                            >
                              <LockClosedIcon className="w-5 h-5" />
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Changing...</span>
                          </>
                        ) : (
                          'Save'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleForgetPasswordSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                      {/* Error and Success Messages */}
                      {(apiError || success) && (
                        <div className="mb-6">
                          {apiError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                              <p className="text-sm">{apiError}</p>
                            </div>
                          )}
                          {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                              <p className="text-sm">{success}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-6 max-w-md">
                        {/* Email Field */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={forgetPasswordEmail}
                            onChange={(e) => {
                              setForgetPasswordEmail(e.target.value);
                              if (errors.email) {
                                setErrors({ ...errors, email: undefined });
                              }
                            }}
                            placeholder="Enter your email address"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.email
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-slate-300 focus:ring-blue-500'
                            }`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                          <p className="mt-1 text-xs text-slate-500">
                            We'll send a password reset link to this email address
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Users List Component
 */
interface UsersListProps {
  onBack: () => void;
  onNewUser: () => void;
  onEditUser: (user: User) => void;
}

const UsersList: React.FC<UsersListProps> = ({ onBack, onNewUser, onEditUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock users data - in real app, this would come from API
  const [users] = useState<User[]>([
    {
      id: '1',
      firstName: 'Darrel',
      lastName: 'Wilson',
      phone: '(702) 630-0989',
      email: 'darrelporto@gmail.com',
      role: 'Full Access',
      properties: 'All Properties',
      status: 'Active',
      isAccountOwner: true,
    },
  ]);

  // Filter users based on search
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Memoize search handler to prevent re-renders
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Define columns - memoized to prevent re-renders
  const columns: Column<User>[] = React.useMemo(() => [
    {
      key: 'user',
      label: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <div className="font-medium text-slate-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>
                {user.status} {user.isAccountOwner && '/ Account Owner'}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact Information',
      render: (user) => (
        <div className="flex items-center gap-2 text-slate-700">
          <PhoneIcon className="w-4 h-4 text-slate-500" />
          <span>{user.phone}</span>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => (
        <span className="text-slate-700">{user.role}</span>
      ),
    },
    {
      key: 'properties',
      label: 'Properties',
      render: (user) => (
        <span className="text-slate-700">{user.properties}</span>
      ),
    },
  ], []);

  // Actions render for each row - memoized to prevent re-renders
  const actionsRender = React.useCallback((user: User) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        // Handle menu click
      }}
      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
    >
      <EllipsisVerticalIcon className="w-5 h-5 text-slate-600" />
    </button>
  ), []);

  // Toolbar with search and filter - memoized to prevent re-renders
  const toolbar = React.useMemo(
    () => (
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search users"
              className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
            />
          </div>
        </div>
        <button 
          type="button"
          className="p-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <FunnelIcon className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    ),
    [searchQuery, handleSearchChange]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
        </div>
        <button
          onClick={onNewUser}
          className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>New User</span>
        </button>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        toolbar={toolbar}
        onRowClick={onEditUser}
        actionsRender={actionsRender}
        emptyMessage="No users found"
        pageSize={10}
      />
    </div>
  );
};

/**
 * Settings form page with card-based layout
 */
const SettingsForm: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });
  
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isLoginPasswordOpen, setIsLoginPasswordOpen] = useState(false);
  const [isHostelInfoOpen, setIsHostelInfoOpen] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserRolesList, setShowUserRolesList] = useState(false);
  const [isNewUserRoleOpen, setIsNewUserRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [viewingRole, setViewingRole] = useState<UserRole | null>(null);
  const [isViewRoleOpen, setIsViewRoleOpen] = useState(false);
  const [rolesRefreshTrigger, setRolesRefreshTrigger] = useState(0);
  const [showHostelsList, setShowHostelsList] = useState(false);
  const [isAddHostelOpen, setIsAddHostelOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const [hostelsRefreshTrigger, setHostelsRefreshTrigger] = useState(0);
  const [showVendorCategories, setShowVendorCategories] = useState(false);
  const [showVendorServices, setShowVendorServices] = useState(false);
  const [showCurrencyManagement, setShowCurrencyManagement] = useState(false);

  // Helper function to check if a card should be visible
  const canSeeCard = (card: SettingCard): boolean => {
    // Always visible cards (Personal Information and Change Password)
    if (card.alwaysVisible) {
      return true;
    }

    // Admin and Owner can see all cards
    if (user?.isAdmin || user?.roleType === 'admin' || user?.roleType === 'owner') {
      return true;
    }

    // For other roles, check permission
    if (card.permissionResource && card.permissionAction) {
      return hasPermission(card.permissionResource, card.permissionAction);
    }

    // If no permission specified, allow access (for backward compatibility)
    return true;
  };

  // Personal settings cards
  const personalSettings: SettingCard[] = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Change your name, picture, phone, email, & mailing address.',
      icon: UserCircleIcon,
      onClick: () => {
        setIsPersonalInfoOpen(true);
      },
      alwaysVisible: true, // Always visible to all users
    },
    {
      id: 'login-password',
      title: 'Change Password',
      description: 'Change your email or password, and allow technician access.',
      icon: LockClosedIcon,
      onClick: () => {
        setIsLoginPasswordOpen(true);
      },
      alwaysVisible: true, // Always visible to all users
    },
  ];

  // Company settings cards
  const companySettings: SettingCard[] = [
    {
      id: 'company-info',
      title: 'Hostel Info',
      description: 'Manage all your hostels, add new hostels, and edit existing ones.',
      icon: BuildingOfficeIcon,
      onClick: () => {
        setShowHostelsList(true);
      },
      permissionResource: 'hostel_info',
      permissionAction: 'view_list',
    },
    // {
    //   id: 'region-currency',
    //   title: 'Region & Currency',
    //   description: 'Change your country, date formats, and currency settings.',
    //   icon: GlobeAltIcon,
    //   onClick: () => {
    //     setToast({
    //       open: true,
    //       type: 'info',
    //       message: 'Region & Currency settings coming soon!',
    //     });
    //   },
    // },
    // {
    //   id: 'default-accounts',
    //   title: 'Default Accounts',
    //   description: 'Change your default bank accounts and chart of accounts.',
    //   icon: CalculatorIcon,
    //   onClick: () => {
    //     setToast({
    //       open: true,
    //       type: 'info',
    //       message: 'Default Accounts settings coming soon!',
    //     });
    //   },
    // },
    // {
    //   id: 'users',
    //   title: 'Users',
    //   description: 'Add or edit users.',
    //   icon: UsersIcon,
    //   onClick: () => {
    //     setShowUsersList(true);
    //   },
    // },
    {
      id: 'user-roles',
      title: 'User Roles',
      description: 'Allow or block access to features of the system for each user.',
      icon: KeyIcon,
      onClick: () => {
        setShowUserRolesList(true);
      },
      permissionResource: 'user_roles',
      permissionAction: 'view_list',
    },
    {
      id: 'vendor-category',
      title: 'Vendor Category',
      description: 'Manage vendor categories for organizing vendor services.',
      icon: WrenchScrewdriverIcon,
      onClick: () => {
        setShowVendorCategories(true);
      },
      permissionResource: 'vendor_category',
      permissionAction: 'view_list',
    },
    {
      id: 'vendor-service',
      title: 'Vendor Service',
      description: 'Manage vendor services that can be assigned to vendors.',
      icon: WrenchScrewdriverIcon,
      onClick: () => {
        setShowVendorServices(true);
      },
      permissionResource: 'vendor_service',
      permissionAction: 'view_list',
    },
    {
      id: 'currency',
      title: 'Currency',
      description: 'Set and manage your preferred currency for all financial transactions.',
      icon: CurrencyDollarIcon,
      onClick: () => {
        setShowCurrencyManagement(true);
      },
      permissionResource: 'currency',
      permissionAction: 'view_list',
    },
    // {
    //   id: 'subscription',
    //   title: 'Subscription',
    //   description: 'Change or update your subscription plan.',
    //   icon: ClipboardDocumentCheckIcon,
    //   onClick: () => {
    //     setToast({
    //       open: true,
    //       type: 'info',
    //       message: 'Subscription management coming soon!',
    //     });
    //   },
    // },
    // {
    //   id: 'quickbooks-sync',
    //   title: 'Quickbooks Sync',
    //   description: 'Sync the system and Quickbooks.',
    //   icon: ArrowPathIcon,
    //   onClick: () => {
    //     setToast({
    //       open: true,
    //       type: 'info',
    //       message: 'Quickbooks Sync settings coming soon!',
    //     });
    //   },
    // },
    // {
    //   id: 'listing-syndication',
    //   title: 'Listing Syndication',
    //   description: 'List and market your vacancies',
    //   icon: DocumentTextIcon,
    //   onClick: () => {
    //     setToast({
    //       open: true,
    //       type: 'info',
    //       message: 'Listing Syndication settings coming soon!',
    //     });
    //   },
    // },
    // {
    //   id: 'send-payments',
    //   title: 'Send Payments',
    //   description: 'Set up and configure payment integration',
    //   icon: CurrencyDollarIcon,
    //   onClick: () => {
    //     setToast({
    //       open: true,
    //       type: 'info',
    //       message: 'Send Payments settings coming soon!',
    //     });
    //   },
    // },
  ];

  // Handle new user
  const handleNewUser = () => {
    setEditingUser(null);
    setIsNewUserOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    // Convert User to NewUserFormData
    const userFormData: NewUserFormData = {
      firstName: user.firstName,
      middleInitial: '',
      lastName: user.lastName,
      company: '',
      jobTitle: '',
      loginEmail: user.email,
      userRole: user.role,
      phones: [
        { id: '1', type: 'Mobile', number: user.phone },
      ],
      emails: [
        { id: '1', type: 'Primary', email: user.email },
      ],
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    };
    setEditingUser(user);
    setIsNewUserOpen(true);
  };

  // Handle user modal close
  const handleUserModalClose = () => {
    setIsNewUserOpen(false);
    setEditingUser(null);
  };

  // Convert editingUser to form data
  const getUserFormData = (): NewUserFormData | null => {
    if (!editingUser) return null;
    return {
      firstName: editingUser.firstName,
      middleInitial: '',
      lastName: editingUser.lastName,
      company: '',
      jobTitle: '',
      loginEmail: editingUser.email,
      userRole: editingUser.role,
      phones: [
        { id: '1', type: 'Mobile', number: editingUser.phone },
      ],
      emails: [
        { id: '1', type: 'Primary', email: editingUser.email },
      ],
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    };
  };

  // Handle new user role
  const handleNewUserRole = () => {
    setEditingRole(null);
    setIsNewUserRoleOpen(true);
  };

  // Handle edit user role
  const handleEditUserRole = (role: UserRole) => {
    setEditingRole(role);
    setIsNewUserRoleOpen(true);
  };

  // Handle user role modal close
  const handleUserRoleModalClose = () => {
    setIsNewUserRoleOpen(false);
    setEditingRole(null);
  };

  // Handle role created successfully - refresh the list
  const handleRoleCreated = () => {
    setRolesRefreshTrigger(prev => prev + 1);
  };

  // Handle view user role
  const handleViewUserRole = (role: UserRole) => {
    setViewingRole(role);
    setIsViewRoleOpen(true);
  };

  // Handle view role modal close
  const handleViewRoleModalClose = () => {
    setIsViewRoleOpen(false);
    setViewingRole(null);
  };

  // Handle PDF export
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      doc.setFontSize(18);
      doc.text('Settings Report', 105, yPos, { align: 'center' });
      yPos += 10;
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Personal Settings', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      personalSettings.forEach((setting, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${index + 1}. ${setting.title}`, 20, yPos);
        yPos += 6;
      });
      
      yPos += 5;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Company Settings', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      companySettings.forEach((setting, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${index + 1}. ${setting.title}`, 20, yPos);
        yPos += 6;
      });
      
      doc.save(`settings-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to export PDF. Please try again.',
      });
    }
  };

  // Handle delete user role
  const handleDeleteUserRole = async (role: UserRole) => {
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
      try {
        const { deleteRole } = await import('../../services/role.service');
        const roleId = Number(role.id);
        
        await deleteRole(roleId);
        
        setToast({
          open: true,
          type: 'success',
          message: `Role "${role.name}" has been deleted successfully.`,
        });
        
        // Refresh the roles list
        setRolesRefreshTrigger(prev => prev + 1);
      } catch (error: any) {
        console.error('Error deleting role:', error);
        setToast({
          open: true,
          type: 'error',
          message: error?.message || `Failed to delete role "${role.name}". Please try again.`,
        });
      }
    }
  };

  // Handle new hostel
  const handleNewHostel = () => {
    setEditingHostel(null);
    setIsAddHostelOpen(true);
  };

  // Handle edit hostel
  const handleEditHostel = (hostel: Hostel) => {
    setEditingHostel(hostel);
    setIsAddHostelOpen(true);
  };

  // Handle delete hostel
  const handleDeleteHostel = async (hostel: Hostel) => {
    if (window.confirm(`Are you sure you want to delete "${hostel.name}"? This will remove all its rooms and related data.`)) {
      try {
        const hostelId = Number(hostel.id);
        await api.delete(API_ROUTES.HOSTEL.DELETE(hostelId));
        
        setToast({
          open: true,
          type: 'success',
          message: `Hostel "${hostel.name}" has been deleted successfully.`,
        });
        
        // Refresh the hostels list
        setHostelsRefreshTrigger(prev => prev + 1);
      } catch (error: any) {
        console.error('Error deleting hostel:', error);
        setToast({
          open: true,
          type: 'error',
          message: error?.message || `Failed to delete hostel "${hostel.name}". Please try again.`,
        });
      }
    }
  };

  // Handle hostel form submission
  const handleHostelSubmit = async (data: any) => {
    try {
      setIsAddHostelOpen(false);
      
      if (editingHostel) {
        // Update existing hostel
        const hostelId = Number(editingHostel.id);
        const response = await api.put(API_ROUTES.HOSTEL.UPDATE(hostelId), data);
        
        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: response.message || `Hostel "${data.name}" updated successfully!`,
          });
        } else {
          throw new Error(response.message || 'Failed to update hostel');
        }
      } else {
        // Create new hostel
        const response = await api.post(API_ROUTES.HOSTEL.CREATE, data);
        
        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: response.message || `Hostel "${data.name}" created successfully!`,
          });
        } else {
          throw new Error(response.message || 'Failed to create hostel');
        }
      }
      
      // Refresh the hostels list
      setHostelsRefreshTrigger(prev => prev + 1);
      setEditingHostel(null);
    } catch (error: any) {
      console.error('Error saving hostel:', error);
      setToast({
        open: true,
        type: 'error',
        message: error?.message || `Failed to save hostel. Please try again.`,
      });
    }
  };

  // Handle hostel modal close
  const handleHostelModalClose = () => {
    setIsAddHostelOpen(false);
    setEditingHostel(null);
  };

  // Convert editingRole to form data
  const getRoleFormData = (): UserRoleFormData | null => {
    if (!editingRole) return null;
    // In a real app, you would fetch the full role data from API
    // For now, try to get from localStorage or return default structure
    try {
      const savedData = localStorage.getItem('userRoleData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.roleName === editingRole.name) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading role data from localStorage:', error);
    }
    
    // Return default structure
    return {
      roleName: editingRole.name,
      roleDescription: editingRole.description,
      permissions: {
        people: {
          prospects: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
          owners: { viewList: true, viewOne: true, create: false, edit: false, delete: false },
          vendors: { viewList: true, viewOne: true, create: false, edit: false, delete: false },
          tenants: { viewList: true, viewOne: true, create: false, edit: false, delete: false },
          users: { viewList: true, viewOne: false, create: false, edit: false, delete: false },
          userRoles: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
          apiKeys: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
        },
        tasksAndMaintenance: {
          tasks: {
            viewList: 'none',
            viewOne: 'none',
            create: false,
            edit: false,
            delete: false,
          },
          workOrders: {
            viewList: 'none',
            viewOne: 'none',
            create: false,
            edit: false,
            delete: false,
          },
          tenantRequests: {
            viewList: 'none',
            viewOne: 'none',
            create: false,
            edit: false,
            delete: false,
          },
          ownerRequests: {
            viewList: 'none',
            viewOne: 'none',
            create: false,
            edit: false,
            delete: false,
          },
        },
      },
    };
  };

  // Get role form data for viewing
  const getViewRoleFormData = (): UserRoleFormData | null => {
    if (!viewingRole) return null;
    // Try to get from localStorage
    try {
      const savedData = localStorage.getItem('userRoleData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.roleName === viewingRole.name) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading role data from localStorage:', error);
    }
    
    // Return default structure if not found
    return {
      roleName: viewingRole.name,
      roleDescription: viewingRole.description,
      permissions: {
        people: {
          prospects: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
          owners: { viewList: true, viewOne: true, create: false, edit: false, delete: false },
          vendors: { viewList: true, viewOne: true, create: false, edit: false, delete: false },
          tenants: { viewList: true, viewOne: true, create: false, edit: false, delete: false },
          users: { viewList: true, viewOne: false, create: false, edit: false, delete: false },
          userRoles: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
          apiKeys: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
        },
        tasksAndMaintenance: {
          tasks: {
            viewList: 'none',
            viewOne: 'none',
            create: false,
            edit: false,
            delete: false,
          },
          workOrders: {
            viewList: 'none',
            viewOne: 'none',
            create: false,
            edit: false,
            delete: false,
          },
          tenantRequests: {
            viewList: 'none',
            viewOne: 'none',
            create: false,
            edit: false,
            delete: false,
          },
          ownerRequests: {
            viewList: 'none',
            viewOne: 'none',
            create: false,
            edit: false,
            delete: false,
          },
        },
      },
    };
  };

  // If showing users list, render that instead
  if (showUsersList) {
    return (
      <>
        <UsersList
          onBack={() => setShowUsersList(false)}
          onNewUser={handleNewUser}
          onEditUser={handleEditUser}
        />
        {/* New User Modal */}
        <NewUserModal
          isOpen={isNewUserOpen}
          onClose={handleUserModalClose}
          userData={getUserFormData()}
          isEdit={!!editingUser}
        />
      </>
    );
  }

  // If showing user roles list, render that instead
  if (showUserRolesList) {
    return (
      <>
        <UserRolesList
          onBack={() => setShowUserRolesList(false)}
          onNewRole={handleNewUserRole}
          onEditRole={handleEditUserRole}
          onViewRole={handleViewUserRole}
          onDeleteRole={handleDeleteUserRole}
          refreshTrigger={rolesRefreshTrigger}
        />
        {/* New User Role Modal */}
        <NewUserRoleModal
          isOpen={isNewUserRoleOpen}
          onClose={handleUserRoleModalClose}
          roleData={getRoleFormData()}
          isEdit={!!editingRole}
          roleId={editingRole ? Number(editingRole.id) : null}
          onSuccess={handleRoleCreated}
        />
        {/* View Role Modal */}
        {viewingRole && (
          <ViewRoleModal
            isOpen={isViewRoleOpen}
            onClose={handleViewRoleModalClose}
            roleId={Number(viewingRole.id)}
            roleData={getViewRoleFormData()}
            roleName={viewingRole.name}
            roleDescription={viewingRole.description}
          />
        )}
      </>
    );
  }

  // If showing hostels list, render that instead
  if (showHostelsList) {
    return (
      <>
        <HostelsList
          onBack={() => setShowHostelsList(false)}
          onNewHostel={handleNewHostel}
          onEditHostel={handleEditHostel}
          onDeleteHostel={handleDeleteHostel}
          refreshTrigger={hostelsRefreshTrigger}
        />
        {/* Add/Edit Hostel Modal */}
        <AddHostelForm
          isOpen={isAddHostelOpen}
          onClose={handleHostelModalClose}
          onSubmit={handleHostelSubmit}
          editingHostel={editingHostel}
        />
      </>
    );
  }

  // If showing vendor categories, render that instead
  if (showVendorCategories) {
    return (
      <VendorCategoryList
        onBack={() => setShowVendorCategories(false)}
      />
    );
  }

  // If showing vendor services, render that instead
  if (showVendorServices) {
    return (
      <VendorServiceList
        onBack={() => setShowVendorServices(false)}
      />
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">General Settings</h1>
        </div>
        <Button
          variant="outline"
          onClick={handleExportPDF}
          icon={ArrowDownTrayIcon}
        >
          Export PDF
        </Button>
      </div>

      {/* Personal Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Personal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {personalSettings.filter(card => canSeeCard(card)).map((setting, index) => (
            <motion.div
              key={setting.id}
              id={`setting-card-${setting.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={setting.onClick}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                  <setting.icon className="w-6 h-6 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {setting.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {setting.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Company Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Company</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companySettings.filter(card => canSeeCard(card)).map((setting, index) => (
            <motion.div
              key={setting.id}
              id={`setting-card-${setting.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 2) * 0.05 }}
              onClick={setting.onClick}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-slate-100 rounded-lg w-fit group-hover:bg-slate-200 transition-colors">
                  <setting.icon className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {setting.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {setting.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Personal Information Modal */}
      <PersonalInfoModal
        isOpen={isPersonalInfoOpen}
        onClose={() => setIsPersonalInfoOpen(false)}
      />

      {/* Change Password Modal */}
      <LoginPasswordModal
        isOpen={isLoginPasswordOpen}
        onClose={() => setIsLoginPasswordOpen(false)}
      />

      {/* Hostel Info Modal */}
      <HostelInfoModal
        isOpen={isHostelInfoOpen}
        onClose={() => setIsHostelInfoOpen(false)}
      />

      {/* Currency Management Modal */}
      {showCurrencyManagement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCurrencyManagement(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">Currency Management</h2>
              <button
                onClick={() => setShowCurrencyManagement(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <div className="p-6">
              <CurrencyManagementCard
                onCurrencyChange={() => {
                  // Currency updated, you can refresh other data here if needed
                }}
              />
            </div>
          </motion.div>
        </div>
      )}

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
