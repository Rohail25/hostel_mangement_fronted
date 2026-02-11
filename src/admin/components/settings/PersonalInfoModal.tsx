/**
 * Personal Information Modal Component
 * Extracted from SettingsForm for reusability
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  XMarkIcon,
  IdentificationIcon,
  MapPinIcon,
  CameraIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import type { PersonalInfoModalProps, PersonalInfoFormData } from '../../types/settings';
import { getPersonalInfo, updateProfileInfo } from '../../services/settings.service';
import { API_BASE_URL } from '../../../services/api.config';

export const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'address'>('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    username: '',
    email: '',
    phone: '',
    alternativePhone: '',
    profilePicture: '',
    profilePhotoFile: null,
    phones: [
      { id: '1', type: 'Mobile', number: '' },
    ],
    emails: [],
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Fetch personal info when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPersonalInfo();
    } else {
      // Reset form when modal closes
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const fetchPersonalInfo = async () => {
    setFetching(true);
    setError(null);
    try {
      const data = await getPersonalInfo();
      
      // Map API response to form data
      setFormData((prev) => ({
        ...prev,
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        phones: data.phone ? [{ id: '1', type: 'Mobile', number: data.phone }] : prev.phones,
        // Note: API response doesn't include address or profilePhoto in GET request
        // These will be populated from the update response if available
      }));
    } catch (err: any) {
      console.error('Error fetching personal info:', err);
      setError(err?.message || 'Failed to load personal information');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validate required fields
    const errors: string[] = [];
    
    // Personal Info validation
    if (!formData.username.trim()) {
      errors.push('Username is required');
    }
    if (!formData.email.trim()) {
      errors.push('Email is required');
    }
    if (!formData.phone.trim()) {
      errors.push('Phone is required');
    }
    
    // Address fields are optional (nullable) - no validation needed
    
    if (errors.length > 0) {
      setError('Please fill in all required fields:\n' + errors.join('\n'));
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Prepare data for API call
      // Helper function to safely trim and return undefined if empty
      const safeTrim = (value: string | undefined | null): string | undefined => {
        if (!value) return undefined;
        const trimmed = value.trim();
        return trimmed ? trimmed : undefined;
      };
      
      const updateData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        profilePhoto: formData.profilePhotoFile || formData.profilePicture || undefined,
        address: {
          street1: safeTrim(formData.street1),
          street2: safeTrim(formData.street2),
          city: safeTrim(formData.city),
          state: safeTrim(formData.state),
          zipCode: safeTrim(formData.zipCode),
          country: safeTrim(formData.country),
        },
      };
      
      const response = await updateProfileInfo(updateData);
      
      // Update form with response data (especially profile photo and address)
      if (response.profile) {
        // Construct full URL for profile photo if it's a path
        let profilePhotoUrl = response.profile.profilePhoto || '';
        if (profilePhotoUrl && !profilePhotoUrl.startsWith('http') && !profilePhotoUrl.startsWith('data:')) {
          profilePhotoUrl = `${API_BASE_URL.replace('/api', '')}${profilePhotoUrl}`;
        }
        
        setFormData((prev) => ({
          ...prev,
          profilePicture: profilePhotoUrl || prev.profilePicture,
          city: response.profile.address?.city || prev.city,
          state: response.profile.address?.state || prev.state,
        }));
      }
      
      setSuccess('Personal information updated successfully!');
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error updating personal info:', err);
      setError(err?.message || 'Failed to update personal information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PersonalInfoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhotoFile: file,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      profilePhotoFile: null,
      profilePicture: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhoneChange = (id: string, field: 'type' | 'number', value: string) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.map((phone) =>
        phone.id === id ? { ...phone, [field]: value } : phone
      ),
    }));
  };

  const handleEmailChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails.map((email) =>
        email.id === id ? { ...email, email: value } : email
      ),
    }));
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [...prev.phones, { id: Date.now().toString(), type: 'Mobile', number: '' }],
    }));
  };

  const removePhone = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.filter((phone) => phone.id !== id),
    }));
  };

  const addEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [...prev.emails, { id: Date.now().toString(), email: '' }],
    }));
  };

  const removeEmail = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails.filter((email) => email.id !== id),
    }));
  };

  const sidebarItems = [
    { id: 'personal' as const, label: 'Personal Info', icon: UserCircleIcon },
    { id: 'contact' as const, label: 'Contact Info', icon: IdentificationIcon },
    { id: 'address' as const, label: 'Address', icon: MapPinIcon },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
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
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                    <h2 className="text-lg font-semibold text-white">Personal Info</h2>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 p-4 space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeTab === 'personal' && 'PERSONAL INFO'}
                      {activeTab === 'contact' && 'CONTACT INFO'}
                      {activeTab === 'address' && 'ADDRESS'}
                    </h3>
                    <span className="block w-12 h-1 bg-pink-500 mt-1" />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {/* Form Content - All forms are part of one unified form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                  {/* Error and Success Messages */}
                  {(error || success) && (
                    <div className="px-6 pt-4">
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                          <p className="text-sm whitespace-pre-line">{error}</p>
                        </div>
                      )}
                      {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                          <p className="text-sm">{success}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {fetching ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-slate-600">Loading personal information...</p>
                      </div>
                    </div>
                  ) : (
                  <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'personal' && (
                    <div className="space-y-6">
                      {/* Profile Picture Section - Professional UI */}
                      <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-200">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white ring-offset-2 ring-offset-slate-50">
                            {formData.profilePicture ? (
                              <img
                                src={formData.profilePicture}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserCircleIcon className="w-20 h-20 text-white" />
                            )}
                          </div>
                          {formData.profilePicture && (
                            <button
                              type="button"
                              onClick={handleRemoveProfilePhoto}
                              className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600 transition-colors shadow-lg"
                              title="Remove photo"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          )}
                          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer" onClick={handlePhotoClick}>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                <CameraIcon className="w-6 h-6 text-blue-600" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={handlePhotoClick}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            <PhotoIcon className="w-5 h-5" />
                            <span className="font-medium">Change Profile Picture</span>
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoChange}
                            className="hidden"
                          />
                          <p className="text-xs text-slate-500 mt-2">
                            JPG, PNG or GIF. Max size 2MB
                          </p>
                        </div>
                      </div>

                      {/* Username, Email, Phone Fields - Two per row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Username <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter username"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter email"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div className="space-y-8">
                      {/* Phone Section */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Phone</h4>
                        <div className="space-y-4">
                          {formData.phones.map((phone) => (
                            <div key={phone.id} className="flex gap-4 items-end">
                              <div className="flex-1">
                                <label className="block text-xs text-slate-500 mb-1">
                                  Phone
                                </label>
                                <input
                                  type="tel"
                                  value={phone.number}
                                  onChange={(e) => handlePhoneChange(phone.id, 'number', e.target.value)}
                                  placeholder="(702) 630-0989"
                                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              {formData.phones.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePhone(phone.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Alternative Phone Section */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Alternative Phone</h4>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Alternative Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.alternativePhone}
                            onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
                            placeholder="Enter alternative phone number"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'address' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-6">
                          {/* country */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Country <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          {/* City */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          {/* street 1 */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Street 1 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.street1}
                              onChange={(e) => handleInputChange('street1', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                          {/* State */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              value={formData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Zip Code */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Zip code <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.zipCode}
                              onChange={(e) => handleInputChange('zipCode', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                 
                  </div>
                  )}

                  {/* Footer Buttons - Part of unified form */}
                  <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || fetching}
                      className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading && (
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

