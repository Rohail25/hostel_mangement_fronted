/**
 * VendorList page
 * View and manage vendors
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserPlusIcon, BuildingOfficeIcon, EyeIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import type { Vendor } from '../../types/comms';
import type { Hostel } from '../../types/hostel';
import { formatDate } from '../../types/common';
import vendorsData from '../../mock/vendors.json';
import hostelsData from '../../mock/hostels.json';

/**
 * Vendor list page
 */
const VendorList: React.FC = () => {
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    rating: '5',
    hostelId: '',
  });
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; vendor: Vendor | null }>({
    isOpen: false,
    vendor: null,
  });
  const [detailTab, setDetailTab] = useState<'details' | 'scorecard'>('details');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreForm, setScoreForm] = useState({
    behavior: 5,
    punctuality: 5,
    quality: 5,
    remarks: '',
  });
  const [currentScoreVendor, setCurrentScoreVendor] = useState<Vendor | null>(null);
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });

  // Score management functions
  const getScoreKey = (id: number) => `score_vendor_${id}`;
  
  const getScore = (id: number) => {
    const key = getScoreKey(id);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const getScoreHistory = (id: number) => {
    const key = `score_history_vendor_${id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  };

  const saveScore = (id: number, scoreData: any) => {
    const key = getScoreKey(id);
    const historyKey = `score_history_vendor_${id}`;
    
    // Calculate average
    const average = (scoreData.behavior + scoreData.punctuality + scoreData.quality) / 3;
    const scoreRecord = {
      ...scoreData,
      average,
      date: new Date().toISOString(),
    };
    
    // Save current score
    localStorage.setItem(key, JSON.stringify(scoreRecord));
    
    // Add to history
    const history = getScoreHistory(id);
    history.unshift(scoreRecord);
    // Keep only last 10 records
    if (history.length > 10) history.pop();
    localStorage.setItem(historyKey, JSON.stringify(history));
    
    return scoreRecord;
  };

  // Filter data
  const filteredData = useMemo(() => {
    let data = vendorsData as Vendor[];

    // Filter by selected hostel
    if (selectedHostelId) {
      data = data.filter((v) => v.hostelId === Number(selectedHostelId) || !v.hostelId);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.specialty.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      data = data.filter((v) => v.status === statusFilter);
    }

    return data;
  }, [selectedHostelId, searchQuery, statusFilter]);

  // Get hostel options
  const hostelOptions = [
    { value: '', label: 'All Hostels' },
    ...(hostelsData as Hostel[]).map((h) => ({
      value: String(h.id),
      label: h.name,
    })),
  ];

  // Define columns
  const columns: Column<Vendor>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'specialty',
      label: 'Specialty',
      sortable: true,
    },
    {
      key: 'hostelId',
      label: 'Hostel',
      render: (row) => {
        if (!row.hostelId) return <span className="text-slate-400">All Hostels</span>;
        const hostel = (hostelsData as Hostel[]).find((h) => h.id === row.hostelId);
        return hostel ? hostel.name : '-';
      },
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => row.email || '-',
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span>⭐</span>
          <span className="font-medium">{row.rating}</span>
        </div>
      ),
    },
    {
      key: 'lastInvoice',
      label: 'Last Invoice',
      render: (row) => formatDate(row.lastInvoice),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'Active'
              ? 'success'
              : row.status === 'Pending'
              ? 'warning'
              : 'default'
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  // Actions column
  const actionsRender = (row: Vendor) => (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleView(row)}
        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        title="View Details"
      >
        <EyeIcon className="w-5 h-5" />
      </motion.button>
    </div>
  );

  // Toolbar
  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or specialty..."
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={selectedHostelId}
          onChange={setSelectedHostelId}
          options={hostelOptions}
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

  const handleView = (vendor: Vendor) => {
    setViewModal({ isOpen: true, vendor });
    setDetailTab('details');
  };

  const handleScoreClick = (vendor: Vendor) => {
    setCurrentScoreVendor(vendor);
    const vendorId = typeof vendor.id === 'number' ? vendor.id : Number(vendor.id);
    const existingScore = getScore(vendorId);
    if (existingScore) {
      setScoreForm({
        behavior: existingScore.behavior,
        punctuality: existingScore.punctuality,
        quality: existingScore.quality || existingScore.cleanliness || 5,
        remarks: existingScore.remarks || '',
      });
    } else {
      setScoreForm({
        behavior: 5,
        punctuality: 5,
        quality: 5,
        remarks: '',
      });
    }
    setIsScoreModalOpen(true);
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScoreVendor) return;

    const vendorId = typeof currentScoreVendor.id === 'number' ? currentScoreVendor.id : Number(currentScoreVendor.id);
    const scoreRecord = saveScore(vendorId, scoreForm);

    setToast({
      open: true,
      type: 'success',
      message: `Score updated successfully! Overall: ${scoreRecord.average.toFixed(1)}/5`,
    });

    setIsScoreModalOpen(false);
    
    // Refresh modal data if open
    if (viewModal.isOpen && viewModal.vendor?.id === currentScoreVendor.id) {
      setViewModal({ ...viewModal });
    }
  };

  const handleScoreClose = () => {
    setIsScoreModalOpen(false);
    setCurrentScoreVendor(null);
    setScoreForm({
      behavior: 5,
      punctuality: 5,
      quality: 5,
      remarks: '',
    });
  };

  const calculateAverage = () => {
    return ((scoreForm.behavior + scoreForm.punctuality + scoreForm.quality) / 3).toFixed(1);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vendorData = {
      ...formData,
      hostelId: formData.hostelId ? Number(formData.hostelId) : undefined,
    };
    console.log('New Vendor:', vendorData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      specialty: '',
      phone: '',
      email: '',
      rating: '5',
      hostelId: '',
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vendors</h1>
            <p className="text-slate-600 mt-1">
              Manage service providers and suppliers
              {selectedHostelId && (
                <span className="ml-2 text-purple-600 font-medium">
                  • {hostelsData.find((h: any) => h.id === Number(selectedHostelId))?.name || 'Selected Hostel'}
                </span>
              )}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            <UserPlusIcon className="w-5 h-5" />
            Add Vendor
          </motion.button>
        </div>

        {/* Data table */}
        <DataTable
          columns={columns}
          data={filteredData}
          toolbar={toolbar}
          emptyMessage="No vendors found."
          actionsRender={actionsRender}
        />
      </div>

      {/* Add Vendor Modal */}
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
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <UserPlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add New Vendor</h2>
                    <p className="text-purple-100 text-sm">Fill in the vendor details</p>
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
                {/* Vendor Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company/Vendor Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="ABC Services"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialty/Service Type *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Plumbing, Electrical, Catering, etc."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                        Assign to Hostel (Optional)
                      </label>
                      <select
                        value={formData.hostelId}
                        onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">All Hostels (Default)</option>
                        {(hostelsData as Hostel[]).map((hostel) => (
                          <option key={hostel.id} value={String(hostel.id)}>
                            {hostel.name} - {hostel.city}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Leave as "All Hostels" to make this vendor available for all properties
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="vendor@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (1-5)
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                        <option value="2">⭐⭐ (2 Stars)</option>
                        <option value="1">⭐ (1 Star)</option>
                      </select>
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
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    Add Vendor
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Vendor Modal */}
      {viewModal.isOpen && viewModal.vendor && (
        <Modal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, vendor: null })}
          title={`Vendor Details - ${viewModal.vendor.name}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setDetailTab('details')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  detailTab === 'details'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setDetailTab('scorecard')}
                className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  detailTab === 'scorecard'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrophyIcon className="w-4 h-4" />
                Score Card 🏆
              </button>
            </div>

            {/* Tab Content */}
            {detailTab === 'details' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Name" value={viewModal.vendor.name} />
                <InfoField label="Status" value={viewModal.vendor.status} />
                <InfoField label="Specialty" value={viewModal.vendor.specialty} />
                <InfoField label="Phone" value={viewModal.vendor.phone} />
                <InfoField label="Email" value={viewModal.vendor.email || 'N/A'} />
                <InfoField label="Rating" value={`${viewModal.vendor.rating}/5`} />
                <InfoField label="Last Invoice" value={formatDate(viewModal.vendor.lastInvoice)} />
                <InfoField 
                  label="Hostel" 
                  value={
                    viewModal.vendor.hostelId 
                      ? (hostelsData as Hostel[]).find(h => h.id === viewModal.vendor!.hostelId)?.name || 'All Hostels'
                      : 'All Hostels'
                  } 
                />
              </div>
            ) : (
              <VendorScoreCardView
                vendor={viewModal.vendor}
                onUpdateClick={() => handleScoreClick(viewModal.vendor!)}
                getScore={getScore}
                getScoreHistory={getScoreHistory}
              />
            )}
          </div>
        </Modal>
      )}

      {/* Score Update Modal */}
      <Modal
        isOpen={isScoreModalOpen}
        onClose={handleScoreClose}
        title={`${currentScoreVendor ? `Update Score - ${currentScoreVendor.name}` : 'Update Score'}`}
        size="lg"
      >
        <form onSubmit={handleScoreSubmit} className="space-y-6">
          {/* Behavior */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Behavior <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scoreForm.behavior}
                onChange={(e) => setScoreForm({ ...scoreForm, behavior: Number(e.target.value) })}
                className="flex-1"
                required
              />
              <div className="flex items-center gap-1 min-w-[100px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-6 h-6 ${
                      star <= scoreForm.behavior
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-700">{scoreForm.behavior}/5</span>
              </div>
            </div>
          </div>

          {/* Punctuality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Punctuality <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scoreForm.punctuality}
                onChange={(e) => setScoreForm({ ...scoreForm, punctuality: Number(e.target.value) })}
                className="flex-1"
                required
              />
              <div className="flex items-center gap-1 min-w-[100px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-6 h-6 ${
                      star <= scoreForm.punctuality
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-700">{scoreForm.punctuality}/5</span>
              </div>
            </div>
          </div>

          {/* Service Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Quality <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scoreForm.quality}
                onChange={(e) => setScoreForm({ ...scoreForm, quality: Number(e.target.value) })}
                className="flex-1"
                required
              />
              <div className="flex items-center gap-1 min-w-[100px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-6 h-6 ${
                      star <= scoreForm.quality
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-700">{scoreForm.quality}/5</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <textarea
              value={scoreForm.remarks}
              onChange={(e) => setScoreForm({ ...scoreForm, remarks: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Add any additional notes or comments..."
            />
          </div>

          {/* Live Average Score */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Score:</span>
              <div className="flex items-center gap-2">
                <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold text-gray-900">{calculateAverage()}</span>
                <span className="text-gray-600">/ 5</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleScoreClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={TrophyIcon}>
              Save Score
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
};

