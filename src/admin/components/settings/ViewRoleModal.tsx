import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  KeyIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { UserRoleFormData } from '../../types/settings';
import { getRoleById, getRolePermissions, type Permission } from '../../services/role.service';

interface ViewRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: number | null;
  roleData?: UserRoleFormData | null;
  roleName?: string;
  roleDescription?: string;
}

/**
 * Helper function to map permissions array to form structure
 */
const mapPermissionsToForm = (permissions: Permission[]): UserRoleFormData['permissions'] => {
  // Initialize sidebar tabs
  const sidebarTabs: { [key: string]: { viewList: boolean; viewOne: boolean; create: boolean; edit: boolean; delete: boolean } } = {
    overview: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    people: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    vendorManagement: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    accounts: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    hostelManagement: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    alerts: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    communication: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    fpa: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    settings: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    tenants: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    employees: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    prospects: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    vendorList: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    accountsAll: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    accountsPayable: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    accountsReceivable: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    bills: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    accountsVendor: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    laundry: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    received: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    commTenants: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    commEmployees: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    commVendors: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    fpaMonthly: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    fpaYearly: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    alertsBills: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    alertsMaintenance: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    alertsBin: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    personalInformation: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    changePassword: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    hostelInfo: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    userRoles: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    vendorCategory: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    vendorService: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    currency: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  };

  const formPermissions: UserRoleFormData['permissions'] = {
    people: {
      prospects: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
      owners: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
      vendors: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
      tenants: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
      users: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
      userRoles: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
      apiKeys: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
    },
    tasksAndMaintenance: {
      tasks: { viewList: 'none', viewOne: 'none', create: false, edit: false, delete: false },
      workOrders: { viewList: 'none', viewOne: 'none', create: false, edit: false, delete: false },
      tenantRequests: { viewList: 'none', viewOne: 'none', create: false, edit: false, delete: false },
      ownerRequests: { viewList: 'none', viewOne: 'none', create: false, edit: false, delete: false },
    },
    sidebarTabs,
  };

  // Map backend resource names to frontend tab keys
  const resourceToTabMap: { [key: string]: string } = {
    overview: 'overview',
    people: 'people',
    vendor_management: 'vendorManagement',
    accounts: 'accounts',
    hostel_management: 'hostelManagement',
    alerts: 'alerts',
    communication: 'communication',
    fpa: 'fpa',
    settings: 'settings',
    tenants: 'tenants',
    employees: 'employees',
    prospects: 'prospects',
    vendor_list: 'vendorList',
    accounts_all: 'accountsAll',
    accounts_payable: 'accountsPayable',
    accounts_receivable: 'accountsReceivable',
    bills: 'bills',
    accounts_vendor: 'accountsVendor',
    laundry: 'laundry',
    received: 'received',
    comm_tenants: 'commTenants',
    comm_employees: 'commEmployees',
    comm_vendors: 'commVendors',
    fpa_monthly: 'fpaMonthly',
    fpa_yearly: 'fpaYearly',
    alerts_bills: 'alertsBills',
    alerts_maintenance: 'alertsMaintenance',
    alerts_bin: 'alertsBin',
    personal_information: 'personalInformation',
    change_password: 'changePassword',
    hostel_info: 'hostelInfo',
    user_roles: 'userRoles',
    vendor_category: 'vendorCategory',
    vendor_service: 'vendorService',
    currency: 'currency',
  };

  permissions.forEach((perm) => {
    const { resource, action } = perm;
    
    // Check if it's a people entity
    if (formPermissions.people[resource as keyof typeof formPermissions.people]) {
      const entityPerms = formPermissions.people[resource as keyof typeof formPermissions.people];
      
      // Map action to form field
      if (action === 'view_list') {
        entityPerms.viewList = true;
      } else if (action === 'view_one') {
        entityPerms.viewOne = true;
      } else if (action === 'create') {
        entityPerms.create = true;
      } else if (action === 'edit') {
        entityPerms.edit = true;
      } else if (action === 'delete') {
        entityPerms.delete = true;
      }
    }
    // Check if it's a sidebar tab
    else if (formPermissions.sidebarTabs && resourceToTabMap[resource]) {
      const tabKey = resourceToTabMap[resource];
      if (formPermissions.sidebarTabs[tabKey]) {
        const tabPerms = formPermissions.sidebarTabs[tabKey];
        
        if (action === 'view_list') {
          tabPerms.viewList = true;
        } else if (action === 'view_one') {
          tabPerms.viewOne = true;
        } else if (action === 'create') {
          tabPerms.create = true;
        } else if (action === 'edit') {
          tabPerms.edit = true;
        } else if (action === 'delete') {
          tabPerms.delete = true;
        }
      }
    }
  });

  return formPermissions;
};

