/**
 * HostelEdit page
 * Edit existing hostel with form validation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Toast } from '../../components/Toast';
import type { HostelFormData } from '../../types/hostel';
import type { ToastType } from '../../types/common';
import ROUTES from '../../routes/routePaths';
import * as hostelService from '../../services/hostel.service';

// Zod validation schema
const hostelSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  city: z.string().min(2, 'City is required'),
  totalFloors: z.number().min(1, 'Must have at least 1 floor').max(50),
  roomsPerFloor: z.number().min(1, 'Must have at least 1 room').max(100),
  managerName: z.string().min(2, 'Manager name is required'),
  managerPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  notes: z.string().optional(),
});

/**
 * Hostel edit page
 */
const HostelEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HostelFormData>({
    resolver: zodResolver(hostelSchema),
  });

  // Load hostel data
  useEffect(() => {
    if (!id) return;

    const hostel = hostelService.getHostelById(Number(id));
    if (hostel) {
      reset({
        name: hostel.name,
        city: hostel.city,
        totalFloors: hostel.totalFloors,
        roomsPerFloor: hostel.roomsPerFloor,
        managerName: hostel.managerName,
        managerPhone: hostel.managerPhone,
        notes: hostel.notes || '',
      });
      setLoading(false);
    } else {
      setToast({
        open: true,
        type: 'error',
        message: 'Hostel not found',
      });
      setTimeout(() => navigate(ROUTES.HOSTEL), 2000);
    }
  }, [id, reset, navigate]);

  const onSubmit = async (data: HostelFormData) => {
    if (!id) return;

    try {
      const updated = hostelService.updateHostel(Number(id), data);
      if (updated) {
        setToast({
          open: true,
          type: 'success',
          message: 'Hostel updated successfully!',
        });
        // Navigate after a short delay
        setTimeout(() => navigate(ROUTES.HOSTEL), 1500);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to update hostel. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-600">Loading hostel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(ROUTES.HOSTEL)}
          className="text-brand-600 hover:text-brand-700 mb-4 inline-flex items-center gap-2"
        >
          ← Back to Hostels
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Edit Hostel</h1>
        <p className="text-slate-600 mt-1">Update hostel information</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Hostel Name *
          </label>
          <input
            {...register('name')}
            type="text"
            className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Downtown Hub Hostel"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City *
          </label>
          <input
            {...register('city')}
            type="text"
            className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="New York"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* Floors and Rooms */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total Floors *
            </label>
            <input
              {...register('totalFloors', { valueAsNumber: true })}
              type="number"
              min="1"
              className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="5"
            />
            {errors.totalFloors && (
              <p className="mt-1 text-sm text-red-600">
                {errors.totalFloors.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rooms per Floor *
            </label>
            <input
              {...register('roomsPerFloor', { valueAsNumber: true })}
              type="number"
              min="1"
              className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="12"
            />
            {errors.roomsPerFloor && (
              <p className="mt-1 text-sm text-red-600">
                {errors.roomsPerFloor.message}
              </p>
            )}
          </div>
        </div>

        {/* Manager Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Manager Name *
            </label>
            <input
              {...register('managerName')}
              type="text"
              className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="John Doe"
            />
            {errors.managerName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.managerName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Manager Phone *
            </label>
            <input
              {...register('managerPhone')}
              type="tel"
              className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="+1-555-0100"
            />
            {errors.managerPhone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.managerPhone.message}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Additional information about the hostel..."
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.HOSTEL)}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
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

export default HostelEdit;

