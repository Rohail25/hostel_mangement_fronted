import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOfficeIcon,
  XMarkIcon,
  Cog6ToothIcon,
  CameraIcon,
  PhotoIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Select } from './Select';
import type { HostelFormData } from '../types/hostel';

interface AddHostelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingHostel?: any; // Hostel data for editing
}

export const AddHostelForm: React.FC<AddHostelFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingHostel,
}) => {
  const [activeTab, setActiveTab] = useState<'hostelInfo' | 'hostelSettings' | 'arrangementManagement'>('hostelInfo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    street: '',
    description: '',
    hostelImage: null as File | null,
    hostelImagePreview: '',
    category: '',
    type: '',
    checkInTime: '',
    checkOutTime: '',
    mapLink: '',
    totalFloors: '',
    totalRooms: '',
    totalBeds: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or editingHostel changes
  useEffect(() => {
    if (isOpen) {
      if (editingHostel) {
        // Populate form with editing hostel data
        // Note: You may need to fetch full hostel details from API
        setFormData({
          name: editingHostel.name || '',
          email: '', // May need to fetch from API
          phone: editingHostel.managerPhone || '',
          country: '', // May need to fetch from API
          state: '', // May need to fetch from API
          city: editingHostel.city || '',
          street: '', // May need to fetch from API
          description: editingHostel.notes || '',
          hostelImage: null,
          hostelImagePreview: '',
          category: '', // May need to fetch from API
          type: '', // May need to fetch from API
          checkInTime: '9:00AM', // Default or fetch from API
          checkOutTime: '6:00PM', // Default or fetch from API
          mapLink: editingHostel.mapLink || '',
          totalFloors: editingHostel.totalFloors?.toString() || '',
          totalRooms: editingHostel.totalRooms?.toString() || '',
          totalBeds: editingHostel.totalBeds?.toString() || '',
        });
      } else {
        // Reset form for new hostel
        setFormData({
    name: '',
          email: '',
          phone: '',
          country: '',
          state: '',
    city: '',
          street: '',
          description: '',
          hostelImage: null,
          hostelImagePreview: '',
          category: '',
          type: '',
          checkInTime: '9:00AM',
          checkOutTime: '6:00PM',
          mapLink: '',
          totalFloors: '',
          totalRooms: '',
          totalBeds: '',
  });
      }
      setActiveTab('hostelInfo');
      setErrors({});
    }
  }, [isOpen, editingHostel]);

  // Category options (frontend labels differ from backend values)
  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'luxury', label: 'Hotel Botek' },
    { value: 'back_pack', label: 'Back Pack' },
    { value: 'home2', label: 'Second Home' },
  ];

  // Category comments mapping
  const categoryComments: Record<string, string> = {
    'home2': 'This is long stage like students, job person, back pack',
    'luxury': 'This is 3-6 days',
    'back_pack': 'This is for backpackers and short-term stays',
  };

  // Type options
  const typeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'boy', label: 'Boy' },
    { value: 'girl', label: 'Girl' },
    { value: 'family', label: 'Family' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Hostel Info validation
    if (!formData.name.trim()) {
      newErrors.name = 'Hostel name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Street is required';
    }

    // Hostel Settings validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    if (!formData.checkInTime) {
      newErrors.checkInTime = 'Check-in time is required';
    }
    if (!formData.checkOutTime) {
      newErrors.checkOutTime = 'Check-out time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: {
          country: formData.country.trim(),
          state: formData.state.trim(),
          city: formData.city.trim(),
          street: formData.street.trim(),
        },
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        operatingHours: {
          checkIn: formData.checkInTime,
          checkOut: formData.checkOutTime,
        },
        hostelImage: formData.hostelImage,
        mapLink: formData.mapLink.trim(),
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : 0,
        totalRooms: formData.totalRooms ? parseInt(formData.totalRooms) : 0,
        totalBeds: formData.totalBeds ? parseInt(formData.totalBeds) : 0,
      };

      await onSubmit(submitData);

      // Reset form
      handleClose();
    } catch (error: any) {
      console.error('Error submitting hostel form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      street: '',
      description: '',
      hostelImage: null,
      hostelImagePreview: '',
      category: '',
      type: '',
      checkInTime: '',
      checkOutTime: '',
      mapLink: '',
      totalFloors: '',
      totalRooms: '',
      totalBeds: '',
    });
    setErrors({});
    setActiveTab('hostelInfo');
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          hostelImage: file,
          hostelImagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      hostelImage: null,
      hostelImagePreview: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Effect to handle body overflow when modal is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                    <h2 className="text-lg font-semibold text-white">Hostel Info</h2>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 p-4 space-y-2">
                  <button
                    onClick={() => setActiveTab('hostelInfo')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'hostelInfo'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    <span className="font-medium">Hostel Info</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('hostelSettings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'hostelSettings'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span className="font-medium">Hostel Settings</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('arrangementManagement')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'arrangementManagement'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    <span className="font-medium">Hostel Arrangements</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeTab === 'hostelInfo' && 'HOSTEL INFO'}
                      {activeTab === 'hostelSettings' && 'HOSTEL SETTINGS'}
                      {activeTab === 'arrangementManagement' && 'HOSTEL ARRANGEMENTS'}
                    </h3>
                    <span className="block w-12 h-1 bg-pink-500 mt-1" />
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'hostelInfo' && (
                      <div className="space-y-6">
                        {/* Hostel Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Hostel Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter hostel name"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

                        {/* Email and Phone Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="hostel@example.com"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="03001234567"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                          </div>
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-6">
                          {/* Country and State Row */}
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Country <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                placeholder="Enter country"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                              {errors.country && (
                                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                State <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                placeholder="Enter state"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                              {errors.state && (
                                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                              )}
                            </div>
                          </div>

                          {/* City and Street Row */}
                          <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="Enter city"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Street <span className="text-red-500">*</span>
            </label>
            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                placeholder="Enter street address"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
            />
                              {errors.street && (
                                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
          </div>
                          </div>
                        </div>

                        {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
            </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            placeholder="Enter hostel description..."
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Hostel Map Link */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Hostel Map (Google Map Link)
                          </label>
                          <input
                            type="url"
                            value={formData.mapLink}
                            onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                            placeholder="https://maps.google.com/..."
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            Enter the Google Maps link for the hostel location
                          </p>
                        </div>

                        {/* Hostel Image Upload */}
                        <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-200">
                          <div className="relative group">
                            <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white ring-offset-2 ring-offset-slate-50">
                              {formData.hostelImagePreview ? (
                                <img
                                  src={formData.hostelImagePreview}
                                  alt="Hostel"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BuildingOfficeIcon className="w-20 h-20 text-white" />
                              )}
                            </div>
                            {formData.hostelImagePreview && (
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600 transition-colors shadow-lg"
                                title="Remove image"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            )}
                            <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer" onClick={handleImageClick}>
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
                              onClick={handleImageClick}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                              <PhotoIcon className="w-5 h-5" />
                              <span className="font-medium">Upload Hostel Image</span>
                            </button>
            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                              JPG, PNG or GIF. Max size 2MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'hostelSettings' && (
                      <div className="space-y-6">
                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={formData.category}
                            onChange={(value) => setFormData({ ...formData, category: value })}
                            options={categoryOptions}
                          />
                          {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                          )}
                          {formData.category && categoryComments[formData.category] && (
                            <p className="mt-2 text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                              {categoryComments[formData.category]}
                            </p>
                          )}
                        </div>

                        {/* Type */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Type <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={formData.type}
                            onChange={(value) => setFormData({ ...formData, type: value })}
                            options={typeOptions}
                          />
                          {errors.type && (
                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                          )}
        </div>

                        {/* Operating Hours */}
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5" />
                            Operating Hours
                          </h4>
                          <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Check-in Time <span className="text-red-500">*</span>
            </label>
            <input
                                type="time"
                                value={formData.checkInTime}
                                onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
            />
                              {errors.checkInTime && (
                                <p className="mt-1 text-sm text-red-600">{errors.checkInTime}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Check-out Time <span className="text-red-500">*</span>
            </label>
            <input
                                type="time"
                                value={formData.checkOutTime}
                                onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
            />
                              {errors.checkOutTime && (
                                <p className="mt-1 text-sm text-red-600">{errors.checkOutTime}</p>
            )}
          </div>
        </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'arrangementManagement' && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Specify the total capacity for your hostel. You can add detailed arrangements (specific blocks, rooms, and beds) after creating the hostel using the "Arrange" button.
                          </p>
                        </div>

                        {/* Total Blocks */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Total Blocks
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.totalFloors}
                            onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter total number of blocks/floors"
                          />
                        </div>

                        {/* Total Rooms */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Total Rooms
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.totalRooms}
                            onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter total number of rooms"
                          />
                        </div>

                        {/* Total Seats */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Total Seats (Beds)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.totalBeds}
                            onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter total number of seats/beds"
                          />
                        </div>
                      </div>
                    )}
        </div>

                  {/* Footer Buttons */}
                  <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                    <button
            type="button"
            onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting && (
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                      {isSubmitting ? 'Creating...' : 'Create Hostel'}
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
