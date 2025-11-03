/**
 * HostelCreate page
 * Create new hostel with form validation
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
 * Hostel create page
 */
const HostelCreate: React.FC = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HostelFormData>({
    resolver: zodResolver(hostelSchema),
  });

  const onSubmit = async (data: HostelFormData) => {
    try {
      hostelService.createHostel(data);
      setToast({
        open: true,
        type: 'success',
        message: 'Hostel created successfully!',
      });
      // Navigate after a short delay
      setTimeout(() => navigate(ROUTES.HOSTEL), 1500);
    } catch (error) {
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to create hostel. Please try again.',
      });
    }
  };

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
        <h1 className="text-3xl font-bold text-slate-900">Create New Hostel</h1>
        <p className="text-slate-600 mt-1">Add a new hostel property</p>
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
            {isSubmitting ? 'Creating...' : 'Create Hostel'}
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

export default HostelCreate;

