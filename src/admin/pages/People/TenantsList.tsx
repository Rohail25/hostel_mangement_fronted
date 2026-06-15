/**
 * TenantsList page
 * Displays and manages tenant records
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  UserPlusIcon, 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import type { Tenant } from '../../types/people';
import { formatDate } from '../../types/common';
import tenantsData from '../../mock/tenants.json';

/**
 * Tenants list page
 */
const TenantsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState<number | null>(null);
  const [tenantRows, setTenantRows] = useState<Tenant[]>(tenantsData as Tenant[]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    room: '',
    bed: '',
    leaseStart: '',
    leaseEnd: '',
    rent: '',
    deposit: '',
    status: 'Active',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      room: '',
      bed: '',
      leaseStart: '',
      leaseEnd: '',
      rent: '',
      deposit: '',
      status: 'Active',
    });
    setEditingTenantId(null);
    setIsEditMode(false);
  };

  const handleOpenAddTenant = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleViewTenant = (tenant: Tenant) => {
    window.alert(
      `Tenant details:\nName: ${tenant.name}\nEmail: ${tenant.email}\nPhone: ${tenant.phone}\nRoom: ${tenant.room}\nBed: ${tenant.bed}\nLease: ${tenant.leaseStart} - ${tenant.leaseEnd}`
    );
  };

  const handleEditTenant = (tenant: Tenant) => {
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      room: tenant.room,
      bed: tenant.bed,
      leaseStart: tenant.leaseStart,
      leaseEnd: tenant.leaseEnd,
      rent: '',
      deposit: '',
      status: tenant.status,
    });
    setEditingTenantId(tenant.id as number);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    if (!window.confirm(`Delete ${tenant.name}? This action cannot be undone.`)) {
      return;
    }

    setTenantRows((prev) => prev.filter((row) => row.id !== tenant.id));
    if (editingTenantId === tenant.id) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    let data = tenantRows;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.email.toLowerCase().includes(query) ||
          t.room.includes(query)
      );
    }

    // Status filter
    if (statusFilter) {
      data = data.filter((t) => t.status === statusFilter);
    }

    return data;
  }, [searchQuery, statusFilter]);

  // Define columns matching image 2 structure
  const columns: Column<Tenant>[] = [
    {
      key: 'tenant',
      label: 'Tenant',
      sortable: true,
      render: (row) => {
        const propertyAddress = row.hostelName 
          ? `${row.hostelName} | ${row.room || 'Room'} ${row.bed || ''}`.trim()
          : `${row.room || ''}-${row.bed || ''}`.trim() || 'N/A';
        
        return (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 truncate">{row.name}</span>
                <Badge
                  variant={
                    row.status === 'Active'
                      ? 'success'
                      : row.status === 'Pending'
                      ? 'warning'
                      : 'default'
                  }
                  className="text-xs"
                >
                  {row.status === 'Active' ? 'Current' : row.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate">{propertyAddress}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (row) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700">{row.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {row.phone ? (
              <span className="text-sm text-gray-700">{row.phone}</span>
            ) : (
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Add Phone Number
              </button>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewTenant(row)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleEditTenant(row)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDeleteTenant(row)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  // Toolbar with search and filters
  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, or room..."
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
            { value: 'Pending', label: 'Pending' },
          ]}
        />
      </div>
    </div>
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingTenant =
      isEditMode && editingTenantId !== null
        ? tenantRows.find((tenant) => tenant.id === editingTenantId) || null
        : null;

    const updatedTenant = {
      id:
        existingTenant?.id ??
        tenantRows.reduce((maxId, tenant) => Math.max(maxId, tenant.id as number), 0) + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      room: formData.room,
      bed: formData.bed,
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      status: existingTenant?.status ?? formData.status || 'Active',
      hostelName: existingTenant?.hostelName ?? 'N/A',
    } as Tenant;

    if (isEditMode && editingTenantId !== null) {
      setTenantRows((prev) =>
        prev.map((tenant) => (tenant.id === editingTenantId ? updatedTenant : tenant))
      );
    } else {
      setTenantRows((prev) => [updatedTenant, ...prev]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tenants</h1>
            <p className="text-slate-600 mt-1">
              Manage and view all tenant information
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAddTenant}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            <UserPlusIcon className="w-5 h-5" />
            Add Tenant
          </motion.button>
        </div>

        {/* Data table */}
        <DataTable
          columns={columns}
          data={filteredData}
          toolbar={toolbar}
          emptyMessage="No tenants found. Try adjusting your search or filters."
        />
      </div>

      {/* Add Tenant Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <UserPlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {isEditMode ? 'Edit Tenant' : 'Add New Tenant'}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {isEditMode ? 'Update tenant information' : 'Fill in the tenant details'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>

                {/* Room Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="101"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bed Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bed}
                        onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="A"
                      />
                    </div>
                  </div>
                </div>

                {/* Lease Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lease Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lease Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.leaseStart}
                        onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lease End Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.leaseEnd}
                        onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.rent}
                        onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Deposit *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.deposit}
                        onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isEditMode ? 'Save Changes' : 'Add Tenant'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TenantsList;

