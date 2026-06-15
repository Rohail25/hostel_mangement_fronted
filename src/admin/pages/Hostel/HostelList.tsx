/**
 * HostelList page
 * View and manage hostels
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Toast } from '../../components/Toast';
import { AddHostelForm } from '../../components/AddHostelForm';
import type { Hostel, HostelFormData } from '../../types/hostel';
import type { ToastType } from '../../types/common';
import ROUTES from '../../routes/routePaths';
import * as hostelService from '../../services/hostel.service';
import { api } from '../../../services/apiClient';
import { API_ROUTES } from '../../../services/api.config';
import { useAuth } from '../../context/AuthContext';
import { getRolePrefix } from '../../../components/ProtectedRoute';

/**
 * Hostel list page
 */
const HostelList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rolePrefix = getRolePrefix(user?.roleType || 'user');
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [isAddHostelOpen, setIsAddHostelOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    hostel: Hostel | null;
  }>({ open: false, hostel: null });
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });

  // Load hostels from API
  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostelService.getAllHostelsFromAPI();
      setHostels(data);
    } catch (err: any) {
      console.error('Error loading hostels:', err);
      setError(err?.message || 'Failed to load hostels. Please try again.');
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities from hostels
  const cities = React.useMemo(() => {
    const uniqueCities = Array.from(
      new Set(hostels.map((h) => h.city).filter(Boolean))
    ).sort();
    return uniqueCities.map((city) => ({ value: city, label: city }));
  }, [hostels]);

  // Combined filtering: search query + city filter
  const filteredData = React.useMemo(() => {
    let filtered = hostels;

    // Apply city filter
    if (selectedCity) {
      filtered = filtered.filter(
        (h) => h.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(lowerQuery) ||
          h.city.toLowerCase().includes(lowerQuery) ||
          (h.managerName && h.managerName.toLowerCase().includes(lowerQuery))
      );
    }

    return filtered;
  }, [hostels, selectedCity, searchQuery]);

  // Handle add hostel (from AddHostelForm modal)
  const handleAddHostel = async (data: any) => {
    try {
      // Prepare payload for backend API according to specification
      const payload = {
        name: data.name?.trim(),
        contactInfo: {
          phone: data.phone?.trim(),
          email: data.email?.trim(),
        },
        address: {
          country: data.address?.country?.trim() ?? data.country?.trim(),
          state: data.address?.state?.trim() ?? data.state?.trim(),
          city: data.address?.city?.trim() ?? data.city?.trim(),
          street: data.address?.street?.trim() ?? data.street?.trim(),
        },
        description: data.description?.trim() || undefined,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        mapLink: data.mapLink?.trim() || undefined,
        category: data.category,
        type: data.type,
        totalFloors: data.totalFloors,
        totalRooms: data.totalRooms,
        totalBeds: data.totalBeds,
        arrangements: Array.isArray(data.arrangements) ? data.arrangements : [],
        operatingHours: {
          checkIn: data.operatingHours?.checkIn || data.checkInTime,
          checkOut: data.operatingHours?.checkOut || data.checkOutTime,
        },
      };

      console.log('📡 [ADD HOSTEL MODAL] Sending payload:', payload);

      const response = await api.post(API_ROUTES.HOSTEL.CREATE, payload);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create hostel');
      }

      setToast({
        open: true,
        type: 'success',
        message: response.message || `Hostel "${response.data.name}" created successfully!`,
      });
      // Reload hostels from API
      await loadHostels();
      setIsAddHostelOpen(false);
      // Optionally navigate to view the new hostel
      // navigate(`/admin/hostel/${newHostel.id}`);
    } catch (error) {
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to create hostel. Please try again.',
      });
    }
  };

  // Handle PDF export
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      // Title
      doc.setFontSize(18);
      doc.text('Hostel Management Report', 105, yPos, { align: 'center' });
      yPos += 10;
      
      // Date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      // Table headers
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Name', 20, yPos);
      doc.text('City', 60, yPos);
      doc.text('Blocks', 90, yPos);
      doc.text('Rooms/Block', 115, yPos);
      doc.text('Manager', 145, yPos);
      doc.text('Phone', 175, yPos);
      yPos += 8;
      
      // Table data
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      filteredData.forEach((hostel, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(hostel.name || 'N/A', 20, yPos);
        doc.text(hostel.city || 'N/A', 60, yPos);
        doc.text(String(hostel.totalFloors || 0), 90, yPos);
        doc.text(String(hostel.roomsPerFloor || 0), 115, yPos);
        doc.text(hostel.managerName || 'N/A', 145, yPos);
        doc.text(hostel.managerPhone || 'N/A', 175, yPos);
        yPos += 7;
      });
      
      // Save PDF
      doc.save(`hostels-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      setToast({
        open: true,
        type: 'success',
        message: 'PDF exported successfully!',
      });
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to export PDF. Please try again.',
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.hostel) return;

    try {
      const hostelId = deleteConfirm.hostel.id;
      console.log('📡 Deleting hostel:', hostelId);

      const response = await api.delete(API_ROUTES.HOSTEL.DELETE(hostelId));

      if (response.success) {
        console.log('✅ Hostel deleted successfully');
        setToast({
          open: true,
          type: 'success',
          message: response.message || `Hostel "${deleteConfirm.hostel.name}" deleted successfully`,
        });
        // Reload hostels from API
        await loadHostels();
      } else {
        throw new Error(response.message || 'Failed to delete hostel');
      }
    } catch (error: any) {
      console.error('❌ Error deleting hostel:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete hostel. Please try again.',
      });
    }
    setDeleteConfirm({ open: false, hostel: null });
  };

  // Define columns
  const columns: Column<Hostel>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
    },
    {
      key: 'totalFloors',
      label: 'Blocks',
    },
    {
      key: 'roomsPerFloor',
      label: 'Rooms/Block',
    },
    {
      key: 'managerName',
      label: 'Manager',
    },
    {
      key: 'managerPhone',
      label: 'Phone',
    },
  ];

  // Actions renderer - Professional styled buttons with icons
  const actionsRender = (hostel: Hostel) => (
    <div className="flex items-center gap-2">
      {/* View Button - Blue with icon */}
      <motion.button
        onClick={() => navigate(`${rolePrefix}/hostel/${hostel.id}`)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm hover:shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        title="View Hostel Details"
      >
        <EyeIcon className="w-4 h-4" />
        <span>View</span>
      </motion.button>

      {/* Edit Button - Brand color with icon */}
      <motion.button
        onClick={() => navigate(`${rolePrefix}/hostel/${hostel.id}/edit`)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-[#2176FF] to-[#1966E6] rounded-lg shadow-sm hover:shadow-md hover:from-[#1966E6] hover:to-[#1555CC] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2176FF] focus:ring-offset-1"
        title="Edit Hostel"
      >
        <PencilIcon className="w-4 h-4" />
        <span>Edit</span>
      </motion.button>

      {/* Delete Button - Red with icon */}
      <motion.button
        onClick={() => setDeleteConfirm({ open: true, hostel })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-red-500 to-red-600 rounded-lg shadow-sm hover:shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        title="Delete Hostel"
      >
        <TrashIcon className="w-4 h-4" />
        <span>Delete</span>
      </motion.button>
    </div>
  );

  // Toolbar with search and city filter
  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, city, or manager..."
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={selectedCity}
          onChange={setSelectedCity}
          options={cities}
          placeholder="All Cities"
          // label="Filter by City"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hostel Management
          </h1>
          <p className="text-slate-600 mt-1">Manage hostel properties</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            icon={ArrowDownTrayIcon}
          >
            Export PDF
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsAddHostelOpen(true)}
            icon={PlusIcon}
          >
            Add Hostel
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading hostels...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
          <button
            onClick={loadHostels}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Data table */}
      {!loading && !error && (
        <DataTable
          columns={columns}
          data={filteredData}
          toolbar={toolbar}
          actionsRender={actionsRender}
          emptyMessage="No hostels found. Create your first hostel to get started."
        />
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Hostel"
        message={`Are you sure you want to delete "${deleteConfirm.hostel?.name}"? This will remove all its rooms and related data.`}
        confirmText="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, hostel: null })}
      />

      {/* Toast notification */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />

      {/* Add Hostel Modal Form */}
      <AddHostelForm
        isOpen={isAddHostelOpen}
        onClose={() => setIsAddHostelOpen(false)}
        onSubmit={handleAddHostel}
      />
    </div>
  );
};

export default HostelList;