// Helper component for Info Field
const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-slate-50 rounded-lg p-3">
    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</p>
    <p className="text-slate-900 font-medium break-words">{value || '-'}</p>
  </div>
);

// Vendor Score Card View Component
interface VendorScoreCardViewProps {
  vendor: Vendor;
  onUpdateClick: () => void;
  getScore: (id: number) => any;
  getScoreHistory: (id: number) => any[];
}

const VendorScoreCardView: React.FC<VendorScoreCardViewProps> = ({
  vendor,
  onUpdateClick,
  getScore,
  getScoreHistory,
}) => {
  const vendorId = typeof vendor.id === 'number' ? vendor.id : Number(vendor.id);
  const currentScore = getScore(vendorId);
  const scoreHistory = getScoreHistory(vendorId);

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    if (score >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Average';
    if (score >= 1.5) return 'Below Average';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Current Score Display */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Performance Score</h3>
            <p className="text-sm text-gray-600">{vendor.name}</p>
          </div>
          <Button variant="primary" onClick={onUpdateClick} icon={TrophyIcon}>
            Add / Update Score
          </Button>
        </div>

        {currentScore ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(currentScore.average)}`}>
                  {currentScore.average.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 mt-1">/ 5.0</div>
                <div className={`text-sm font-medium mt-2 ${getScoreColor(currentScore.average)}`}>
                  {getScoreLabel(currentScore.average)}
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Behavior</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-4 h-4 ${
                            star <= currentScore.behavior
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {currentScore.behavior}/5
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Punctuality</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-4 h-4 ${
                            star <= currentScore.punctuality
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {currentScore.punctuality}/5
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Service Quality</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (currentScore.quality || currentScore.cleanliness || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {currentScore.quality || currentScore.cleanliness || 0}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {currentScore.remarks && (
              <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Remarks:</span> {currentScore.remarks}
                </p>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Last updated: {new Date(currentScore.date).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No score recorded yet.</p>
            <Button variant="primary" onClick={onUpdateClick} icon={TrophyIcon}>
              Add Score
            </Button>
          </div>
        )}
      </div>

      {/* Score History */}
      {scoreHistory.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Score History</h4>
          <div className="space-y-3">
            {scoreHistory.map((record: any, index: number) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className={`text-lg font-bold ${getScoreColor(record.average)}`}>
                      {record.average.toFixed(1)}/5
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                  <div>Behavior: {record.behavior}/5</div>
                  <div>Punctuality: {record.punctuality}/5</div>
                  <div>Quality: {record.quality || record.cleanliness || 0}/5</div>
                </div>
                {record.remarks && (
                  <p className="text-sm text-gray-700 mt-2 italic">"{record.remarks}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;

