/**
 * VendorForm Component
 * Sidebar-based form for viewing vendors (and potentially adding/editing)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select } from '../../../components/Select';
import { 
  UserIcon,
  BriefcaseIcon,
  XMarkIcon,
  DocumentTextIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../../../../services/api.config';

interface VendorFormData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  location: string;
  category: string;
  specialties: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  rating: string;
  hostelId: string;
  paymentTerms: string;
  status: string;
  attachments: any[];
}

interface VendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: VendorFormData) => Promise<void>;
  editingId: number | null;
  initialData?: Partial<VendorFormData>;
  hostelOptions: Array<{ value: string; label: string }>;
  hostelsLoading: boolean;
  isReadOnly?: boolean;
}

type ActiveTab = 'personal' | 'business' | 'services';

const VendorForm: React.FC<VendorFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingId,
  initialData,
  hostelOptions,
  hostelsLoading,
  isReadOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('personal');
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    location: '',
    category: '',
    specialties: [{ id: '1', name: '', description: '' }],
    rating: '4.5',
    hostelId: '',
    paymentTerms: 'prepaid',
    status: 'active',
    attachments: [],
  });

  // Load initial data
  useEffect(() => {
    if (!isOpen) return;
    
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setActiveTab('personal');
    } else if (!editingId) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        address: '',
        location: '',
        category: '',
        specialties: [{ id: '1', name: '', description: '' }],
        rating: '4.5',
        hostelId: '',
        paymentTerms: 'prepaid',
        status: 'active',
        attachments: [],
      });
      setActiveTab('personal');
    }
  }, [initialData, editingId, isOpen]);

  const handleNext = () => {
    if (activeTab === 'personal') {
      setActiveTab('business');
    } else if (activeTab === 'business') {
      setActiveTab('services');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReadOnly) {
      await onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      />
      
      {/* Modal with Sidebar */}
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
                <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                <h2 className="text-lg font-semibold text-white">Vendor Info</h2>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-2">
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">Basic Contact</span>
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'business'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <BuildingStorefrontIcon className="w-5 h-5" />
                <span className="font-medium">Business Details</span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'services'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span className="font-medium">Services & Specialized</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase">
                  {isReadOnly ? 'VIEW ' : ''}
                  {activeTab === 'personal' && 'BASIC CONTACT'}
                  {activeTab === 'business' && 'BUSINESS DETAILS'}
                  {activeTab === 'services' && 'SERVICES & SPECIALIZED'}
                </h3>
                <span className="block w-12 h-1 bg-purple-500 mt-1" />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                {/* Tab Content - Personal */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Vendor Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isReadOnly}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="Vendor Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled={isReadOnly}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="vendor@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          disabled={isReadOnly}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Hostel <span className="text-red-500">*</span>
                        </label>
                        <Select
                          disabled={isReadOnly}
                          value={formData.hostelId}
                          onChange={(value) => setFormData({ ...formData, hostelId: value })}
                          options={hostelOptions.filter(opt => opt.value !== '')}
                          placeholder={hostelsLoading ? "Loading hostels..." : "Select Hostel"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Business */}
                {activeTab === 'business' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="Business/Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Category
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="e.g., Maintenance, Supplies"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="Full physical address"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Location (Google Maps Link)
                        </label>
                        <input
                          type="url"
                          disabled={isReadOnly}
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Payment Terms
                        </label>
                        <Select
                          disabled={isReadOnly}
                          value={formData.paymentTerms}
                          onChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                          options={[
                            { value: 'prepaid', label: 'Prepaid' },
                            { value: 'postpaid', label: 'Postpaid' },
                            { value: 'net-30', label: 'Net 30' },
                            { value: 'on-delivery', label: 'On Delivery' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Rating
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.5"
                            disabled={isReadOnly}
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                            className="flex-1 accent-purple-600"
                          />
                          <span className="text-lg font-bold text-purple-600 w-8">{formData.rating}</span>
                          <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Services */}
                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2 flex items-center gap-2">
                        <BriefcaseIcon className="w-4 h-4 text-purple-500" />
                        Specialties & Services
                      </h4>
                      
                      {formData.specialties.map((specialty, index) => (
                        <div key={specialty.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm relative group">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Service Name</label>
                              <input
                                type="text"
                                disabled={isReadOnly}
                                value={specialty.name}
                                onChange={(e) => {
                                  const newSpecialties = [...formData.specialties];
                                  newSpecialties[index].name = e.target.value;
                                  setFormData({ ...formData, specialties: newSpecialties });
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50"
                                placeholder="Plumbing, Electrical, etc."
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                              <input
                                type="text"
                                disabled={isReadOnly}
                                value={specialty.description}
                                onChange={(e) => {
                                  const newSpecialties = [...formData.specialties];
                                  newSpecialties[index].description = e.target.value;
                                  setFormData({ ...formData, specialties: newSpecialties });
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50"
                                placeholder="Briefly describe the service"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {formData.attachments && formData.attachments.length > 0 && (
                      <div className="space-y-4 mt-8">
                        <h4 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                          Documents & Attachments
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {formData.attachments.map((doc, index) => {
                            const docUrl = doc.url ? (doc.url.startsWith('http') ? doc.url : `${API_BASE_URL.replace('/api', '')}${doc.url}`) : '';
                            const docName = doc.originalName || doc.name || 'Attachment';
                            return (
                              <div key={index} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3 shadow-sm">
                                <DocumentTextIcon className="w-8 h-8 text-purple-500 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-slate-900 truncate" title={docName}>{docName}</p>
                                  {docUrl && (
                                    <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-600 hover:text-purple-800 font-bold">
                                      VIEW FILE
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {isReadOnly ? 'Close' : 'Cancel'}
                </button>
                {activeTab !== 'services' ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  !isReadOnly && (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      {editingId ? 'Update Vendor' : 'Save'}
                    </button>
                  )
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VendorForm;
