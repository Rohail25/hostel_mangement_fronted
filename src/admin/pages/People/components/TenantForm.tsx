/**
 * TenantForm Component
 * Sidebar-based form for adding/editing tenants
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select } from '../../../components/Select';
import { 
  UserIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  TruckIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../../../../services/api.config';
import * as tenantService from '../../../services/tenant.service';
import { AddHostelForm } from '../../../components/AddHostelForm';

const countryCityMap: Record<string, string[]> = {
  Pakistan: ['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Quetta', 'Multan'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
  India: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'],
  'United Kingdom': ['London', 'Manchester', 'Liverpool', 'Birmingham', 'Leeds'],
};

interface TenantDocument {
  field?: string;
  url?: string;
  filename?: string;
  originalName?: string;
  mimetype?: string;
  size?: number;
  uploadedAt?: string;
}

interface TenantFormData {
  // Personal Information
  fullName: string;
  fatherName: string;
  firstName?: string; // Keep for backward compatibility
  lastName?: string; // Keep for backward compatibility
  email: string;
  phone: string;
  whatsappNumber: string;
  reference: string;
  gender: string;
  genderOther: string;
  dateOfBirth: string;
  cnicNumber: string;
  profilePhoto: File | null;
  attachments: FileList | null;
  previousProfilePhoto: string | null;
  previousAttachments: TenantDocument[] | null;
  address: {
    street: string;
    city: string;
    country: string;
  };
  
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
  emergencyContactNumberCountry: string;
  emergencyContactNumberLocal: string;
  emergencyContactWhatsapp: string;
  emergencyContactWhatsappCountry: string;
  emergencyContactWhatsappLocal: string;
  emergencyContactRelation: string;
  emergencyContactRelationOther: string;
  anyDisease: string;
  diseaseDetails: string;
  bloodGroup: string;
  // Nearest Relative
  nearestRelativeContact: string;
  nearestRelativeContactCountry: string;
  nearestRelativeContactLocal: string;
  nearestRelativeWhatsapp: string;
  nearestRelativeWhatsappCountry: string;
  nearestRelativeWhatsappLocal: string;
  nearestRelativeRelation: string;
  nearestRelativeRelationOther: string;

  // Vehicle/Bike Detail
  vehicleParkingStatus: string;
  vehicleType: string;
  vehicleNumberPlate: string;
  vehicleRegistrationNumber: string;
  vehicleColor: string;
  
  // Hostel Info
  hostelId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: string;
  securityDeposit: string;
  lateFeesFine: string;
  lateFeesPercentage: string;
  lateFeesChargeDate: string;
  rentalDocument: FileList | null;
  securityDepositFile: FileList | null;
  advancedRentReceivedFile: FileList | null;
  otherDocuments: Array<{ documentName: string; documentFile: File | null }>;
  previousRentalDocument: TenantDocument[] | null;
  previousSecurityDepositFile: TenantDocument[] | null;
  previousAdvancedRentReceivedFile: TenantDocument[] | null;
}

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TenantFormData) => Promise<void>;
  editingId: number | null;
  initialData?: Partial<TenantFormData>;
  hostelOptions: Array<{ value: string; label: string }>;
  hostelsLoading: boolean;
  onHostelCreated?: () => void; // Callback when new hostel is created
  isReadOnly?: boolean; // New prop for read-only mode
}

const phoneCountryOptions = [
  { value: '+92', label: 'Pakistan (+92)' },
  { value: '+91', label: 'India (+91)' },
  { value: '+1', label: 'USA (+1)' },
  { value: '+44', label: 'UK (+44)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+971', label: 'UAE (+971)' },
];

const parsePhoneWithCountry = (value: string, defaultCountry = '+92') => {
  if (!value) return { country: defaultCountry, local: '' };
  const normalized = value.trim();
  const match = normalized.match(/^\s*(\+\d{1,4})\s*([0-9\s-]*)$/);
  if (match) {
    return {
      country: match[1],
      local: match[2].replace(/\D/g, ''),
    };
  }

  return {
    country: defaultCountry,
    local: normalized.replace(/\D/g, ''),
  };
};

const getMaxLocalPhoneDigits = (countryCode: string) => {
  switch (countryCode) {
    case '+1':
    case '+44':
    case '+92':
    case '+91':
      return 10;
    case '+61':
      return 9;
    case '+971':
      return 9;
    default:
      return 12;
  }
};

const formatPhoneField = (countryCode: string, localNumber: string) => {
  if (!countryCode) return localNumber;
  return `${countryCode} ${localNumber}`.trim();
};

const vehicleParkingOptions = [
  { value: 'parked', label: 'Parked in Hostel' },
  { value: 'not_parked', label: 'Not Parked in Hostel' },
];

const vehicleTypeOptions = [
  { value: 'bike', label: 'Bike' },
  { value: 'car', label: 'Car' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'van', label: 'Van' },
  { value: 'other', label: 'Other' },
];

type ActiveTab = 'personal' | 'professional' | 'emergency' | 'hostel' | 'vehicle';

const TenantForm: React.FC<TenantFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingId,
  initialData,
  hostelOptions,
  hostelsLoading,
  onHostelCreated,
  isReadOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('personal');
  const [availableFloors, setAvailableFloors] = useState<Array<{ value: string; label: string }>>([]);
  const [availableRooms, setAvailableRooms] = useState<Array<{ value: string; label: string }>>([]);
  const [availableBeds, setAvailableBeds] = useState<Array<{ value: string; label: string }>>([]);
  const [floorsLoading, setFloorsLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [bedsLoading, setBedsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({});
  const [isAddHostelOpen, setIsAddHostelOpen] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<TenantFormData>({
    fullName: '',
    fatherName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    reference: '',
    gender: '',
    genderOther: '',
    dateOfBirth: '',
    cnicNumber: '',
    profilePhoto: null,
    attachments: null,
    previousProfilePhoto: null,
    previousAttachments: null,
    address: {
      street: '',
      city: '',
      country: '',
    },
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
    emergencyContactNumberCountry: '+92',
    emergencyContactNumberLocal: '',
    emergencyContactWhatsapp: '',
    emergencyContactWhatsappCountry: '+92',
    emergencyContactWhatsappLocal: '',
    emergencyContactRelation: '',
    emergencyContactRelationOther: '',
    anyDisease: 'No',
    diseaseDetails: '',
    bloodGroup: '',
    nearestRelativeContact: '',
    nearestRelativeContactCountry: '+92',
    nearestRelativeContactLocal: '',
    nearestRelativeWhatsapp: '',
    nearestRelativeWhatsappCountry: '+92',
    nearestRelativeWhatsappLocal: '',
    nearestRelativeRelation: '',
    nearestRelativeRelationOther: '',
    vehicleParkingStatus: '',
    vehicleType: '',
    vehicleNumberPlate: '',
    vehicleRegistrationNumber: '',
    vehicleColor: '',
    hostelId: '',
    floorId: '',
    roomId: '',
    bedId: '',
    leaseStartDate: '',
    leaseEndDate: '',
    monthlyRent: '',
    securityDeposit: '',
    lateFeesFine: '',
    lateFeesPercentage: '',
    lateFeesChargeDate: '',
    rentalDocument: null,
    securityDepositFile: null,
    advancedRentReceivedFile: null,
    otherDocuments: [],
    previousRentalDocument: null,
    previousSecurityDepositFile: null,
    previousAdvancedRentReceivedFile: null,
  });

  // Load initial data when editing, reset when adding
  useEffect(() => {
    if (!isOpen) return;
    
    if (initialData && editingId) {
      const parsedEmergencyNumber = parsePhoneWithCountry(initialData.emergencyContactNumber || '');
      const parsedEmergencyWhatsapp = parsePhoneWithCountry(initialData.emergencyContactWhatsapp || '');
      const parsedNearestRelativeContact = parsePhoneWithCountry(initialData.nearestRelativeContact || '');
      const parsedNearestRelativeWhatsapp = parsePhoneWithCountry(initialData.nearestRelativeWhatsapp || '');

      setFormData(prev => ({
        ...prev,
        ...initialData,
        emergencyContactNumberCountry: parsedEmergencyNumber.country,
        emergencyContactNumberLocal: parsedEmergencyNumber.local,
        emergencyContactWhatsappCountry: parsedEmergencyWhatsapp.country,
        emergencyContactWhatsappLocal: parsedEmergencyWhatsapp.local,
        nearestRelativeContactCountry: parsedNearestRelativeContact.country,
        nearestRelativeContactLocal: parsedNearestRelativeContact.local,
        nearestRelativeWhatsappCountry: parsedNearestRelativeWhatsapp.country,
        nearestRelativeWhatsappLocal: parsedNearestRelativeWhatsapp.local,
      }));
      setActiveTab('personal');
    } else if (!editingId) {
      setFormData({
        fullName: '',
        fatherName: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        reference: '',
        gender: '',
        genderOther: '',
        dateOfBirth: '',
        cnicNumber: '',
        profilePhoto: null,
        attachments: null,
        previousProfilePhoto: null,
        previousAttachments: null,
        address: {
          street: '',
          city: '',
          country: '',
        },
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
        emergencyContactNumberCountry: '+92',
        emergencyContactNumberLocal: '',
        emergencyContactWhatsapp: '',
        emergencyContactWhatsappCountry: '+92',
        emergencyContactWhatsappLocal: '',
        emergencyContactRelation: '',
        emergencyContactRelationOther: '',
        anyDisease: 'No',
        diseaseDetails: '',
        bloodGroup: '',
        nearestRelativeContact: '',
        nearestRelativeContactCountry: '+92',
        nearestRelativeContactLocal: '',
        nearestRelativeWhatsapp: '',
        nearestRelativeWhatsappCountry: '+92',
        nearestRelativeWhatsappLocal: '',
        nearestRelativeRelation: '',
        nearestRelativeRelationOther: '',
        vehicleParkingStatus: '',
        vehicleType: '',
        vehicleNumberPlate: '',
        vehicleRegistrationNumber: '',
        vehicleColor: '',
        hostelId: '',
        floorId: '',
        roomId: '',
        bedId: '',
        leaseStartDate: '',
        leaseEndDate: '',
        monthlyRent: '',
        securityDeposit: '',
        lateFeesFine: '',
        lateFeesPercentage: '',
        lateFeesChargeDate: '',
        rentalDocument: null,
        securityDepositFile: null,
        advancedRentReceivedFile: null,
        otherDocuments: [],
        previousRentalDocument: null,
        previousSecurityDepositFile: null,
        previousAdvancedRentReceivedFile: null,
      });
      setActiveTab('personal');
      setAvailableFloors([]);
      setAvailableRooms([]);
      setAvailableBeds([]);
    }
  }, [initialData, editingId, isOpen]);

  // Load floors when hostel is selected - Only show floors for the selected hostel
  useEffect(() => {
    const fetchFloors = async () => {
      if (formData.hostelId) {
        try {
          setFloorsLoading(true);
          // Get floors only for the selected hostel
          const floors = await tenantService.getFloorsByHostel(Number(formData.hostelId));
          const floorOptions = floors.map(floor => ({
            value: String(floor.id),
            label: floor.floorName || `Floor ${floor.number}`,
          }));
          setAvailableFloors(floorOptions);
        } catch (error) {
          console.error('Error loading floors:', error);
          setAvailableFloors([]);
        } finally {
          setFloorsLoading(false);
        }
      } else {
        setAvailableFloors([]);
        setAvailableRooms([]);
        setAvailableBeds([]);
      }
    };
    fetchFloors();
  }, [formData.hostelId]);

  // Update rooms when floor is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (formData.floorId) {
        try {
          setRoomsLoading(true);
          const rooms = await tenantService.getRoomsByFloor(Number(formData.floorId));
          const roomOptions = rooms.map(room => ({
            value: String(room.id),
            label: `Room ${room.roomNumber}`,
          }));
          setAvailableRooms(roomOptions);
        } catch (error) {
          console.error('Error loading rooms:', error);
          setAvailableRooms([]);
        } finally {
          setRoomsLoading(false);
        }
      } else {
        setAvailableRooms([]);
        setAvailableBeds([]);
      }
      setFormData(prev => ({ ...prev, roomId: '', bedId: '' }));
    };
    fetchRooms();
  }, [formData.floorId]);

  // Update beds when room is selected
  useEffect(() => {
    const fetchBeds = async () => {
      if (formData.roomId) {
        try {
          setBedsLoading(true);
          const beds = await tenantService.getBedsByRoom(Number(formData.roomId));
          const unoccupiedBeds = beds
            .filter((bed) => {
              const bedStatus = String(bed.status || '').toLowerCase();
              const hasOccupant = Boolean(bed.currentTenantId || bed.currentTenant || bed.currentUser || bed.currentUserId);
              const isCurrentSelection = String(bed.id) === String(formData.bedId);

              return isCurrentSelection || (bedStatus === 'available' && !hasOccupant);
            })
            .map(bed => ({
              value: String(bed.id),
              label: `Bed ${bed.bedNumber}${String(bed.status || '').toLowerCase() === 'available' ? '' : ` (${bed.status})`}`,
            }));
          setAvailableBeds(unoccupiedBeds);
        } catch (error) {
          console.error('Error loading beds:', error);
          setAvailableBeds([]);
        } finally {
          setBedsLoading(false);
        }
      } else {
        setAvailableBeds([]);
      }
      setFormData(prev => ({ ...prev, bedId: '' }));
    };
    fetchBeds();
  }, [formData.roomId]);

  const validateHostelInfo = (): boolean => {
    const validationErrors: Partial<Record<keyof TenantFormData, string>> = {};

    if (!formData.hostelId) {
      validationErrors.hostelId = 'Please select a hostel.';
    }
    if (!formData.floorId) {
      validationErrors.floorId = 'Please select a floor.';
    }
    if (!formData.roomId) {
      validationErrors.roomId = 'Please select a room.';
    }
    if (!formData.bedId) {
      validationErrors.bedId = 'Please select an available bed.';
    }
    if (!formData.leaseStartDate) {
      validationErrors.leaseStartDate = 'Lease start date is required.';
    }
    if (!formData.leaseEndDate) {
      validationErrors.leaseEndDate = 'Lease end date is required.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleNext = () => {
    if (activeTab === 'personal') {
      setActiveTab('professional');
    } else if (activeTab === 'professional') {
      setActiveTab('emergency');
    } else if (activeTab === 'emergency') {
      setActiveTab('hostel');
    } else if (activeTab === 'hostel') {
      setActiveTab('vehicle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateHostelInfo()) {
      setActiveTab('hostel');
      return;
    }
    await onSubmit(formData);
  };

  const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 13) {
      setFormData({ ...formData, cnicNumber: value });
    }
  };

  const handleHostelCreated = () => {
    setIsAddHostelOpen(false);
    if (onHostelCreated) {
      onHostelCreated();
    }
  };

  const hostelSectionHasError = Boolean(
    errors.hostelId ||
    errors.floorId ||
    errors.roomId ||
    errors.bedId ||
    errors.leaseStartDate ||
    errors.leaseEndDate
  );

  useEffect(() => {
    if (formData.profilePhoto) {
      const previewUrl = URL.createObjectURL(formData.profilePhoto);
      setProfilePhotoPreview(previewUrl);
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
    setProfilePhotoPreview(null);
    return undefined;
  }, [formData.profilePhoto]);

  const emergencyRelationOtherRef = useRef<HTMLInputElement>(null);
  const nearestRelativeRelationOtherRef = useRef<HTMLInputElement>(null);
  const diseaseDetailsRef = useRef<HTMLTextAreaElement>(null);

  const updatePhoneField = (
    countryField: keyof TenantFormData,
    localField: keyof TenantFormData,
    combinedField: keyof TenantFormData,
    nextCountry: string,
    nextLocal: string
  ) => {
    const maxDigits = getMaxLocalPhoneDigits(nextCountry);
    const digits = nextLocal.replace(/\D/g, '').slice(0, maxDigits);
    setFormData(prev => ({
      ...prev,
      [countryField]: nextCountry,
      [localField]: digits,
      [combinedField]: formatPhoneField(nextCountry, digits),
    } as unknown as TenantFormData));
  };

  useEffect(() => {
    if (activeTab === 'emergency' && formData.emergencyContactRelation === 'other' && emergencyRelationOtherRef.current) {
      emergencyRelationOtherRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [formData.emergencyContactRelation, activeTab]);

  useEffect(() => {
    if (activeTab === 'emergency' && formData.nearestRelativeRelation === 'other' && nearestRelativeRelationOtherRef.current) {
      nearestRelativeRelationOtherRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [formData.nearestRelativeRelation, activeTab]);

  useEffect(() => {
    if (activeTab === 'emergency' && formData.anyDisease === 'Yes' && diseaseDetailsRef.current) {
      diseaseDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [formData.anyDisease, activeTab]);

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
                <h2 className="text-lg font-semibold text-white">Tenant Info</h2>
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
              <button
                onClick={() => setActiveTab('hostel')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'hostel'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span className="font-medium">Hostel Info</span>
              </button>
              <button
                onClick={() => setActiveTab('vehicle')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'vehicle'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <TruckIcon className="w-5 h-5" />
                <span className="font-medium">Vehicle/Bike Detail</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {isReadOnly ? 'VIEW ' : ''}
                  {activeTab === 'personal' && 'PERSONAL INFORMATION'}
                  {activeTab === 'professional' && 'PROFESSIONAL'}
                  {activeTab === 'emergency' && 'EMERGENCY'}
                  {activeTab === 'hostel' && 'HOSTEL INFO'}
                  {activeTab === 'vehicle' && 'VEHICLE/BIKE DETAIL'}
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
                    <div className="flex flex-col items-center gap-4 py-4 border-b border-slate-200">
                      <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                        {formData.profilePhoto || formData.previousProfilePhoto ? (
                          <img
                            src={
                              formData.profilePhoto
                                ? profilePhotoPreview || undefined
                                : formData.previousProfilePhoto
                                  ? `${API_BASE_URL.replace('/api', '')}${formData.previousProfilePhoto}`
                                  : undefined
                            }
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-500 text-sm font-medium">
                            No Photo
                          </div>
                        )}
                      </div>
                      {!isReadOnly && (
                        <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                          <span>Choose Profile Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setFormData({ ...formData, profilePhoto: file });
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                      {formData.profilePhoto && (
                        <p className="text-sm text-slate-600">Selected: {formData.profilePhoto.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isReadOnly}
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
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
                          disabled={isReadOnly}
                          value={formData.fatherName}
                          onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
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
                          disabled={isReadOnly}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
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
                          disabled={isReadOnly}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          disabled={isReadOnly}
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Reference / Referred By
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={formData.reference}
                          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="Source of referral"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Country
                        </label>
                        <Select
                          disabled={isReadOnly}
                          value={formData.address.country}
                          onChange={(value) => {
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                country: value,
                                city: '',
                              },
                            });
                          }}
                          options={[
                            { value: '', label: 'Select Country' },
                            ...Object.keys(countryCityMap).map((country) => ({ value: country, label: country })),
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City
                        </label>
                        <Select
                          disabled={isReadOnly || !formData.address.country}
                          value={formData.address.city}
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, city: value },
                            })
                          }
                          options={[
                            { value: '', label: 'Select City' },
                            ...(countryCityMap[formData.address.country] || []).map((city) => ({ value: city, label: city })),
                          ]}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Complete Address
                        </label>
                        <textarea
                          disabled={isReadOnly}
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, street: e.target.value },
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="Enter full address, street, building, area and postal code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <Select
                          disabled={isReadOnly}
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
                            disabled={isReadOnly}
                            value={formData.genderOther}
                            onChange={(e) => setFormData({ ...formData, genderOther: e.target.value })}
                            className="w-full mt-2 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
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
                          disabled={isReadOnly}
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          CNIC Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isReadOnly}
                          value={formData.cnicNumber}
                          onChange={handleCNICChange}
                          maxLength={13}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="1234512345671"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter 13 digits only</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Attachment
                        </label>
                        {!isReadOnly && (
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              setFormData({ ...formData, attachments: e.target.files });
                            }}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                        {formData.attachments && formData.attachments.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected: {formData.attachments.length} file(s)
                          </p>
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
                          disabled={isReadOnly}
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
                              disabled={isReadOnly}
                              value={formData.academicName}
                              onChange={(e) => setFormData({ ...formData, academicName: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Institution/University Name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={formData.academicAddress}
                              onChange={(e) => setFormData({ ...formData, academicAddress: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Academic Address"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Location (Google Maps Link)
                            </label>
                            <input
                              type="url"
                              disabled={isReadOnly}
                              value={formData.academicLocation}
                              onChange={(e) => setFormData({ ...formData, academicLocation: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Student Card No (Registration Number)
                            </label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={formData.studentCardNo}
                              onChange={(e) => setFormData({ ...formData, studentCardNo: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Registration Number"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Attachments
                            </label>
                            {!isReadOnly && (
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                multiple
                                onChange={(e) => {
                                  setFormData({ ...formData, academicAttachments: e.target.files });
                                }}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
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
                              disabled={isReadOnly}
                              value={formData.jobTitle}
                              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Job Title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Company Name
                            </label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={formData.companyName}
                              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Company Name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={formData.jobAddress}
                              onChange={(e) => setFormData({ ...formData, jobAddress: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Job Address"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Location (Google Maps Link)
                            </label>
                            <input
                              type="url"
                              disabled={isReadOnly}
                              value={formData.jobLocation}
                              onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              ID No
                            </label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={formData.jobIdNo}
                              onChange={(e) => setFormData({ ...formData, jobIdNo: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Employee ID"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Attachments
                            </label>
                            {!isReadOnly && (
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                multiple
                                onChange={(e) => {
                                  setFormData({ ...formData, jobAttachments: e.target.files });
                                }}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
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
                              disabled={isReadOnly}
                              value={formData.businessName}
                              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Business Name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={formData.businessAddress}
                              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Business Address"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Location (Google Maps Link)
                            </label>
                            <input
                              type="url"
                              disabled={isReadOnly}
                              value={formData.businessLocation}
                              onChange={(e) => setFormData({ ...formData, businessLocation: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Attachments
                            </label>
                            {!isReadOnly && (
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                multiple
                                onChange={(e) => {
                                  setFormData({ ...formData, businessAttachments: e.target.files });
                                }}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
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
                          disabled={isReadOnly}
                          value={formData.professionDescription}
                          onChange={(e) => setFormData({ ...formData, professionDescription: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
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
                          disabled={isReadOnly}
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="Enter emergency contact name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Emergency Contact Number
                        </label>
                        <div className="flex gap-2 items-stretch">
                          <select
                            disabled={isReadOnly}
                            value={formData.emergencyContactNumberCountry}
                            onChange={(e) => updatePhoneField(
                              'emergencyContactNumberCountry',
                              'emergencyContactNumberLocal',
                              'emergencyContactNumber',
                              e.target.value,
                              formData.emergencyContactNumberLocal,
                            )}
                            className="w-40 px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          >
                            {phoneCountryOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            disabled={isReadOnly}
                            value={formData.emergencyContactNumberLocal}
                            onChange={(e) => updatePhoneField(
                              'emergencyContactNumberCountry',
                              'emergencyContactNumberLocal',
                              'emergencyContactNumber',
                              formData.emergencyContactNumberCountry,
                              e.target.value,
                            )}
                            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                            placeholder="3331234567"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Emergency Contact WhatsApp Number
                        </label>
                        <div className="flex gap-2 items-stretch">
                          <select
                            disabled={isReadOnly}
                            value={formData.emergencyContactWhatsappCountry}
                            onChange={(e) => updatePhoneField(
                              'emergencyContactWhatsappCountry',
                              'emergencyContactWhatsappLocal',
                              'emergencyContactWhatsapp',
                              e.target.value,
                              formData.emergencyContactWhatsappLocal,
                            )}
                            className="w-40 px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          >
                            {phoneCountryOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            disabled={isReadOnly}
                            value={formData.emergencyContactWhatsappLocal}
                            onChange={(e) => updatePhoneField(
                              'emergencyContactWhatsappCountry',
                              'emergencyContactWhatsappLocal',
                              'emergencyContactWhatsapp',
                              formData.emergencyContactWhatsappCountry,
                              e.target.value,
                            )}
                            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                            placeholder="3331234567"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Relation
                        </label>
                        <Select
                          disabled={isReadOnly}
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
                            ref={emergencyRelationOtherRef}
                            type="text"
                            disabled={isReadOnly}
                            value={formData.emergencyContactRelationOther}
                            onChange={(e) => setFormData({ ...formData, emergencyContactRelationOther: e.target.value })}
                            className="w-full mt-2 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                            placeholder="Please specify"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Any Disease
                        </label>
                        <div className="flex gap-2">
                          {['Yes', 'No'].map((option) => (
                            <button
                              key={option}
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                anyDisease: option,
                                diseaseDetails: option === 'No' ? '' : prev.diseaseDetails,
                              }))}
                              className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition ${formData.anyDisease === option ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        {formData.anyDisease === 'Yes' && (
                          <textarea
                            ref={diseaseDetailsRef}
                            disabled={isReadOnly}
                            value={formData.diseaseDetails}
                            onChange={(e) => setFormData({ ...formData, diseaseDetails: e.target.value })}
                            rows={3}
                            className="w-full mt-3 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                            placeholder="Please specify the disease details"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Blood Group
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="e.g., A+, B-, O+"
                        />
                      </div>
                    </div>

                    {/* Nearest Relative Section */}
                    <div className="mt-8 pt-6 border-t border-slate-300">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">Related Relative under 80 KM</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contact Number
                          </label>
                          <div className="flex gap-2 items-stretch">
                            <select
                              disabled={isReadOnly}
                              value={formData.nearestRelativeContactCountry}
                              onChange={(e) => updatePhoneField(
                                'nearestRelativeContactCountry',
                                'nearestRelativeContactLocal',
                                'nearestRelativeContact',
                                e.target.value,
                                formData.nearestRelativeContactLocal,
                              )}
                              className="w-40 px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                            >
                              {phoneCountryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              disabled={isReadOnly}
                              value={formData.nearestRelativeContactLocal}
                              onChange={(e) => updatePhoneField(
                                'nearestRelativeContactCountry',
                                'nearestRelativeContactLocal',
                                'nearestRelativeContact',
                                formData.nearestRelativeContactCountry,
                                e.target.value,
                              )}
                              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="3331234567"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            WhatsApp Number
                          </label>
                          <div className="flex gap-2 items-stretch">
                            <select
                              disabled={isReadOnly}
                              value={formData.nearestRelativeWhatsappCountry}
                              onChange={(e) => updatePhoneField(
                                'nearestRelativeWhatsappCountry',
                                'nearestRelativeWhatsappLocal',
                                'nearestRelativeWhatsapp',
                                e.target.value,
                                formData.nearestRelativeWhatsappLocal,
                              )}
                              className="w-40 px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                            >
                              {phoneCountryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              disabled={isReadOnly}
                              value={formData.nearestRelativeWhatsappLocal}
                              onChange={(e) => updatePhoneField(
                                'nearestRelativeWhatsappCountry',
                                'nearestRelativeWhatsappLocal',
                                'nearestRelativeWhatsapp',
                                formData.nearestRelativeWhatsappCountry,
                                e.target.value,
                              )}
                              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="3331234567"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Relation
                          </label>
                          <Select
                            disabled={isReadOnly}
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
                              ref={nearestRelativeRelationOtherRef}
                              type="text"
                              disabled={isReadOnly}
                              value={formData.nearestRelativeRelationOther}
                              onChange={(e) => setFormData({ ...formData, nearestRelativeRelationOther: e.target.value })}
                              className="w-full mt-2 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="Please specify"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content - Hostel Info */}
                {activeTab === 'hostel' && (
                  <div className="space-y-6">
                    {/* Hostel Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700">
                          Hostel
                        </label>
                        {!isReadOnly && hostelOptions.length === 0 && (
                          <button
                            type="button"
                            onClick={() => setIsAddHostelOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                            Create Hostel
                          </button>
                        )}
                      </div>
                      {hostelOptions.length > 0 ? (
                        <Select
                          value={formData.hostelId}
                          onChange={(value) => {
                            setFormData({
                              ...formData,
                              hostelId: value,
                              floorId: '',
                              roomId: '',
                              bedId: '',
                            });
                            setErrors(prev => ({
                              ...prev,
                              hostelId: undefined,
                              floorId: undefined,
                              roomId: undefined,
                              bedId: undefined,
                            }));
                          }}
                          options={hostelOptions.filter(opt => opt.value !== '')}
                          placeholder={hostelsLoading ? "Loading hostels..." : "Select Hostel"}
                          disabled={hostelsLoading || isReadOnly}
                          error={errors.hostelId}
                        />
                      ) : (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            No hostels available. Please create a hostel first.
                          </p>
                        </div>
                      )}
                    </div>

                    {formData.hostelId && (
                      <>
                        {/* Room Allocation */}
                        <div className={`space-y-6 p-4 rounded-2xl ${hostelSectionHasError ? 'border border-red-300 bg-red-50' : 'border border-slate-200 bg-white/80'}`}>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Floor
                            </label>
                            <Select
                              value={formData.floorId}
                              onChange={(value) => {
                                setFormData({
                                  ...formData,
                                  floorId: value,
                                  roomId: '',
                                  bedId: '',
                                });
                                setErrors(prev => ({
                                  ...prev,
                                  floorId: undefined,
                                  roomId: undefined,
                                  bedId: undefined,
                                }));
                              }}
                              options={availableFloors}
                              placeholder={floorsLoading ? "Loading floors..." : "Select Floor"}
                              disabled={floorsLoading || isReadOnly}
                              error={errors.floorId}
                            />
                          </div>
                          {formData.floorId && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Room
                              </label>
                              <Select
                                value={formData.roomId}
                                onChange={(value) => {
                                  setFormData({
                                    ...formData,
                                    roomId: value,
                                    bedId: '',
                                  });
                                  setErrors(prev => ({
                                    ...prev,
                                    roomId: undefined,
                                    bedId: undefined,
                                  }));
                                }}
                                options={availableRooms}
                                placeholder={roomsLoading ? "Loading rooms..." : "Select Room"}
                                disabled={roomsLoading || isReadOnly}
                                error={errors.roomId}
                              />
                            </div>
                          )}
                          {formData.roomId && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Bed
                              </label>
                              <Select
                                value={formData.bedId}
                                onChange={(value) => {
                                  setFormData({
                                    ...formData,
                                    bedId: value,
                                  });
                                  setErrors(prev => ({
                                    ...prev,
                                    bedId: undefined,
                                  }));
                                }}
                                options={availableBeds}
                                placeholder={bedsLoading ? "Loading beds..." : "Select Available Bed"}
                                disabled={bedsLoading || isReadOnly}
                                error={errors.bedId}
                              />
                              {!bedsLoading && !isReadOnly && availableBeds.length === 0 && (
                                <p className="text-sm text-red-600 mt-2">No available beds in this room.</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Lease Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Lease Start Date
                            </label>
                            <input
                              type="date"
                              disabled={isReadOnly}
                              value={formData.leaseStartDate}
                              onChange={(e) => {
                                setFormData({ ...formData, leaseStartDate: e.target.value });
                                setErrors(prev => ({ ...prev, leaseStartDate: undefined }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${errors.leaseStartDate ? 'border border-red-500 focus:ring-red-400' : 'border border-slate-300 focus:ring-blue-500'}`}
                            />
                            {errors.leaseStartDate && <p className="mt-1 text-sm text-red-600">{errors.leaseStartDate}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Lease End Date
                            </label>
                            <input
                              type="date"
                              disabled={isReadOnly}
                              value={formData.leaseEndDate}
                              onChange={(e) => {
                                setFormData({ ...formData, leaseEndDate: e.target.value });
                                setErrors(prev => ({ ...prev, leaseEndDate: undefined }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${errors.leaseEndDate ? 'border border-red-500 focus:ring-red-400' : 'border border-slate-300 focus:ring-blue-500'}`}
                            />
                            {errors.leaseEndDate && <p className="mt-1 text-sm text-red-600">{errors.leaseEndDate}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Monthly Rent
                            </label>
                            <input
                              type="number"
                              disabled={isReadOnly}
                              value={formData.monthlyRent}
                              onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="20000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Security Deposit
                            </label>
                            <input
                              type="number"
                              disabled={isReadOnly}
                              value={formData.securityDeposit}
                              onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                              placeholder="1000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Late Fees Fine
                            </label>
                            <Select
                              disabled={isReadOnly}
                              value={formData.lateFeesFine}
                              onChange={(value) => setFormData({ ...formData, lateFeesFine: value, lateFeesPercentage: value !== 'Yes' ? '' : formData.lateFeesPercentage })}
                              options={[
                                { value: '', label: 'Select Option' },
                                { value: 'Yes', label: 'Yes' },
                                { value: 'No', label: 'No' },
                              ]}
                            />
                            {formData.lateFeesFine === 'Yes' && (
                              < div className="mt-4 flex flex-col gap-4 p-4 bg-slate-50 rounded-md border border-slate-200" >
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Percentage Late Fees (% of monthly rent)
                                  </label>
                                <input
                                  type="number"
                                  disabled={isReadOnly}
                                  value={formData.lateFeesPercentage}
                                  onChange={(e) => setFormData({ ...formData, lateFeesPercentage: e.target.value })}
                                  className="w-full mt-2 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                  placeholder="Enter percentage"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                />
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Late Fee Charge Start Date
                                  </label>
                                  <input
                                    type="date"
                                    disabled={isReadOnly}
                                    value={formData.lateFeesChargeDate}
                                    onChange={(e) => setFormData({ ...formData, lateFeesChargeDate: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                  />
                                </div>
                                {formData.monthlyRent && formData.lateFeesPercentage && !Number.isNaN(Number(formData.monthlyRent)) && !Number.isNaN(Number(formData.lateFeesPercentage)) && (
                                  <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-200 text-sm text-slate-700">
                                    {(() => {
                                      const rent = Number(formData.monthlyRent);
                                      const percent = Number(formData.lateFeesPercentage);
                                      const feeAmount = rent * (percent / 100);
                                      const totalRent = rent + feeAmount;
                                      return (
                                        <>
                                          Late fee amount: ₹{feeAmount.toFixed(2)}<br />
                                          Total rent including late fee: ₹{totalRent.toFixed(2)}
                                        </>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Documents */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Rental Document
                            </label>
                            {!isReadOnly && (
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                multiple
                                onChange={(e) => {
                                  setFormData({ ...formData, rentalDocument: e.target.files });
                                }}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                            {formData.rentalDocument && formData.rentalDocument.length > 0 && (
                              <p className="text-sm text-gray-600 mt-1">
                                Selected: {formData.rentalDocument.length} file(s)
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Security Deposit
                            </label>
                            {!isReadOnly && (
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                multiple
                                onChange={(e) => {
                                  setFormData({ ...formData, securityDepositFile: e.target.files });
                                }}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                            {formData.securityDepositFile && formData.securityDepositFile.length > 0 && (
                              <p className="text-sm text-gray-600 mt-1">
                                Selected: {formData.securityDepositFile.length} file(s)
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Advanced Rent Received
                            </label>
                            {!isReadOnly && (
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                multiple
                                onChange={(e) => {
                                  setFormData({ ...formData, advancedRentReceivedFile: e.target.files });
                                }}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                            {formData.advancedRentReceivedFile && formData.advancedRentReceivedFile.length > 0 && (
                              <p className="text-sm text-gray-600 mt-1">
                                Selected: {formData.advancedRentReceivedFile.length} file(s)
                              </p>
                            )}
                          </div>
                          <div className="border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-sm font-medium text-slate-700">Other Documents (if any)</p>
                                <p className="text-sm text-slate-500">Add a document name and upload the matching file.</p>
                              </div>
                              {!isReadOnly && (
                                <button
                                  type="button"
                                  onClick={() => setFormData({
                                    ...formData,
                                    otherDocuments: [...formData.otherDocuments, { documentName: '', documentFile: null }],
                                  })}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  + Add Document
                                </button>
                              )}
                            </div>
                            {formData.otherDocuments.length > 0 && (
                              <div className="space-y-4">
                                {formData.otherDocuments.map((item, index) => (
                                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="md:col-span-1">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Document Name
                                      </label>
                                      <input
                                        type="text"
                                        disabled={isReadOnly}
                                        value={item.documentName}
                                        onChange={(e) => {
                                          const updated = [...formData.otherDocuments];
                                          updated[index] = {
                                            ...updated[index],
                                            documentName: e.target.value,
                                          };
                                          setFormData({ ...formData, otherDocuments: updated });
                                        }}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        placeholder="e.g. Agreement Copy"
                                      />
                                    </div>
                                    <div className="md:col-span-1">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Upload Document
                                      </label>
                                      {!isReadOnly && (
                                        <input
                                          type="file"
                                          accept=".pdf,.doc,.docx,image/*"
                                          onChange={(e) => {
                                            const files = e.target.files;
                                            const updated = [...formData.otherDocuments];
                                            updated[index] = {
                                              ...updated[index],
                                              documentFile: files && files[0] ? files[0] : null,
                                            };
                                            setFormData({ ...formData, otherDocuments: updated });
                                          }}
                                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      )}
                                      {item.documentFile && (
                                        <p className="text-sm text-gray-600 mt-1">Selected: {item.documentFile.name}</p>
                                      )}
                                    </div>
                                    {!isReadOnly && (
                                      <div className="md:col-span-1 flex items-center justify-end">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...formData.otherDocuments];
                                            updated.splice(index, 1);
                                            setFormData({ ...formData, otherDocuments: updated });
                                          }}
                                          className="inline-flex items-center justify-center h-10 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Tab Content - Vehicle/Bike Detail */}
                {activeTab === 'vehicle' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Parking Status
                        </label>
                        <Select
                          value={formData.vehicleParkingStatus}
                          onChange={(value) => setFormData({ ...formData, vehicleParkingStatus: value })}
                          options={vehicleParkingOptions}
                          placeholder="Select parking status..."
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Vehicle Type
                        </label>
                        <Select
                          value={formData.vehicleType}
                          onChange={(value) => setFormData({ ...formData, vehicleType: value })}
                          options={vehicleTypeOptions}
                          placeholder="Select vehicle..."
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Number Plate
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={formData.vehicleNumberPlate}
                          onChange={(e) => setFormData({ ...formData, vehicleNumberPlate: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="ABC-1234"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={formData.vehicleRegistrationNumber}
                          onChange={(e) => setFormData({ ...formData, vehicleRegistrationNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="Registration number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Color
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={formData.vehicleColor}
                          onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                          placeholder="Black"
                        />
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
                  {isReadOnly ? 'Close' : 'Cancel'}
                </button>
                {activeTab !== 'vehicle' ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  !isReadOnly && (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      {editingId ? 'Update Tenant' : 'Save'}
                    </button>
                  )
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Add Hostel Modal */}
      {isAddHostelOpen && (
        <AddHostelForm
          isOpen={isAddHostelOpen}
          onClose={() => setIsAddHostelOpen(false)}
          onSubmit={handleHostelCreated}
        />
      )}
    </AnimatePresence>
  );
};

export default TenantForm;
export type { TenantFormData };
