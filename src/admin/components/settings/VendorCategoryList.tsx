/**
 * VendorCategoryList Component
 * Manages vendor categories with CRUD operations
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

interface VendorCategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VendorCategoryListProps {
  onBack: () => void;
}

const VendorCategoryList: React.FC<VendorCategoryListProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VendorCategory | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: ToastType; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ROUTES.VENDOR_CATEGORY.LIST);
      if (response && response.success) {
        // Handle both array response and object with data property
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to fetch categories. Please ensure the backend is running and Prisma client is regenerated.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  // Handle add category
  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsAddModalOpen(true);
  };

  // Handle edit category
  const handleEdit = (category: VendorCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setIsEditModalOpen(true);
  };

  // Handle delete category
  const handleDelete = async (category: VendorCategory) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      const response = await api.delete(API_ROUTES.VENDOR_CATEGORY.DELETE(category.id));
      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: `Category "${category.name}" deleted successfully`,
        });
        fetchCategories();
      } else {
        throw new Error(response.message || 'Failed to delete category');
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete category',
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
        message: 'Category name is required',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Update
        const response = await api.put(API_ROUTES.VENDOR_CATEGORY.UPDATE(editingCategory.id), {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        });

        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: `Category "${formData.name}" updated successfully`,
          });
          setIsEditModalOpen(false);
          setEditingCategory(null);
          fetchCategories();
        } else {
          throw new Error(response.message || 'Failed to update category');
        }
      } else {
        // Create
        const response = await api.post(API_ROUTES.VENDOR_CATEGORY.CREATE, {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        });

        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: `Category "${formData.name}" created successfully`,
          });
          setIsAddModalOpen(false);
          fetchCategories();
        } else {
          throw new Error(response.message || 'Failed to create category');
        }
      }

      setFormData({ name: '', description: '' });
    } catch (error: any) {
      console.error('Error saving category:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to save category',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define columns
  const columns: Column<VendorCategory>[] = [
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
      render: (category) => (
        <span className="font-medium text-slate-900">{category.name}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (category) => (
        <span className="text-slate-600">{category.description || 'No description'}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(category)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(category)}
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
            placeholder="Search categories"
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
          <h1 className="text-3xl font-bold text-slate-900">Vendor Categories</h1>
        </div>
        <Button
          variant="primary"
          onClick={handleAdd}
          icon={PlusIcon}
        >
          New Category
        </Button>
      </div>

      {/* Categories Table */}
      <DataTable
        columns={columns}
        data={filteredCategories}
        toolbar={toolbar}
        emptyMessage="No categories found. Create your first category to get started."
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({ name: '', description: '' });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingCategory(null);
                    setFormData({ name: '', description: '' });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Category'}
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

export default VendorCategoryList;
