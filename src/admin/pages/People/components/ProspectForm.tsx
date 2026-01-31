/**
 * ProspectForm Component
 * Sidebar-based form for adding/editing prospects (potential tenants)
 * Same functionality and fields as TenantForm but WITHOUT Hostel Info tab
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select } from '../../../components/Select';
import { 
  UserIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../../../../services/api.config';

interface ProspectFormData {
  // Personal Information
  fullName: string;
  fatherName: string;
  firstName?: string; // Keep for backward compatibility
  lastName?: string; // Keep for backward compatibility
  email: string;
  phone: string;
  whatsappNumber: string;
  gender: string;
  genderOther: string;
  dateOfBirth: string;
  cnicNumber: string;
  profilePhoto: File | null;
  attachments: FileList | null;
  previousProfilePhoto: string | null;
  previousAttachments: any[] | null;
  
  // Professional
  professionType: string; // student, job, business
  // Student fields
  academicName: string;
  academicAddress: string;
  academicLocation: string;
  studentCardNo: string;
  academicAttachments: FileList | null;
  // Job fields
  jobTitle: string;
  companyName: string;
  jobAddress: string;
  jobLocation: string;
  jobIdNo: string;
  jobAttachments: FileList | null;
  // Business fields
  businessName: string;
  businessAddress: string;
  businessLocation: string;
  businessAttachments: FileList | null;
  // Description
  professionDescription: string;
  
  // Emergency
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactWhatsapp: string;
  emergencyContactRelation: string;
  emergencyContactRelationOther: string;
  anyDisease: string;
  bloodGroup: string;
  // Nearest Relative
  nearestRelativeContact: string;
  nearestRelativeWhatsapp: string;
  nearestRelativeRelation: string;
  nearestRelativeRelationOther: string;
}

interface ProspectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ProspectFormData) => Promise<void>;
  editingId: number | null;
  initialData?: Partial<ProspectFormData>;
}

type ActiveTab = 'personal' | 'professional' | 'emergency';

const ProspectForm: React.FC<ProspectFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingId,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('personal');

  const [formData, setFormData] = useState<ProspectFormData>({
    fullName: '',
    fatherName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    gender: '',
    genderOther: '',
    dateOfBirth: '',
    cnicNumber: '',
    profilePhoto: null,
    attachments: null,
    previousProfilePhoto: null,
    previousAttachments: null,
    professionType: '',
    academicName: '',
    academicAddress: '',
    academicLocation: '',
    studentCardNo: '',
    academicAttachments: null,
    jobTitle: '',
    companyName: '',
    jobAddress: '',
    jobLocation: '',
    jobIdNo: '',
    jobAttachments: null,
    businessName: '',
    businessAddress: '',
    businessLocation: '',
    businessAttachments: null,
    professionDescription: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactWhatsapp: '',
    emergencyContactRelation: '',
    emergencyContactRelationOther: '',
    anyDisease: '',
    bloodGroup: '',
    nearestRelativeContact: '',
    nearestRelativeWhatsapp: '',
    nearestRelativeRelation: '',
    nearestRelativeRelationOther: '',
  });

  // Load initial data when editing, reset when adding
  useEffect(() => {
    if (!isOpen) return;
    
    if (initialData && editingId) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setActiveTab('personal');
    } else if (!editingId) {
      setFormData({
        fullName: '',
        fatherName: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        gender: '',
        genderOther: '',
        dateOfBirth: '',
        cnicNumber: '',
        profilePhoto: null,
        attachments: null,
        previousProfilePhoto: null,
        previousAttachments: null,
        professionType: '',
        academicName: '',
        academicAddress: '',
        academicLocation: '',
        studentCardNo: '',
        academicAttachments: null,
        jobTitle: '',
        companyName: '',
        jobAddress: '',
        jobLocation: '',
        jobIdNo: '',
        jobAttachments: null,
        businessName: '',
        businessAddress: '',
        businessLocation: '',
        businessAttachments: null,
        professionDescription: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        emergencyContactWhatsapp: '',
        emergencyContactRelation: '',
        emergencyContactRelationOther: '',
        anyDisease: '',
        bloodGroup: '',
        nearestRelativeContact: '',
        nearestRelativeWhatsapp: '',
        nearestRelativeRelation: '',
        nearestRelativeRelationOther: '',
      });
      setActiveTab('personal');
    }
  }, [initialData, editingId, isOpen]);

  const handleNext = () => {
    if (activeTab === 'personal') {
      setActiveTab('professional');
    } else if (activeTab === 'professional') {
      setActiveTab('emergency');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 13) {
      setFormData({ ...formData, cnicNumber: value });
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
                <UserIcon className="w-6 h-6 text-white" />
                <h2 className="text-lg font-semibold text-white">Prospect Info</h2>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-2">
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">Personal Information</span>
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'professional'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span className="font-medium">Professional</span>
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'emergency'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span className="font-medium">Emergency</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activeTab === 'personal' && 'PERSONAL INFORMATION'}
                  {activeTab === 'professional' && 'PROFESSIONAL'}
                  {activeTab === 'emergency' && 'EMERGENCY'}
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

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                {/* Tab Content - Personal */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Father Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fatherName}
                          onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Father's Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={formData.gender}
                          onChange={(value) => setFormData({ ...formData, gender: value, genderOther: value !== 'other' ? '' : formData.genderOther })}
                          options={[
                            { value: '', label: 'Select Gender' },
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' },
                          ]}
                        />
                        {formData.gender === 'other' && (
                          <input
                            type="text"
                            value={formData.genderOther}
                            onChange={(e) => setFormData({ ...formData, genderOther: e.target.value })}
                            className="w-full mt-2 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Please specify"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          CNIC Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cnicNumber}
                          onChange={handleCNICChange}
                          maxLength={13}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1234512345671"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter 13 digits only</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Profile Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFormData({ ...formData, profilePhoto: file });
                          }}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.profilePhoto && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected: {formData.profilePhoto.name}
                          </p>
                        )}
                        {editingId && formData.previousProfilePhoto && !formData.profilePhoto && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Current Profile Photo:</p>
                            <img
                              src={`${API_BASE_URL.replace('/api', '')}${formData.previousProfilePhoto}`}
                              alt="Current profile"
                              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Attachment
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            setFormData({ ...formData, attachments: e.target.files });
                          }}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.attachments && formData.attachments.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected: {formData.attachments.length} file(s)
                          </p>
                        )}
                        {editingId && formData.previousAttachments && formData.previousAttachments.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Current Attachments:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {formData.previousAttachments.map((doc: any, idx: number) => {
                                const isImage = doc.mimetype?.startsWith('image/') || 
                                  /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(doc.originalName || doc.filename || '');
                                const docUrl = `${API_BASE_URL.replace('/api', '')}${doc.url}`;
                                const docName = doc.originalName || doc.filename || 'Document';
                                
                                return (
                                  <div
                                    key={doc.id || doc.url || `prospect-attachment-${idx}`}
                                    className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                                  >
                                    {isImage ? (
                                      <a
                                        href={docUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                      >
                                        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                                          <img
                                            src={docUrl}
                                            alt={docName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              target.style.display = 'none';
                                            }}
                                          />
                                        </div>
                                        <div className="p-2 bg-white border-t border-gray-200">
                                          <p className="text-xs text-gray-700 font-medium truncate" title={docName}>
                                            {docName}
                                          </p>
                                        </div>
                                      </a>
                                    ) : (
                                      <a
                                        href={docUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3"
                                      >
                                        <DocumentTextIcon className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span className="text-xs text-gray-700 truncate" title={docName}>
                                          {docName}
                                        </span>
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Professional */}
                {activeTab === 'professional' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Profession Type
                        </label>
                        <Select
                          value={formData.professionType}
                          onChange={(value) => setFormData({ ...formData, professionType: value })}
                          options={[
                            { value: '', label: 'Select Profession Type' },
                            { value: 'student', label: 'Student' },
                            { value: 'job', label: 'Job' },
                            { value: 'business', label: 'Business' },
                          ]}
                        />
                      </div>

                      {/* Student Fields */}
                      {formData.professionType === 'student' && (
                        <>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Academic Name
                            </label>
                            <input
                              type="text"
                              value={formData.academicName}
                              onChange={(e) => setFormData({ ...formData, academicName: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Institution/University Name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={formData.academicAddress}
                              onChange={(e) => setFormData({ ...formData, academicAddress: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Academic Address"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Location (Google Maps Link)
                            </label>
                            <input
                              type="url"
                              value={formData.academicLocation}
                              onChange={(e) => setFormData({ ...formData, academicLocation: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Student Card No (Registration Number)
                            </label>
                            <input
                              type="text"
                              value={formData.studentCardNo}
                              onChange={(e) => setFormData({ ...formData, studentCardNo: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Registration Number"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Attachments
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,image/*"
                              multiple
                              onChange={(e) => {
                                setFormData({ ...formData, academicAttachments: e.target.files });
                              }}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.academicAttachments && formData.academicAttachments.length > 0 && (
                              <p className="text-sm text-gray-600 mt-1">
                                Selected: {formData.academicAttachments.length} file(s)
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {/* Job Fields */}
                      {formData.professionType === 'job' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={formData.jobTitle}
                              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Job Title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Company Name
                            </label>
                            <input
                              type="text"
                              value={formData.companyName}
                              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Company Name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={formData.jobAddress}
                              onChange={(e) => setFormData({ ...formData, jobAddress: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Job Address"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Location (Google Maps Link)
                            </label>
                            <input
                              type="url"
                              value={formData.jobLocation}
                              onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              ID No
                            </label>
                            <input
                              type="text"
                              value={formData.jobIdNo}
                              onChange={(e) => setFormData({ ...formData, jobIdNo: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Employee ID"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Attachments
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,image/*"
                              multiple
                              onChange={(e) => {
                                setFormData({ ...formData, jobAttachments: e.target.files });
                              }}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.jobAttachments && formData.jobAttachments.length > 0 && (
                              <p className="text-sm text-gray-600 mt-1">
                                Selected: {formData.jobAttachments.length} file(s)
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {/* Business Fields */}
                      {formData.professionType === 'business' && (
                        <>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Business Name
                            </label>
                            <input
                              type="text"
                              value={formData.businessName}
                              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Business Name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={formData.businessAddress}
                              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Business Address"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Location (Google Maps Link)
                            </label>
                            <input
                              type="url"
                              value={formData.businessLocation}
                              onChange={(e) => setFormData({ ...formData, businessLocation: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Attachments
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,image/*"
                              multiple
                              onChange={(e) => {
                                setFormData({ ...formData, businessAttachments: e.target.files });
                              }}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.businessAttachments && formData.businessAttachments.length > 0 && (
                              <p className="text-sm text-gray-600 mt-1">
                                Selected: {formData.businessAttachments.length} file(s)
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {/* Description - Always shown */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.professionDescription}
                          onChange={(e) => setFormData({ ...formData, professionDescription: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter description..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Emergency */}
                {activeTab === 'emergency' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter emergency contact name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Emergency Contact Number
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyContactNumber}
                          onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Emergency Contact WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyContactWhatsapp}
                          onChange={(e) => setFormData({ ...formData, emergencyContactWhatsapp: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Relation
                        </label>
                        <Select
                          value={formData.emergencyContactRelation}
                          onChange={(value) => setFormData({ ...formData, emergencyContactRelation: value, emergencyContactRelationOther: value !== 'other' ? '' : formData.emergencyContactRelationOther })}
                          options={[
                            { value: '', label: 'Select Relation' },
                            { value: 'father', label: 'Father' },
                            { value: 'mother', label: 'Mother' },
                            { value: 'brother', label: 'Brother' },
                            { value: 'sister', label: 'Sister' },
                            { value: 'spouse', label: 'Spouse' },
                            { value: 'son', label: 'Son' },
                            { value: 'daughter', label: 'Daughter' },
                            { value: 'friend', label: 'Friend' },
                            { value: 'other', label: 'Other' },
                          ]}
                        />
                        {formData.emergencyContactRelation === 'other' && (
                          <input
                            type="text"
                            value={formData.emergencyContactRelationOther}
                            onChange={(e) => setFormData({ ...formData, emergencyContactRelationOther: e.target.value })}
                            className="w-full mt-2 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Please specify"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Any Disease
                        </label>
                        <input
                          type="text"
                          value={formData.anyDisease}
                          onChange={(e) => setFormData({ ...formData, anyDisease: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter any disease"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Blood Group
                        </label>
                        <input
                          type="text"
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., A+, B-, O+"
                        />
                      </div>
                    </div>

                    {/* Nearest Relative Section */}
                    <div className="mt-8 pt-6 border-t border-slate-300">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">Nearest Relative under 80 KM</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contact Number
                          </label>
                          <input
                            type="tel"
                            value={formData.nearestRelativeContact}
                            onChange={(e) => setFormData({ ...formData, nearestRelativeContact: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            value={formData.nearestRelativeWhatsapp}
                            onChange={(e) => setFormData({ ...formData, nearestRelativeWhatsapp: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Relation
                          </label>
                          <Select
                            value={formData.nearestRelativeRelation}
                            onChange={(value) => setFormData({ ...formData, nearestRelativeRelation: value, nearestRelativeRelationOther: value !== 'other' ? '' : formData.nearestRelativeRelationOther })}
                            options={[
                              { value: '', label: 'Select Relation' },
                              { value: 'father', label: 'Father' },
                              { value: 'mother', label: 'Mother' },
                              { value: 'brother', label: 'Brother' },
                              { value: 'sister', label: 'Sister' },
                              { value: 'spouse', label: 'Spouse' },
                              { value: 'son', label: 'Son' },
                              { value: 'daughter', label: 'Daughter' },
                              { value: 'friend', label: 'Friend' },
                              { value: 'other', label: 'Other' },
                            ]}
                          />
                          {formData.nearestRelativeRelation === 'other' && (
                            <input
                              type="text"
                              value={formData.nearestRelativeRelationOther}
                              onChange={(e) => setFormData({ ...formData, nearestRelativeRelationOther: e.target.value })}
                              className="w-full mt-2 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Please specify"
                            />
                          )}
                        </div>
                      </div>
                    </div>
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
                  Cancel
                </button>
                {activeTab !== 'emergency' ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    {editingId ? 'Update Prospect' : 'Save'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProspectForm;
export type { ProspectFormData };
