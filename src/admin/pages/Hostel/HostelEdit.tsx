/**
 * HostelEdit page
 * Edit existing hostel with form validation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from '../../components/Toast';
import { AddHostelForm } from '../../components/AddHostelForm';
import type { ToastType } from '../../types/common';
import ROUTES from '../../routes/routePaths';
import { api } from '../../../services/apiClient';
import { API_ROUTES } from '../../../services/api.config';
import { useAuth } from '../../context/AuthContext';
import { getRolePrefix } from '../../../components/ProtectedRoute';

/**
 * Hostel edit page
 */
const HostelEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const rolePrefix = getRolePrefix(user?.roleType || 'user');
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });

  // Load hostel data
  useEffect(() => {
    if (!id) return;

    const loadHostel = async () => {
      try {
        setLoading(true);
        // Owner uses admin endpoint (backend filters data)
        const hostelEndpoint = API_ROUTES.HOSTEL.BY_ID(Number(id));

        const response = await api.get(hostelEndpoint);
        if (response.success && response.data) {
          setHostel(response.data);
        } else {
          setToast({
            open: true,
            type: 'error',
            message: 'Hostel not found',
          });
          setTimeout(() => navigate(`${rolePrefix}/hostel`), 2000);
        }
      } catch (error: any) {
        setToast({
          open: true,
          type: 'error',
          message: error.message || 'Failed to load hostel',
        });
        setTimeout(() => navigate(`${rolePrefix}/hostel`), 2000);
      } finally {
        setLoading(false);
      }
    };

    loadHostel();
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    if (!id) return;

    try {
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
        mapLink: data.mapLink?.trim() || undefined,
      };

      // Owner uses admin endpoint (backend filters data)
      const updateEndpoint = API_ROUTES.HOSTEL.UPDATE(Number(id));

      const response = await api.put(updateEndpoint, payload);

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: response.message || 'Hostel updated successfully!',
        });
        setTimeout(() => navigate(`${rolePrefix}/hostel`), 1500);
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to update hostel. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-600">Loading hostel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`${rolePrefix}/hostel`)}
          className="text-[#2176FF] hover:text-[#1966E6] mb-4 inline-flex items-center gap-2"
        >
          ← Back to Hostels
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Edit Hostel</h1>
        <p className="text-slate-600 mt-1">Update hostel information</p>
      </div>

      {/* Use AddHostelForm component for editing */}
      <AddHostelForm
        isOpen={isFormOpen}
        onClose={() => navigate(`${rolePrefix}/hostel`)}
        onSubmit={handleSubmit}
        editingHostel={hostel}
      />

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

export default HostelEdit;