export const ViewRoleModal: React.FC<ViewRoleModalProps> = ({
  isOpen,
  onClose,
  roleId,
  roleData: propRoleData,
  roleName: propRoleName,
  roleDescription: propRoleDescription,
}) => {
  const [roleData, setRoleData] = useState<UserRoleFormData | null>(propRoleData || null);
  const [roleName, setRoleName] = useState<string>(propRoleName || '');
  const [roleDescription, setRoleDescription] = useState<string>(propRoleDescription || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peopleEntities = [
    { key: 'prospects', label: 'Prospects' },
    { key: 'owners', label: 'Owners' },
    { key: 'vendors', label: 'Vendors' },
    { key: 'tenants', label: 'Tenants' },
    { key: 'users', label: 'Users' },
    { key: 'userRoles', label: 'User Roles' },
    { key: 'apiKeys', label: 'API Keys' },
  ];

  const getPermissionIcon = (hasPermission: boolean) => {
    return hasPermission ? (
      <CheckIcon className="w-5 h-5 text-green-600" />
    ) : (
      <XMarkIcon className="w-5 h-5 text-gray-400" />
    );
  };

  // Fetch role data and permissions when modal opens
  useEffect(() => {
    if (isOpen && roleId) {
      const fetchRoleData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch role details
          const roleDetails = await getRoleById(roleId);
          setRoleName(roleDetails.roleName);
          setRoleDescription(roleDetails.description || '');

          // Fetch permissions
          const permissions = await getRolePermissions(roleId);
          
          // Map permissions to form structure
          const mappedPermissions = mapPermissionsToForm(permissions);
          
          setRoleData({
            roleName: roleDetails.roleName,
            roleDescription: roleDetails.description || '',
            permissions: mappedPermissions,
          });
        } catch (err: any) {
          console.error('Error fetching role data:', err);
          setError(err?.message || 'Failed to load role data');
        } finally {
          setLoading(false);
        }
      };

      fetchRoleData();
    } else if (isOpen && propRoleData) {
      // Use provided data if available
      setRoleData(propRoleData);
      setRoleName(propRoleName || '');
      setRoleDescription(propRoleDescription || '');
    }
  }, [isOpen, roleId, propRoleData, propRoleName, propRoleDescription]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset state when modal closes
      setRoleData(null);
      setRoleName('');
      setRoleDescription('');
      setError(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <KeyIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{roleName}</h2>
                    <p className="text-sm text-slate-600 mt-1">{roleDescription}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading role data...</p>
                  </div>
                )}

                {error && !loading && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {!loading && !error && roleData && (
                  <div className="space-y-6">
                    {/* General Info Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded"></span>
                        General Information
                      </h3>
                      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Role Name
                          </label>
                          <p className="text-base font-medium text-slate-900 mt-1">{roleData.roleName}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Description
                          </label>
                          <p className="text-sm text-slate-700 mt-1">{roleData.roleDescription || 'No description provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded"></span>
                        Permissions
                      </h3>

                      {/* People Section */}
                      <div className="mb-6">
                        <h4 className="text-base font-semibold text-slate-800 mb-3">People</h4>
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Entity
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    View List
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    View One
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Create
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Edit
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Delete
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {peopleEntities.map((entity) => {
                                  const permissions = roleData.permissions.people[entity.key];
                                  if (!permissions) return null;
                                  return (
                                    <tr key={entity.key} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                        {entity.label}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        {getPermissionIcon(permissions.viewList)}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        {getPermissionIcon(permissions.viewOne)}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        {getPermissionIcon(permissions.create)}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        {getPermissionIcon(permissions.edit)}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        {getPermissionIcon(permissions.delete)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Tasks & Maintenance Section */}
                      {roleData.permissions.tasksAndMaintenance && (
                        <div>
                          <h4 className="text-base font-semibold text-slate-800 mb-3">Tasks & Maintenance</h4>
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      Entity
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      View List
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      View One
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      Create
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      Edit
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      Delete
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {Object.entries(roleData.permissions.tasksAndMaintenance).map(([key, permissions]: [string, any]) => {
                                    const entityLabel = key
                                      .replace(/([A-Z])/g, ' $1')
                                      .replace(/^./, (str) => str.toUpperCase())
                                      .trim();
                                    return (
                                      <tr key={key} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                          {entityLabel}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {permissions.viewList || 'none'}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {permissions.viewOne || 'none'}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {getPermissionIcon(permissions.create)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {getPermissionIcon(permissions.edit)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {getPermissionIcon(permissions.delete)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sidebar Tabs Section */}
                      {roleData.permissions.sidebarTabs && (
                        <div className="mt-6">
                          <h4 className="text-base font-semibold text-slate-800 mb-3">Sidebar Tabs</h4>
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      Tab Name
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      View List
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      View One
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      Create
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      Edit
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                      Delete
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {Object.entries(roleData.permissions.sidebarTabs).map(([key, permissions]: [string, any]) => {
                                    const tabLabels: { [key: string]: string } = {
                                      overview: 'Overview',
                                      people: 'People',
                                      vendorManagement: 'Vendor Management',
                                      accounts: 'Accounts',
                                      hostelManagement: 'Hostel Management',
                                      alerts: 'Alerts',
                                      communication: 'Communication',
                                      fpa: 'FP&A',
                                      settings: 'Settings',
                                      tenants: 'Tenants (People)',
                                      employees: 'Employees',
                                      prospects: 'Prospects (People)',
                                      vendorList: 'Vendor List',
                                      accountsAll: 'Accounts - All',
                                      accountsPayable: 'Accounts - Payable',
                                      accountsReceivable: 'Accounts - Receivable',
                                      bills: 'Bills',
                                      accountsVendor: 'Accounts - Vendor',
                                      laundry: 'Laundry',
                                      received: 'Received',
                                      commTenants: 'Communication - Tenants',
                                      commEmployees: 'Communication - Employees',
                                      commVendors: 'Communication - Vendors',
                                      fpaMonthly: 'FP&A - Monthly',
                                      fpaYearly: 'FP&A - Yearly',
                                      alertsBills: 'Alerts - Bills',
                                      alertsMaintenance: 'Alerts - Maintenance',
                                      alertsBin: 'Alerts - Alert Bin',
                                      personalInformation: 'Personal Information',
                                      changePassword: 'Change Password',
                                      hostelInfo: 'Hostel Info',
                                      userRoles: 'User Roles',
                                      vendorCategory: 'Vendor Category',
                                      vendorService: 'Vendor Service',
                                      currency: 'Currency',
                                    };
                                    return (
                                      <tr key={key} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                          {tabLabels[key] || key}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {getPermissionIcon(permissions.viewList)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {getPermissionIcon(permissions.viewOne)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {getPermissionIcon(permissions.create)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {getPermissionIcon(permissions.edit)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {getPermissionIcon(permissions.delete)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!roleData && (
                  <div className="text-center py-12 text-slate-500">
                    <p>No permission data available for this role.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

