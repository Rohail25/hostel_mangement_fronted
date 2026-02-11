import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  KeyIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import type { NewUserRoleModalProps, UserRoleFormData } from '../../types/settings';
import { createRole, updateRole, updateRolePermissions, getRoleById, getRolePermissions, type Permission } from '../../services/role.service';
import * as hostelService from '../../services/hostel.service';
import { api } from '../../../services/apiClient';

/**
 * Helper function to extract permission IDs from form data
 * This maps the form permission structure to permission IDs
 * Note: This is a placeholder mapping - you may need to adjust based on your permission system
 */
// Fetch permissions from API and build mapping dynamically
const fetchPermissionMapping = async (): Promise<{ [key: string]: number }> => {
  try {
    const response = await api.get('/admin/permissions?limit=1000');
    
    if (response && response.success && response.data) {
      const permissions = response.data.permissions || response.data;
      const mapping: { [key: string]: number } = {};
      
      permissions.forEach((perm: any) => {
        const key = `${perm.resource}_${perm.action}`;
        mapping[key] = perm.id;
      });
      
      return mapping;
    }
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }
  
  // Fallback: Return empty mapping if API call fails
  return {};
};

const extractPermissionIds = async (formData: UserRoleFormData): Promise<number[]> => {
  const permissionIds: number[] = [];
  
  // Fetch permission mapping from API
  const permissionMapping = await fetchPermissionMapping();
  
  // Extract people permissions
  Object.entries(formData.permissions.people).forEach(([entity, perms]) => {
    if (perms.viewList) {
      const key = `${entity}_view_list`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.viewOne) {
      const key = `${entity}_view_one`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.create) {
      const key = `${entity}_create`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.edit) {
      const key = `${entity}_edit`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.delete) {
      const key = `${entity}_delete`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
  });
  
  // Extract sidebar tabs permissions
  Object.entries(formData.permissions.sidebarTabs || {}).forEach(([entity, perms]) => {
    if (perms.viewList) {
      const key = `${entity}_view_list`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.viewOne) {
      const key = `${entity}_view_one`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.create) {
      const key = `${entity}_create`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.edit) {
      const key = `${entity}_edit`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.delete) {
      const key = `${entity}_delete`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
  });

  // Extract tasks and maintenance permissions
  Object.entries(formData.permissions.tasksAndMaintenance).forEach(([entity, perms]) => {
    // Handle viewList/viewOne which can be 'none' | 'view' | 'edit'
    if (perms.viewList && perms.viewList !== 'none') {
      // For tasks, we use the level as part of the key
      const key = `${entity}_view_list_${perms.viewList}`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      } else {
        // Fallback: try without level suffix
        const fallbackKey = `${entity}_view_list`;
        if (permissionMapping[fallbackKey]) {
          permissionIds.push(permissionMapping[fallbackKey]);
        }
      }
    }
    if (perms.viewOne && perms.viewOne !== 'none') {
      const key = `${entity}_view_one_${perms.viewOne}`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      } else {
        // Fallback: try without level suffix
        const fallbackKey = `${entity}_view_one`;
        if (permissionMapping[fallbackKey]) {
          permissionIds.push(permissionMapping[fallbackKey]);
        }
      }
    }
    if (perms.create) {
      const key = `${entity}_create`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.edit) {
      const key = `${entity}_edit`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
    if (perms.delete) {
      const key = `${entity}_delete`;
      if (permissionMapping[key]) {
        permissionIds.push(permissionMapping[key]);
      }
    }
  });

  // Extract sidebar tabs permissions
  // Map frontend tab keys to backend resource names
  const tabResourceMap: { [key: string]: string } = {
    overview: 'overview',
    people: 'people',
    vendorManagement: 'vendor_management',
    accounts: 'accounts',
    hostelManagement: 'hostel_management',
    alerts: 'alerts',
    communication: 'communication',
    fpa: 'fpa',
    settings: 'settings',
    tenants: 'tenants',
    employees: 'employees',
    prospects: 'prospects',
    vendorList: 'vendor_list',
    accountsAll: 'accounts_all',
    accountsPayable: 'accounts_payable',
    accountsReceivable: 'accounts_receivable',
    bills: 'bills',
    accountsVendor: 'accounts_vendor',
    laundry: 'laundry',
    received: 'received',
    commTenants: 'comm_tenants',
    commEmployees: 'comm_employees',
    commVendors: 'comm_vendors',
    fpaMonthly: 'fpa_monthly',
    fpaYearly: 'fpa_yearly',
    alertsBills: 'alerts_bills',
    alertsMaintenance: 'alerts_maintenance',
    alertsBin: 'alerts_bin',
    personalInformation: 'personal_information',
    changePassword: 'change_password',
    hostelInfo: 'hostel_info',
    userRoles: 'user_roles',
    vendorCategory: 'vendor_category',
    vendorService: 'vendor_service',
    currency: 'currency',
  };

  if (formData.permissions.sidebarTabs) {
    Object.entries(formData.permissions.sidebarTabs).forEach(([entity, perms]) => {
      // Skip Personal Information and Change Password - they're always accessible
      if (entity === 'personalInformation' || entity === 'changePassword') {
        return;
      }

      const resource = tabResourceMap[entity] || entity;
      
      if (perms.viewList) {
        const key = `${resource}_view_list`;
        if (permissionMapping[key]) {
          permissionIds.push(permissionMapping[key]);
        }
      }
      if (perms.viewOne) {
        const key = `${resource}_view_one`;
        if (permissionMapping[key]) {
          permissionIds.push(permissionMapping[key]);
        }
      }
      if (perms.create) {
        const key = `${resource}_create`;
        if (permissionMapping[key]) {
          permissionIds.push(permissionMapping[key]);
        }
      }
      if (perms.edit) {
        const key = `${resource}_edit`;
        if (permissionMapping[key]) {
          permissionIds.push(permissionMapping[key]);
        }
      }
      if (perms.delete) {
        const key = `${resource}_delete`;
        if (permissionMapping[key]) {
          permissionIds.push(permissionMapping[key]);
        }
      }
    });
  }
  
  return permissionIds;
};

/**
 * Initialize sidebar tabs with default values
 */
const initializeSidebarTabs = () => ({
  // Main Sidebar Tabs
  overview: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  people: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  vendorManagement: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  accounts: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  hostelManagement: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  alerts: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  communication: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  fpa: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  settings: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  // Second Sidebar - People
  tenants: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  employees: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  prospects: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  // Second Sidebar - Vendor
  vendorList: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  // Second Sidebar - Accounts
  accountsAll: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  accountsPayable: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  accountsReceivable: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  bills: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  accountsVendor: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  laundry: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  received: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  // Second Sidebar - Communication
  commTenants: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  commEmployees: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  commVendors: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  // Second Sidebar - FP&A
  fpaMonthly: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  fpaYearly: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  // Second Sidebar - Alerts
  alertsBills: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  alertsMaintenance: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  alertsBin: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  // Second Sidebar - Settings
  personalInformation: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  changePassword: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  hostelInfo: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  userRoles: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  vendorCategory: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  vendorService: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
  currency: { viewList: false, viewOne: false, create: false, edit: false, delete: false },
});

/**
 * Helper function to map permissions array to form structure (same as ViewRoleModal)
 */
const mapPermissionsToForm = (permissions: Permission[]): UserRoleFormData['permissions'] => {
  // Initialize all sidebar tabs
  const sidebarTabs = initializeSidebarTabs();

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

export const NewUserRoleModal: React.FC<NewUserRoleModalProps> = ({
  isOpen,
  onClose,
  roleData: propRoleData,
  isEdit = false,
  roleId,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'objects' | 'authority'>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hostels, setHostels] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState<UserRoleFormData>({
    roleName: '',
    roleDescription: '',
    hostelId: null,
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
          viewList: 'view',
          viewOne: 'view',
          create: true,
          edit: true,
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
      sidebarTabs: initializeSidebarTabs(),
    },
  });

  // Fetch role data when editing
  useEffect(() => {
    if (isOpen && isEdit && roleId) {
      const fetchRoleData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch role details
          const roleDetails = await getRoleById(roleId);
          
          // Fetch permissions
          const permissions = await getRolePermissions(roleId);
          
          // Map permissions to form structure
          const mappedPermissions = mapPermissionsToForm(permissions);
          
          setFormData({
            roleName: roleDetails.roleName,
            roleDescription: roleDetails.description || '',
            hostelId: roleDetails.hostelId || null,
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
    } else if (isOpen) {
      setError(null);
      setSuccess(null);
      setLoading(false);
      if (propRoleData && isEdit) {
        setFormData(propRoleData);
      } else {
        setFormData({
          roleName: '',
          roleDescription: '',
          hostelId: null,
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
            sidebarTabs: initializeSidebarTabs(),
          },
        });
        setActiveTab('general');
      }
    }
  }, [isOpen, propRoleData, isEdit, roleId]);

  // Ensure sidebarTabs is always initialized when modal opens
  useEffect(() => {
    if (isOpen && (!formData.permissions.sidebarTabs || Object.keys(formData.permissions.sidebarTabs).length === 0)) {
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          sidebarTabs: initializeSidebarTabs(),
        },
      }));
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const errors: string[] = [];

    if (!formData.roleName.trim()) {
      errors.push('Role Name is required');
    }

    if (errors.length > 0) {
      setError('Please fill in all required fields:\n' + errors.join('\n'));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let currentRoleId: number;

      if (isEdit && roleId) {
        // Step 1: Update the role
        console.log('🔐 [EDIT ROLE] Updating role...');
        await updateRole(roleId, {
          rolename: formData.roleName,
          description: formData.roleDescription || '',
          hostelId: formData.hostelId,
        });

        console.log('✅ [EDIT ROLE] Role updated with ID:', roleId);
        currentRoleId = roleId;
      } else {
        // Step 1: Create the role
        console.log('🔐 [NEW ROLE] Creating role...');
        const roleData = await createRole({
          rolename: formData.roleName,
          description: formData.roleDescription || '',
          hostelId: formData.hostelId,
        });

        console.log('✅ [NEW ROLE] Role created with ID:', roleData.id);
        currentRoleId = roleData.id;
      }

      // Step 2: Extract permission IDs from form data
      const permissionIds = await extractPermissionIds(formData);
      
      console.log('📋 [ROLE] Extracted permission IDs:', permissionIds);

      // Step 3: Update role permissions if there are any selected
      if (permissionIds.length > 0) {
        console.log('🔐 [ROLE] Updating permissions...');
        await updateRolePermissions(currentRoleId, {
          permissions: permissionIds,
        });
      } else {
        console.log('⚠️ [ROLE] No permissions selected, skipping permission update');
      }

      setSuccess(isEdit ? 'User role updated successfully!' : 'User role created successfully!');
      
      // Trigger refresh callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        // Reset form
        setFormData({
          roleName: '',
          roleDescription: '',
          hostelId: null,
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
              tasks: { viewList: 'none', viewOne: 'none', create: false, edit: false, delete: false },
              workOrders: { viewList: 'none', viewOne: 'none', create: false, edit: false, delete: false },
              tenantRequests: { viewList: 'none', viewOne: 'none', create: false, edit: false, delete: false },
              ownerRequests: { viewList: 'none', viewOne: 'none', create: false, edit: false, delete: false },
            },
          },
        });
        setError(null);
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('❌ [NEW ROLE] Error:', err);
      setError(err?.message || 'Failed to create user role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserRoleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePeoplePermissionChange = (
    entity: string,
    permission: 'viewList' | 'viewOne' | 'create' | 'edit' | 'delete',
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        people: {
          ...prev.permissions.people,
          [entity]: {
            ...prev.permissions.people[entity],
            [permission]: value,
          },
        },
      },
    }));
  };

  const handleTasksPermissionChange = (
    entity: string,
    permission: 'viewList' | 'viewOne' | 'create' | 'edit' | 'delete',
    value: boolean | 'none' | 'view' | 'edit'
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        tasksAndMaintenance: {
          ...prev.permissions.tasksAndMaintenance,
          [entity]: {
            ...prev.permissions.tasksAndMaintenance[entity],
            [permission]: value,
          },
        },
      },
    }));
  };

  const handleSidebarTabPermissionChange = (
    tab: string,
    permission: 'viewList' | 'viewOne' | 'create' | 'edit' | 'delete',
    value: boolean
  ) => {
    setFormData((prev) => {
      // Ensure sidebarTabs is initialized
      const sidebarTabs = prev.permissions.sidebarTabs || initializeSidebarTabs();
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          sidebarTabs: {
            ...sidebarTabs,
            [tab]: {
              ...(sidebarTabs[tab] || {
                viewList: false,
                viewOne: false,
                create: false,
                edit: false,
                delete: false,
              }),
              [permission]: value,
            },
          },
        },
      };
    });
  };

  const sidebarItems = [
    { id: 'general' as const, label: 'General Info', icon: InformationCircleIcon },
    { id: 'authority' as const, label: 'Authority Hostel', icon: BuildingOfficeIcon },
    { id: 'objects' as const, label: 'Objects', icon: GlobeAltIcon },
  ];

  // Fetch hostels when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchHostels = async () => {
        try {
          const hostelsData = await hostelService.getAllHostelsFromAPI();
          setHostels(hostelsData.map((h: any) => ({ id: h.id, name: h.name || 'Unnamed Hostel' })));
        } catch (err) {
          console.error('Error fetching hostels:', err);
          setHostels([]);
        }
      };
      fetchHostels();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const peopleEntities = [
    { key: 'prospects', label: 'Prospects' },
    { key: 'owners', label: 'Owners' },
    { key: 'vendors', label: 'Vendors' },
    { key: 'tenants', label: 'Tenants' },
    { key: 'users', label: 'Users' },
    { key: 'userRoles', label: 'User Roles' },
    { key: 'apiKeys', label: 'API Keys' },
  ];

  const tasksEntities = [
    { key: 'tasks', label: 'Tasks' },
    { key: 'workOrders', label: 'Work Orders' },
    { key: 'tenantRequests', label: 'Tenant Requests' },
    { key: 'ownerRequests', label: 'Owner Requests' },
  ];

  // Sidebar tabs from both main sidebar and second sidebar
  const sidebarTabEntities = [
    // Main Sidebar Tabs
    { key: 'overview', label: 'Overview' },
    { key: 'people', label: 'People' },
    { key: 'vendorManagement', label: 'Vendor Management' },
    { key: 'accounts', label: 'Accounts' },
    { key: 'hostelManagement', label: 'Hostel Management' },
    { key: 'alerts', label: 'Alerts' },
    { key: 'communication', label: 'Communication' },
    { key: 'fpa', label: 'FP&A' },
    { key: 'settings', label: 'Settings' },
    // Second Sidebar - People
    { key: 'tenants', label: 'Tenants (People)' },
    { key: 'employees', label: 'Employees' },
    { key: 'prospects', label: 'Prospects (People)' },
    // Second Sidebar - Vendor
    { key: 'vendorList', label: 'Vendor List' },
    // Second Sidebar - Accounts
    { key: 'accountsAll', label: 'Accounts - All' },
    { key: 'accountsPayable', label: 'Accounts - Payable' },
    { key: 'accountsReceivable', label: 'Accounts - Receivable' },
    { key: 'bills', label: 'Bills' },
    { key: 'accountsVendor', label: 'Accounts - Vendor' },
    { key: 'laundry', label: 'Laundry' },
    { key: 'received', label: 'Received' },
    // Second Sidebar - Communication
    { key: 'commTenants', label: 'Communication - Tenants' },
    { key: 'commEmployees', label: 'Communication - Employees' },
    { key: 'commVendors', label: 'Communication - Vendors' },
    // Second Sidebar - FP&A
    { key: 'fpaMonthly', label: 'FP&A - Monthly' },
    { key: 'fpaYearly', label: 'FP&A - Yearly' },
    // Second Sidebar - Alerts
    { key: 'alertsBills', label: 'Alerts - Bills' },
    { key: 'alertsMaintenance', label: 'Alerts - Maintenance' },
    { key: 'alertsBin', label: 'Alerts - Alert Bin' },
    // Second Sidebar - Settings
    { key: 'personalInformation', label: 'Personal Information' },
    { key: 'changePassword', label: 'Change Password' },
    { key: 'hostelInfo', label: 'Hostel Info' },
    { key: 'userRoles', label: 'User Roles' },
    { key: 'vendorCategory', label: 'Vendor Category' },
    { key: 'vendorService', label: 'Vendor Service' },
    { key: 'currency', label: 'Currency' },
  ];

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-64 bg-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <KeyIcon className="w-6 h-6 text-white" />
                    <h2 className="text-lg font-semibold text-white">User Role</h2>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeTab === 'general' && 'GENERAL INFO'}
                      {activeTab === 'authority' && 'AUTHORITY HOSTEL'}
                      {activeTab === 'objects' && 'OBJECTS'}
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

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                  {/* Error Message */}
                  {error && (
                    <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <p className="text-sm whitespace-pre-line">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                      <p className="text-sm">{success}</p>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'general' && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            What would you like to call this Role? (For example, "Accountant Role")
                          </label>
                          <label className="block text-xs text-slate-500 mb-1">Role Name</label>
                          <input
                            type="text"
                            value={formData.roleName}
                            onChange={(e) => handleInputChange('roleName', e.target.value)}
                            placeholder="Accountants"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            How would you describe this Role? (For example, gives read access only to financial data)
                          </label>
                          <label className="block text-xs text-slate-500 mb-1">Role Description</label>
                          <textarea
                            value={formData.roleDescription}
                            onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                            placeholder="Responsible for the management and reporting of financial data of your organization."
                            rows={4}
                            maxLength={1000}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                          <div className="mt-1 text-xs text-slate-500 text-right">
                            {formData.roleDescription.length}/1000 characters
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'objects' && (
                      <div className="space-y-6">
                        <p className="text-sm text-slate-600">
                          You can set custom access levels for each page in DoorLoop. This will allow or block a user from viewing that page or taking any actions.
                        </p>

                        {/* People Section */}
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">People</h4>
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                                    Entity
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    View List
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    View One
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    Create
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    Edit
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    Delete
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {peopleEntities.map((entity) => {
                                  const permissions = formData.permissions.people[entity.key];
                                  return (
                                    <tr key={entity.key} className="hover:bg-slate-50">
                                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                        {entity.label}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={permissions.viewList}
                                          onChange={(e) =>
                                            handlePeoplePermissionChange(entity.key, 'viewList', e.target.checked)
                                          }
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={permissions.viewOne}
                                          onChange={(e) =>
                                            handlePeoplePermissionChange(entity.key, 'viewOne', e.target.checked)
                                          }
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={permissions.create}
                                          onChange={(e) =>
                                            handlePeoplePermissionChange(entity.key, 'create', e.target.checked)
                                          }
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={permissions.edit}
                                          onChange={(e) =>
                                            handlePeoplePermissionChange(entity.key, 'edit', e.target.checked)
                                          }
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={permissions.delete}
                                          onChange={(e) =>
                                            handlePeoplePermissionChange(entity.key, 'delete', e.target.checked)
                                          }
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Tasks & Maintenance Section */}
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">Tasks & Maintenance</h4>
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                                    Entity
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    View List
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    View One
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    Create
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    Edit
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                    Delete
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {tasksEntities.map((entity) => {
                                  const permissions = formData.permissions.tasksAndMaintenance[entity.key];
                                  return (
                                    <tr key={entity.key} className="hover:bg-slate-50">
                                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                        {entity.label}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          {(['none', 'view', 'edit'] as const).map((level) => (
                                            <button
                                              key={level}
                                              type="button"
                                              onClick={() =>
                                                handleTasksPermissionChange(entity.key, 'viewList', level)
                                              }
                                              className={`w-6 h-6 rounded-full border-2 transition-colors ${
                                                permissions.viewList === level
                                                  ? 'bg-blue-600 border-blue-600'
                                                  : 'bg-white border-slate-300 hover:border-blue-400'
                                              }`}
                                              title={level}
                                            />
                                          ))}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          {(['none', 'view', 'edit'] as const).map((level) => (
                                            <button
                                              key={level}
                                              type="button"
                                              onClick={() =>
                                                handleTasksPermissionChange(entity.key, 'viewOne', level)
                                              }
                                              className={`w-6 h-6 rounded-full border-2 transition-colors ${
                                                permissions.viewOne === level
                                                  ? 'bg-blue-600 border-blue-600'
                                                  : 'bg-white border-slate-300 hover:border-blue-400'
                                              }`}
                                              title={level}
                                            />
                                          ))}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={permissions.create}
                                          onChange={(e) =>
                                            handleTasksPermissionChange(entity.key, 'create', e.target.checked)
                                          }
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={permissions.edit}
                                          onChange={(e) =>
                                            handleTasksPermissionChange(entity.key, 'edit', e.target.checked)
                                          }
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={permissions.delete}
                                          onChange={(e) =>
                                            handleTasksPermissionChange(entity.key, 'delete', e.target.checked)
                                          }
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Sidebar Tabs Section */}
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">Sidebar Tabs</h4>
                          <p className="text-sm text-slate-600 mb-4">
                            Control access to all navigation tabs from both the main sidebar and second sidebar.
                          </p>
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                                      Tab Name
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                      View List
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                      View One
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                      Create
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                      Edit
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">
                                      Delete
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {sidebarTabEntities.map((entity) => {
                                    // Ensure sidebarTabs is initialized - use a safe default
                                    const sidebarTabs = formData.permissions.sidebarTabs || initializeSidebarTabs();
                                    const permissions = sidebarTabs[entity.key] || {
                                      viewList: false,
                                      viewOne: false,
                                      create: false,
                                      edit: false,
                                      delete: false,
                                    };
                                    return (
                                      <tr key={entity.key} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                          {entity.label}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <input
                                            type="checkbox"
                                            checked={permissions.viewList}
                                            onChange={(e) =>
                                              handleSidebarTabPermissionChange(entity.key, 'viewList', e.target.checked)
                                            }
                                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                          />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <input
                                            type="checkbox"
                                            checked={permissions.viewOne}
                                            onChange={(e) =>
                                              handleSidebarTabPermissionChange(entity.key, 'viewOne', e.target.checked)
                                            }
                                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                          />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <input
                                            type="checkbox"
                                            checked={permissions.create}
                                            onChange={(e) =>
                                              handleSidebarTabPermissionChange(entity.key, 'create', e.target.checked)
                                            }
                                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                          />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <input
                                            type="checkbox"
                                            checked={permissions.edit}
                                            onChange={(e) =>
                                              handleSidebarTabPermissionChange(entity.key, 'edit', e.target.checked)
                                            }
                                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                          />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <input
                                            type="checkbox"
                                            checked={permissions.delete}
                                            onChange={(e) =>
                                              handleSidebarTabPermissionChange(entity.key, 'delete', e.target.checked)
                                            }
                                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                          />
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'authority' && (
                      <div className="space-y-6">
                        <p className="text-sm text-slate-600">
                          Select the hostel that this role has authority over. This defines which hostel's data and operations this role can manage.
                        </p>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-3">
                            Select Authority Hostel
                          </label>
                          
                          {hostels.length > 0 ? (
                            <div className="space-y-2">
                              {/* Option for No Hostel (Global Role) */}
                              <div className="flex items-center p-4 border border-slate-300 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                onClick={() => setFormData(prev => ({ ...prev, hostelId: null }))}
                              >
                                <input
                                  type="radio"
                                  name="hostel"
                                  value=""
                                  checked={formData.hostelId === null}
                                  onChange={() => setFormData(prev => ({ ...prev, hostelId: null }))}
                                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <label className="ml-3 flex flex-col">
                                  <span className="text-sm font-medium text-slate-900">No Specific Hostel</span>
                                  <span className="text-xs text-slate-500">This is a global role with access to all hostels</span>
                                </label>
                              </div>

                              {/* Individual Hostel Options */}
                              {hostels.map((hostel) => (
                                <div
                                  key={hostel.id}
                                  className="flex items-center p-4 border border-slate-300 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                  onClick={() => setFormData(prev => ({ ...prev, hostelId: hostel.id }))}
                                >
                                  <input
                                    type="radio"
                                    name="hostel"
                                    value={hostel.id}
                                    checked={formData.hostelId === hostel.id}
                                    onChange={() => setFormData(prev => ({ ...prev, hostelId: hostel.id }))}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                  />
                                  <label className="ml-3 flex flex-col">
                                    <span className="text-sm font-medium text-slate-900">{hostel.name}</span>
                                    <span className="text-xs text-slate-500">ID: {hostel.id}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-sm text-amber-800">No hostels available. Please create a hostel first.</p>
                            </div>
                          )}
                        </div>

                        {formData.hostelId && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              This role is configured for hostel ID: <strong>{formData.hostelId}</strong>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
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
                          <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                        </>
                      ) : (
                        isEdit ? 'Update' : 'Save'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

