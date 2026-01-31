/**
 * VendorServiceList Component
 * Manages vendor services with CRUD operations
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../../components/Button';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { api } from '../../../services/apiClient';
import { API_ROUTES } from '../../../services/api.config';
import { Toast } from '../../components/Toast';
import type { ToastType } from '../../types/common';

interface VendorService {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  unit: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VendorServiceListProps {
  onBack: () => void;
}

const VendorServiceList: React.FC<VendorServiceListProps> = ({ onBack }) => {
  const [services, setServices] = useState<VendorService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<VendorService | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    category: '',
    price: '',
    unit: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: ToastType; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/vendor/management/services');
      if (response && response.success) {
        // Handle different response structures
        let servicesData: any[] = [];
        if (Array.isArray(response.data)) {
          servicesData = response.data;
        } else if (response.data && Array.isArray(response.data.services)) {
          servicesData = response.data.services;
        } else if (response.data && Array.isArray(response.data.items)) {
          servicesData = response.data.items;
        }
        
        // Map the data to match our interface
        const mappedServices = servicesData.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description || null,
          category: s.category || null,
          price: s.price || null,
          unit: s.unit || s.priceUnit || null,
          createdAt: s.createdAt || new Date().toISOString(),
          updatedAt: s.updatedAt || new Date().toISOString(),
        }));
        
        setServices(mappedServices);
      } else {
        setServices([]);
      }
    } catch (error: any) {
      console.error('Error fetching services:', error);
      setServices([]);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to fetch services. Please ensure the backend is running.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on search
  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return services;
    const query = searchQuery.toLowerCase();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        (service.description && service.description.toLowerCase().includes(query)) ||
        (service.category && service.category.toLowerCase().includes(query))
    );
  }, [services, searchQuery]);

  // Handle add service
  const handleAdd = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', category: '', price: '', unit: '' });
    setIsAddModalOpen(true);
  };

  // Handle edit service
  const handleEdit = (service: VendorService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      category: service.category || '',
      price: service.price ? String(service.price) : '',
      unit: service.unit || '',
    });
    setIsEditModalOpen(true);
  };

  // Handle delete service
  const handleDelete = async (service: VendorService) => {
    if (!window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      return;
    }

    try {
      const response = await api.delete(`/admin/vendor/management/services/${service.id}`);
      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: `Service "${service.name}" deleted successfully`,
        });
        fetchServices();
      } else {
        throw new Error(response.message || 'Failed to delete service');
      }
    } catch (error: any) {
      console.error('Error deleting service:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete service',
      });
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setToast({
        open: true,
        type: 'error',
        message: 'Service name is required',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category.trim() || null,
      };

      if (formData.price) {
        const priceValue = parseFloat(formData.price);
        if (!isNaN(priceValue)) {
          payload.price = priceValue;
        }
      }

      if (formData.unit) {
        payload.unit = formData.unit.trim(); // Backend expects 'unit' but schema has 'priceUnit'
      }

      if (editingService) {
        // Update
        const response = await api.put(`/admin/vendor/management/services/${editingService.id}`, payload);

        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: `Service "${formData.name}" updated successfully`,
          });
          setIsEditModalOpen(false);
          setEditingService(null);
          fetchServices();
        } else {
          throw new Error(response.message || 'Failed to update service');
        }
      } else {
        // Create
        const response = await api.post('/admin/vendor/management/services', payload);

        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: `Service "${formData.name}" created successfully`,
          });
          setIsAddModalOpen(false);
          fetchServices();
        } else {
          throw new Error(response.message || 'Failed to create service');
        }
      }

      setFormData({ name: '', description: '', category: '', price: '', unit: '' });
    } catch (error: any) {
      console.error('Error saving service:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to save service',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define columns
  const columns: Column<VendorService>[] = [
    {
      key: 'name',
      label: 'Service Name',
      sortable: true,
      render: (service) => (
        <span className="font-medium text-slate-900">{service.name}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (service) => (
        <span className="text-slate-600">{service.description || 'No description'}</span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (service) => (
        <span className="text-slate-600">{service.category || 'N/A'}</span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (service) => (
        <span className="text-slate-900">
          {service.price ? `$${service.price.toFixed(2)}` : 'N/A'}
          {service.unit && <span className="text-slate-500 text-xs ml-1">({service.unit})</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (service) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(service)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(service)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  // Toolbar
  const toolbar = (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services"
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
          <h1 className="text-3xl font-bold text-slate-900">Vendor Services</h1>
        </div>
        <Button
          variant="primary"
          onClick={handleAdd}
          icon={PlusIcon}
        >
          New Service
        </Button>
      </div>

      {/* Services Table */}
      <DataTable
        columns={columns}
        data={filteredServices}
        toolbar={toolbar}
        emptyMessage="No services found. Create your first service to get started."
        pageSize={10}
        loading={loading}
      />

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter service name"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter service description"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Enter category"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., per hour"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({ name: '', description: '', category: '', price: '', unit: '' });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Service'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter service name"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter service description"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Enter category"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., per hour"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingService(null);
                    setFormData({ name: '', description: '', category: '', price: '', unit: '' });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Service'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default VendorServiceList;
