/**
 * Currency Management Card Component
 * Manage user's preferred currency (one per user)
 */

import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Modal } from './Modal';
import { Button } from './Button';
import { Toast } from './Toast';
import { ConfirmDialog } from './ConfirmDialog';
import * as currencyApiService from '../services/currency-api.service';
import type { Currency, CurrencyFormData } from '../services/currency-api.service';
import type { ToastType } from '../types/common';

interface CurrencyManagementCardProps {
  onCurrencyChange?: (currency: Currency | null) => void;
}

export const CurrencyManagementCard: React.FC<CurrencyManagementCardProps> = ({
  onCurrencyChange,
}) => {
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });

  const [formData, setFormData] = useState<CurrencyFormData>({
    symbol: '',
    code: '',
    name: '',
  });

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      setLoading(true);
      const data = await currencyApiService.getUserCurrencyAPI();
      setCurrency(data);
    } catch (error: any) {
      // No currency set yet is not an error
      setCurrency(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({ symbol: '', code: '', name: '' });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (currency) {
      setFormData({
        symbol: currency.symbol,
        code: currency.code || '',
        name: currency.name || '',
      });
      setIsEditModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.symbol.trim()) {
      setToast({
        open: true,
        type: 'warning',
        message: 'Currency symbol is required',
      });
      return;
    }

    try {
      setSubmitting(true);
      const savedCurrency = await currencyApiService.createOrUpdateCurrencyAPI(formData);
      setCurrency(savedCurrency);
      
      if (onCurrencyChange) {
        onCurrencyChange(savedCurrency);
      }

      const isNew = !currency;
      setToast({
        open: true,
        type: 'success',
        message: isNew
          ? 'Currency added successfully!'
          : 'Currency updated successfully!',
      });

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setFormData({ symbol: '', code: '', name: '' });
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to save currency',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await currencyApiService.deleteCurrencyAPI();
      setCurrency(null);
      
      if (onCurrencyChange) {
        onCurrencyChange(null);
      }

      setToast({
        open: true,
        type: 'success',
        message: 'Currency deleted successfully',
      });
      setDeleteConfirm(false);
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete currency',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Currency</h3>
              <p className="text-sm text-slate-600">
                {currency
                  ? 'Manage your preferred currency'
                  : 'Set your preferred currency'}
              </p>
            </div>
          </div>
          {!currency && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddModal}
              icon={PlusIcon}
            >
              Add Currency
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {currency ? (
            <div className="space-y-4">
              {/* Currency Display */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Symbol</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {currency.symbol}
                    </p>
                  </div>
                  {currency.code && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Code</p>
                      <p className="text-lg font-semibold text-slate-900 mt-1">
                        {currency.code}
                      </p>
                    </div>
                  )}
                  {currency.name && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Name</p>
                      <p className="text-lg font-semibold text-slate-900 mt-1">
                        {currency.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenEditModal}
                  icon={PencilIcon}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirm(true)}
                  icon={TrashIcon}
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CurrencyDollarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">No currency set yet</p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddModal}
                icon={PlusIcon}
              >
                Add Currency
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setFormData({ symbol: '', code: '', name: '' });
        }}
        title={currency ? 'Edit Currency' : 'Add Currency'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Currency Symbol */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Currency Symbol <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
                placeholder="e.g., $, €, ₹, £"
                maxLength={10}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-slate-600 mt-1">
                The currency symbol to display (required)
              </p>
            </div>

            {/* Currency Code */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Currency Code <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., USD, EUR, INR, GBP"
                maxLength={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-slate-600 mt-1">
                ISO 4217 currency code (optional)
              </p>
            </div>

            {/* Currency Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Currency Name <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., US Dollar, Euro, Indian Rupee"
                maxLength={50}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-slate-600 mt-1">
                Full name of the currency (optional)
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setFormData({ symbol: '', code: '', name: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : currency ? 'Update Currency' : 'Add Currency'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm}
        title="Delete Currency"
        message="Are you sure you want to delete this currency? You can add it again later."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
        isDangerous={true}
      />

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
};
