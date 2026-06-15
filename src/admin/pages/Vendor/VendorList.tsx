/**
 * VendorList page with two tabs:
 * 1. Vendor List - Shows vendors filtered by hostel (must select hostel first)
 * 2. Vendor Management - Shows all services and vendor assignments
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserCircleIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  ArrowPathIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import VendorTable from '../People/components/VendorTable';
import ROUTES from '../../routes/routePaths';
import { formatCurrency } from '../../types/common';
import vendorsData from '../../mock/vendors.json';
import servicesData from '../../mock/services.json';
import vendorServicesData from '../../mock/vendor-services.json';
import * as hostelService from '../../services/hostel.service';
import { api } from '../../../services/apiClient';
import { API_ROUTES } from '../../../services/api.config';

const countryCityMap: Record<string, string[]> = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  India: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'],
  Germany: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'],
  France: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
};

interface Vendor {
  id: number;
  name: string;
  companyName?: string | null;
  specialty?: string;
  primaryService?: string | null;
  category?: string | null;
  phone?: string;
  email?: string;
  rating?: {
    average: number | null;
    totalReviews: number;
    label: string | null;
    display: string | null;
  };
  status: string;
  statusLabel?: string;
  hostelId?: number;
  hostel?: {
    id: number;
    name: string;
  } | null;
  contact?: {
    phone: string | null;
    alternatePhone: string | null;
    email: string | null;
  };
  services?: Array<{
    id: string | null;
    name: string;
    category: string | null;
    specialty: string | null;
    description: string | null;
    tags: string[] | null;
  }>;
  serviceTags?: string[];
  attachments?: VendorAttachment[];
}

interface VendorAttachment {
  title?: string;
  type?: string;
  name?: string;
  uploadedAt?: string;
  url?: string;
  filename?: string;
  originalName?: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price?: number; // Optional price field
  unit?: string; // Price unit (per hour, per service, etc.)
}

interface VendorService {
  id: number;
  serviceId: number;
  serviceName: string;
  vendorId: number;
  vendorName: string;
  hostelId: number;
  hostelName: string;
  status: string;
  assignedDate: string;
}

interface VendorListProps {
  selectedHostelId?: string;
  onHostelChange?: (hostelId: string) => void;
}

const VendorList: React.FC<VendorListProps> = ({ 
  selectedHostelId: propSelectedHostelId = '', 
  onHostelChange 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active section from route
  // If accessed from People section (/people/vendors), show list
  // If accessed from Vendor Management main sidebar (/vendor/management), show management tab
  // If accessed from /vendor/list, show vendor list tab
  const getActiveSection = (): 'list' | 'management' => {
    if (location.pathname.includes('/people/vendors')) return 'list';
    if (location.pathname.includes('/vendor/management')) return 'management';
    if (location.pathname.includes('/vendor/list')) return 'list';
    return 'management'; // Default to management when on /vendor
  };
  
  const activeSection = getActiveSection();
  
  // Note: Navigation is handled by PeopleHub parent component, so we don't need to redirect here
  
  const [selectedHostelId, setSelectedHostelId] = useState<string>(propSelectedHostelId);
  
  // Sync with prop when it changes
  useEffect(() => {
    if (propSelectedHostelId !== undefined) {
      setSelectedHostelId(propSelectedHostelId);
    }
  }, [propSelectedHostelId]);
  
  const handleHostelChange = (hostelId: string) => {
    setSelectedHostelId(hostelId);
    if (onHostelChange) {
      onHostelChange(hostelId);
    }
  };

  // Use prop value if provided, otherwise use internal state
  const effectiveHostelId = propSelectedHostelId !== undefined && propSelectedHostelId !== '' 
    ? propSelectedHostelId 
    : selectedHostelId;

  const [selectedHostelIdForManagement, setSelectedHostelIdForManagement] = useState<string>('');
  const [hostels, setHostels] = useState<Array<{ id: string | number; name: string; city: string }>>([]);
  const [hostelsLoading, setHostelsLoading] = useState<boolean>(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState<boolean>(false);
  const [vendorsError, setVendorsError] = useState<string | null>(null);
  const [vendorCategories, setVendorCategories] = useState<Array<{ id: number; name: string; description: string | null }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [isViewVendorModalOpen, setIsViewVendorModalOpen] = useState(false);
  const [isEditVendorModalOpen, setIsEditVendorModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [assignForm, setAssignForm] = useState({
    serviceId: '',
    vendorId: '',
    hostelId: '',
    status: 'active',
    attachment: null as File | null,
  });
  const [activeTab, setActiveTab] = useState<'vendorInfo' | 'vendorService'>('vendorInfo');
  const [vendorForm, setVendorForm] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    whatsapp: '',
    reference: '',
    companyName: '',
    address: '',
    country: '',
    city: '',
    location: '',
    businessDescription: '',
    profilePhoto: null as File | null,
    previousProfilePhoto: '',
    cnicFront: null as File | null,
    cnicBack: null as File | null,
    businessCard: null as File | null,
    additionalAttachments: [{ id: '1', title: '', file: null }] as Array<{ id: string; title: string; file: File | null }>,
    attachments: [] as VendorAttachment[],
    category: '',
    specialties: [{ id: '1', name: '', description: '' }],
    hostelId: '',
    paymentTerms: 'prepaid',
    status: 'active',
  });
  const [vendorFormErrors, setVendorFormErrors] = useState<Record<string, string>>({});
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });

  useEffect(() => {
    if (vendorForm.profilePhoto) {
      const previewUrl = URL.createObjectURL(vendorForm.profilePhoto);
      setProfilePhotoPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }

    setProfilePhotoPreview(null);
    return undefined;
  }, [vendorForm.profilePhoto]);

  const getVendorFieldClass = (field: string, baseClass = 'w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent') =>
    `${baseClass} ${vendorFormErrors[field] ? 'border-red-500 ring-2 ring-red-100 focus:ring-red-500' : 'border border-slate-300 focus:ring-blue-500'}`;

  // Fetch hostels from API on component mount
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setHostelsLoading(true);
        const hostelsData = await hostelService.getAllHostelsFromAPI();
        setHostels(hostelsData.map(h => ({ id: h.id, name: h.name, city: h.city })));
      } catch (err: any) {
        console.error('Error fetching hostels:', err);
        setHostels([]);
      } finally {
        setHostelsLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Fetch vendor categories from API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await api.get(API_ROUTES.VENDOR_CATEGORY.LIST);
        if (response.success && response.data) {
          setVendorCategories(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err: any) {
        console.error('Error fetching vendor categories:', err);
        setVendorCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get hostel options
  const hostelOptions = useMemo(() => {
    if (hostelsLoading) {
      return [{ value: '', label: 'Loading hostels...' }];
    }
    return [
      { value: '', label: 'Select Hostel' },
      ...hostels.map((h) => ({
        value: String(h.id),
        label: `${h.name} - ${h.city}`,
      })),
    ];
  }, [hostels, hostelsLoading]);

  // Fetch vendors by hostelId when hostel is selected
  const fetchVendorsByHostel = useCallback(async (hostelId: string) => {
    if (!hostelId) {
      setVendors([]);
      setVendorsError(null);
      return;
    }

    try {
      setVendorsLoading(true);
      setVendorsError(null);
      
      console.log('📡 Fetching vendors for hostel:', hostelId);
      const response = await api.get(API_ROUTES.VENDOR.BY_HOSTEL(hostelId));
      
      console.log('✅ Vendors fetched successfully:', response);
      
      if (response.success && response.data) {
        setVendors(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.message || 'Failed to fetch vendors');
      }
    } catch (error: any) {
      console.error('❌ Error fetching vendors:', error);
      setVendorsError(error?.message || 'Failed to fetch vendors. Please try again.');
      setVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  }, []);

  const loadAllVendors = useCallback(async () => {
    try {
      setVendorsLoading(true);
      setVendorsError(null);
      const response = await api.get(API_ROUTES.VENDOR.LIST);
      if (response.success && response.data) {
        const vendorsData = Array.isArray(response.data)
          ? response.data
          : (response.data.items || []);
        setVendors(vendorsData);
      } else {
        throw new Error(response.message || 'Failed to fetch vendors');
      }
    } catch (error: any) {
      console.error('Error loading all vendors:', error);
      setVendorsError(error.message || 'Failed to load vendors');
      setVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  }, []);

  // Fetch vendors by hostelId when hostel is selected (for list section)
  useEffect(() => {
    if (effectiveHostelId && activeSection === 'list') {
      fetchVendorsByHostel(effectiveHostelId);
    }
  }, [effectiveHostelId, fetchVendorsByHostel, activeSection]);

  // Load all vendor service assignments for both management and list sections
  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = useState(false);

  const loadAssignments = async () => {
    try {
      setAssignmentsLoading(true);
      const response = await api.get('/admin/vendor/management');
      if (response.success && response.data) {
        const assignments = Array.isArray(response.data) 
          ? response.data 
          : (response.data.items || response.data.assignments || []);
        setAllAssignments(assignments);
      }
    } catch (err: any) {
      console.error('Error loading vendor assignments:', err);
      setAllAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'management' || activeSection === 'list') {
      loadAssignments();
    }
  }, [activeSection, selectedHostelIdForManagement]);

  // Load all vendors when needed
  useEffect(() => {
    if (activeSection === 'list') {
      loadAllVendors();
    }
  }, [activeSection, loadAllVendors]);

  const getVendorStatus = (vendor: any) =>
    String(vendor.status || vendor.statusLabel || '').toLowerCase();

  const filteredVendors = useMemo(() => {
    let list = vendors;
    if (effectiveHostelId) {
      list = list.filter((vendor: any) =>
        String(vendor.hostelId || vendor.hostel?.id || '').trim() === String(effectiveHostelId).trim()
      );
    }
    return list;
  }, [vendors, effectiveHostelId]);

  // Get all services with their assigned vendors (for Vendor Management tab)
  const servicesWithVendors = useMemo(() => {
    const services = servicesData as Service[];
    const assignments = vendorServicesData as VendorService[];
    
    // Generate dummy prices if not present (for demo purposes)
    const priceMap: Record<string, { price: number; unit: string }> = {
      'Plumbing': { price: 150, unit: 'per hour' },
      'Cleaning Supplies': { price: 500, unit: 'per month' },
      'IT Services': { price: 200, unit: 'per hour' },
      'Landscaping': { price: 300, unit: 'per service' },
      'Security': { price: 2000, unit: 'per month' },
      'HVAC Maintenance': { price: 250, unit: 'per hour' },
      'Linen Supply': { price: 800, unit: 'per month' },
      'Electrical': { price: 175, unit: 'per hour' },
      'Furniture': { price: 5000, unit: 'per order' },
      'General Maintenance': { price: 120, unit: 'per hour' },
      'Pest Control': { price: 400, unit: 'per service' },
      'Web Services': { price: 1000, unit: 'per month' },
    };
    
    return services.map((service) => {
      // Filter assignments by selected hostel if filter is applied
      let serviceAssignments = assignments.filter((a) => a.serviceId === service.id);
      
      // Apply hostel filter if selected
      if (selectedHostelIdForManagement) {
        serviceAssignments = serviceAssignments.filter(
          (a) => String(a.hostelId) === selectedHostelIdForManagement
        );
      }
      
      const priceInfo = priceMap[service.name] || { price: 0, unit: 'per service' };
      return {
        ...service,
        price: service.price || priceInfo.price,
        unit: service.unit || priceInfo.unit,
        assignments: serviceAssignments,
        assignedVendorsCount: serviceAssignments.length,
        assignedVendors: serviceAssignments.map(a => a.vendorName).join(', '),
        hostels: [...new Set(serviceAssignments.map(a => a.hostelName))].join(', '),
      };
    }).filter((service) => {
      // If hostel filter is applied, only show services that have assignments for that hostel
      if (selectedHostelIdForManagement) {
        return service.assignments.length > 0;
      }
      // If no filter, show all services
      return true;
    });
  }, [selectedHostelIdForManagement]);

  // Handle view vendor
  const handleViewVendor = async (vendor: Vendor) => {
    try {
      const response = await api.get(API_ROUTES.VENDOR.BY_ID(vendor.id));
      if (response.success && response.data) {
        setSelectedVendor(response.data);
        setIsViewVendorModalOpen(true);
      } else {
        setToast({
          open: true,
          type: 'error',
          message: 'Failed to fetch vendor details',
        });
      }
    } catch (error: any) {
      console.error('Error fetching vendor:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to fetch vendor details',
      });
    }
  };

  // Handle edit vendor
  const handleEditVendor = async (vendor: Vendor) => {
    try {
      const response = await api.get(API_ROUTES.VENDOR.BY_ID(vendor.id));
      if (response.success && response.data) {
        const vendorData = response.data;
        setSelectedVendor(vendorData);
        const vendorAttachments = Array.isArray(vendorData.attachments)
          ? (vendorData.attachments as VendorAttachment[])
          : [];
        const vendorServices = Array.isArray(vendorData.services)
          ? (vendorData.services as Array<{ name?: string; specialty?: string; description?: string }>)
          : [];
        
        // Populate form with vendor data
        setVendorForm({
          name: vendorData.name || '',
          email: vendorData.contact?.email || vendorData.email || '',
          phone: vendorData.contact?.phone || vendorData.phone || '',
          alternatePhone: vendorData.contact?.alternatePhone || vendorData.alternatePhone || '',
          whatsapp: vendorData.whatsapp || '',
          reference: vendorData.reference || '',
          companyName: vendorData.companyName || '',
          address: vendorData.address || '',
          country: vendorData.country || '',
          city: vendorData.city || '',
          location: vendorData.location || '',
          businessDescription: vendorData.businessDescription || '',
          profilePhoto: null,
          previousProfilePhoto: vendorData.profilePhoto || '',
          cnicFront: null,
          cnicBack: null,
          businessCard: null,
          additionalAttachments: vendorAttachments.length > 0
            ? vendorAttachments.map((att, idx) => ({
                id: String(idx + 1),
                title: att.title || att.name || `Attachment ${idx + 1}`,
                file: null,
              }))
            : [{ id: '1', title: '', file: null }],
          attachments: vendorAttachments,
          category: vendorData.category || '',
          specialties: vendorServices.length > 0
            ? vendorServices.map((s, idx) => ({
                id: String(idx + 1),
                name: s.name || s.specialty || '',
                description: s.description || '',
              }))
            : [{ id: '1', name: vendorData.specialty || '', description: '' }],
          hostelId: vendorData.hostelId ? String(vendorData.hostelId) : '',
          paymentTerms: vendorData.paymentTerms || 'prepaid',
          status: vendorData.status || 'active',
        });
        
        setIsEditVendorModalOpen(true);
        setActiveTab('vendorInfo');
      } else {
        setToast({
          open: true,
          type: 'error',
          message: 'Failed to fetch vendor details',
        });
      }
    } catch (error: any) {
      console.error('Error fetching vendor:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to fetch vendor details',
      });
    }
  };

  // Handle delete vendor
  const handleDeleteVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDeleteConfirmOpen(true);
  };

  const handleToggleVendorStatus = async (vendor: Vendor) => {
    try {
      const currentStatus = getVendorStatus(vendor);
      const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await api.put(API_ROUTES.VENDOR.UPDATE(vendor.id), { status: nextStatus });
      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: `Vendor ${vendor.name} has been ${nextStatus === 'active' ? 'restored' : 'marked left'}.`,
        });
        if (effectiveHostelId) {
          await fetchVendorsByHostel(effectiveHostelId);
        } else {
          await loadAllVendors();
        }
      } else {
        throw new Error(response.message || 'Failed to update vendor status');
      }
    } catch (error: any) {
      console.error('Error toggling vendor status:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to update vendor status. Please try again.',
      });
    }
  };

  const handleSuspendVendor = async (vendor: Vendor) => {
    try {
      const response = await api.put(API_ROUTES.VENDOR.UPDATE(vendor.id), { status: 'suspended' });
      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: `Vendor ${vendor.name} has been suspended.`,
        });
        if (effectiveHostelId) {
          await fetchVendorsByHostel(effectiveHostelId);
        } else {
          await loadAllVendors();
        }
      } else {
        throw new Error(response.message || 'Failed to suspend vendor');
      }
    } catch (error: any) {
      console.error('Error suspending vendor:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to suspend vendor. Please try again.',
      });
    }
  };

  // Confirm delete vendor or assignment
  const confirmDeleteVendor = async () => {
    if (!selectedVendor) return;

    try {
      setIsDeleting(true);
      
      // Check if this is an assignment deletion (has special name format)
      const isAssignment = selectedVendor.name?.includes(' - ');
      
      if (isAssignment) {
        // Delete assignment
        const response = await api.delete(`/admin/vendor/management/${selectedVendor.id}`);
        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: 'Vendor assignment deleted successfully!',
          });
          loadAssignments();
        } else {
          throw new Error(response.message || 'Failed to delete assignment');
        }
      } else {
        // Delete vendor
        const response = await api.delete(API_ROUTES.VENDOR.DELETE(selectedVendor.id));
        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: `Vendor "${selectedVendor.name}" deleted successfully!`,
          });
          
          // Refresh vendor list
          if (selectedHostelId) {
            fetchVendorsByHostel(selectedHostelId);
          }
        } else {
          throw new Error(response.message || 'Failed to delete vendor');
        }
      }
      
      setIsDeleteConfirmOpen(false);
      setSelectedVendor(null);
    } catch (error: any) {
      console.error('Error deleting:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns for Vendor Management
  const vendorManagementColumns: Column<typeof servicesWithVendors[0]>[] = [
    {
      key: 'name',
      label: 'Service Name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      width: '250px',
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => (
        <Badge variant="default">{row.category}</Badge>
      ),
      width: '120px',
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-green-600">{formatCurrency(row.price || 0)}</span>
          <span className="text-xs text-gray-500 ml-1">({row.unit || 'per service'})</span>
        </div>
      ),
      width: '150px',
    },
    {
      key: 'assignedVendorsCount',
      label: 'Vendors',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{row.assignedVendorsCount}</span>
          <Badge variant={row.assignedVendorsCount > 0 ? 'success' : 'default'}>
            {row.assignedVendorsCount > 0 ? 'Assigned' : 'None'}
          </Badge>
        </div>
      ),
      width: '120px',
    },
    {
      key: 'assignedVendors',
      label: 'Vendor Names',
      sortable: false,
      render: (row) => (
        <div className="max-w-xs">
          {row.assignments.length > 0 ? (
            <div className="space-y-1">
              {row.assignments.slice(0, 2).map((assignment) => (
                <div key={assignment.id} className="text-sm text-gray-700">
                  • {assignment.vendorName}
                </div>
              ))}
              {row.assignments.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{row.assignments.length - 2} more
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">No vendors</span>
          )}
        </div>
      ),
      width: '200px',
    },
    {
      key: 'hostels',
      label: 'Hostels',
      sortable: false,
      render: (row) => (
        <div className="max-w-xs">
          {row.assignments.length > 0 ? (
            <div className="space-y-1">
              {[...new Set(row.assignments.map(a => a.hostelName))].slice(0, 2).map((hostel, idx) => (
                <div key={idx} className="flex items-center gap-1 text-sm text-gray-700">
                  <MapPinIcon className="w-3 h-3" />
                  <span>{hostel}</span>
                </div>
              ))}
              {[...new Set(row.assignments.map(a => a.hostelName))].length > 2 && (
                <div className="text-xs text-gray-500">
                  +{[...new Set(row.assignments.map(a => a.hostelName))].length - 2} more
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">-</span>
          )}
        </div>
      ),
      width: '180px',
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAssignForm({ ...assignForm, serviceId: String(row.id) });
              setIsAssignModalOpen(true);
            }}
            icon={PlusIcon}
          >
            Assign
          </Button>
        </div>
      ),
      width: '120px',
    },
  ];

  // Load all vendors for dropdown (not just from selected hostel)
  const [allVendorsForDropdown, setAllVendorsForDropdown] = useState<Vendor[]>([]);
  const [allVendorsLoading, setAllVendorsLoading] = useState(false);

  useEffect(() => {
    const loadAllVendors = async () => {
      try {
        setAllVendorsLoading(true);
        const response = await api.get(API_ROUTES.VENDOR.LIST);
        if (response.success && response.data) {
          const vendorsData = Array.isArray(response.data) 
            ? response.data 
            : (response.data.items || response.data.vendors || []);
          setAllVendorsForDropdown(vendorsData);
        }
      } catch (error: any) {
        console.error('Error loading all vendors:', error);
        setAllVendorsForDropdown([]);
      } finally {
        setAllVendorsLoading(false);
      }
    };
    loadAllVendors();
  }, []);

  // Get vendor options for assignment - filter by categories that match userId
  const vendorOptions = useMemo(() => {
    // Get category names from vendor categories (these are filtered by userId on backend)
    const userCategoryNames = vendorCategories.map(cat => cat.name?.toLowerCase().trim()).filter(Boolean);
    
    const vendorsToUse = allVendorsForDropdown.length > 0 
      ? allVendorsForDropdown 
      : (vendors.length > 0 ? vendors : (vendorsData as unknown as Vendor[]));
    
    // Filter vendors: only show vendors whose category matches one of the user's categories
    return vendorsToUse
      .filter((v) => {
        // Check if vendor is active
        const isActive = v.status === 'active' || v.status === 'Active' || v.statusLabel === 'Active';
        if (!isActive) return false;
        
        // If no user categories, show all vendors (backward compatibility)
        if (userCategoryNames.length === 0) return true;
        
        // Check if vendor's category matches any user category
        const vendorCategory = v.category?.toLowerCase().trim();
        if (!vendorCategory) return false;
        
        return userCategoryNames.includes(vendorCategory);
      })
      .map((v) => ({
        value: String(v.id),
        label: `${v.name}${v.specialty ? ` (${v.specialty})` : ''}`,
      }));
  }, [allVendorsForDropdown, vendors, vendorCategories]);

  // Load services from API
  const [servicesFromAPI, setServicesFromAPI] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setServicesLoading(true);
        const response = await api.get('/admin/vendor/management/services');
        if (response.success && response.data) {
          let services: any[] = [];
          if (Array.isArray(response.data)) {
            services = response.data;
          } else if (response.data.services && Array.isArray(response.data.services)) {
            services = response.data.services;
          } else if (response.data.items && Array.isArray(response.data.items)) {
            services = response.data.items;
          }
          setServicesFromAPI(services);
        }
      } catch (error: any) {
        console.error('Error loading services:', error);
        setServicesFromAPI([]);
      } finally {
        setServicesLoading(false);
      }
    };
    loadServices();
  }, []);

  // Get service options for assignment - use API services, fallback to mock data
  const serviceOptions = useMemo(() => {
    const services = servicesFromAPI.length > 0 
      ? servicesFromAPI 
      : (servicesData as Service[]);
    return services
      .filter((s: any) => s.isActive !== false) // Only show active services
      .map((s) => ({
        value: String(s.id),
        label: s.name,
      }));
  }, [servicesFromAPI]);

  // Handle vendor assignment
  const handleAssignVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.serviceId || !assignForm.vendorId || !assignForm.hostelId) {
      setToast({
        open: true,
        type: 'error',
        message: 'Please fill in all required fields',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('serviceId', assignForm.serviceId);
      formData.append('vendorId', assignForm.vendorId);
      formData.append('hostelId', assignForm.hostelId);
      formData.append('isActive', assignForm.status === 'active' ? 'true' : 'false');
      
      if (assignForm.attachment) {
        formData.append('attachment', assignForm.attachment);
      }

      const endpoint = editingAssignment 
        ? `/admin/vendor/management/${editingAssignment.id}`
        : '/admin/vendor/management/assign';
      const method = editingAssignment ? 'put' : 'post';

      const response = editingAssignment
        ? await api.put(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        : await api.post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: editingAssignment ? 'Vendor assignment updated successfully!' : 'Vendor assigned successfully!',
        });
        setIsAssignModalOpen(false);
        setIsEditAssignmentModalOpen(false);
        setEditingAssignment(null);
        setAssignForm({
          serviceId: '',
          vendorId: '',
          hostelId: '',
          status: 'active',
          attachment: null,
        });
        // Refresh assignments
        loadAssignments();
      } else {
        throw new Error(response.message || 'Failed to assign vendor');
      }
    } catch (error: any) {
      console.error('Error assigning vendor:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to assign vendor. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add vendor form submission
  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};
    if (!vendorForm.name.trim()) {
      errors.push('Vendor name is required');
      fieldErrors.name = 'Vendor name is required';
    }
    if (!vendorForm.email.trim()) {
      errors.push('Email is required');
      fieldErrors.email = 'Email is required';
    }
    if (!vendorForm.phone.trim()) {
      errors.push('Phone is required');
      fieldErrors.phone = 'Phone is required';
    }
    if (!vendorForm.companyName.trim()) {
      errors.push('Company name is required');
      fieldErrors.companyName = 'Company name is required';
    }
    if (!vendorForm.category.trim()) {
      errors.push('Category is required');
      fieldErrors.category = 'Category is required';
    }
    if (vendorForm.specialties.length === 0 || vendorForm.specialties.some(s => !s.name.trim())) {
      errors.push('At least one specialty service name is required');
    }
    if (!vendorForm.hostelId) {
      errors.push('Hostel is required');
      fieldErrors.hostelId = 'Hostel is required';
    }
    
    if (errors.length > 0) {
      setVendorFormErrors(fieldErrors);
      setToast({
        open: true,
        type: 'warning',
        message: 'Please fill in all required fields:\n' + errors.join('\n'),
      });
      return;
    }
    
    setIsSubmitting(true);
    setVendorFormErrors({});
    
    try {
      // Prepare request payload according to API specification
      const requestPayload = {
        name: vendorForm.name.trim(),
        companyName: vendorForm.companyName.trim(),
        reference: vendorForm.reference.trim() || null,
        address: vendorForm.address.trim(),
        email: vendorForm.email.trim(),
        phone: vendorForm.phone.trim(),
        alternatePhone: vendorForm.alternatePhone.trim() || null,
        whatsapp: vendorForm.whatsapp.trim() || null,
        country: vendorForm.country || null,
        city: vendorForm.city || null,
        businessDescription: vendorForm.businessDescription.trim() || null,
        profilePhoto: vendorForm.profilePhoto ? vendorForm.profilePhoto.name : null,
        specialty: vendorForm.category.trim(), // Using category as specialty
        services: vendorForm.specialties.map(s => ({
          name: s.name.trim(),
          description: s.description?.trim() || null,
        })).filter(s => s.name),
        location: vendorForm.location.trim() || null,
        attachments: (() => {
          const baseAttachments = [
            ...(vendorForm.cnicFront
              ? [{
                  title: 'CNIC Front',
                  type: 'cnicFront',
                  name: vendorForm.cnicFront.name,
                  uploadedAt: new Date().toISOString(),
                }]
              : []),
            ...(vendorForm.cnicBack
              ? [{
                  title: 'CNIC Back',
                  type: 'cnicBack',
                  name: vendorForm.cnicBack.name,
                  uploadedAt: new Date().toISOString(),
                }]
              : []),
            ...(vendorForm.businessCard
              ? [{
                  title: 'Business Card',
                  type: 'businessCard',
                  name: vendorForm.businessCard.name,
                  uploadedAt: new Date().toISOString(),
                }]
              : []),
            ...vendorForm.additionalAttachments
              .filter((attachment) => attachment.title.trim() || attachment.file)
              .map((attachment) => ({
                title: attachment.title.trim() || attachment.file?.name || 'Attachment',
                type: 'additional',
                name: attachment.file?.name || attachment.title.trim(),
                uploadedAt: new Date().toISOString(),
              })),
            ...vendorForm.attachments,
          ];
          return baseAttachments.length > 0 ? baseAttachments : null;
        })(),
        paymentTerms: vendorForm.paymentTerms,
        hostelId: Number(vendorForm.hostelId),
        status: vendorForm.status,
      };

      // Add optional fields only if they have values
      console.log('📡 Sending vendor creation request:', requestPayload);
      
      // Make API call
      const response = await api.post(API_ROUTES.VENDOR.CREATE, requestPayload);
      
      console.log('✅ Vendor created successfully:', response);
      
      if (response.success && response.data) {
        setToast({
          open: true,
          type: 'success',
          message: response.message || `Vendor "${vendorForm.name}" created successfully!`,
        });
        
        // Reset form
        setVendorForm({
          name: '',
          email: '',
          phone: '',
          alternatePhone: '',
          whatsapp: '',
          reference: '',
          companyName: '',
          address: '',
          country: '',
          city: '',
          location: '',
          businessDescription: '',
          profilePhoto: null,
          previousProfilePhoto: '',
          cnicFront: null,
          cnicBack: null,
          businessCard: null,
          additionalAttachments: [{ id: '1', title: '', file: null }],
          attachments: [],
          category: '',
          specialties: [{ id: '1', name: '', description: '' }],
          hostelId: '',
          paymentTerms: 'prepaid',
          status: 'active',
        });
        setVendorFormErrors({});
        setActiveTab('vendorInfo');
        
        setIsAddVendorModalOpen(false);
        
        // Refresh vendor list if a hostel is selected and the new vendor is for the same hostel
        if (effectiveHostelId && String(vendorForm.hostelId) === effectiveHostelId) {
          // Refetch vendors for the selected hostel
          fetchVendorsByHostel(effectiveHostelId);
        }
      } else {
        throw new Error(response.message || 'Failed to create vendor');
      }
    } catch (error: any) {
      console.error('❌ Error creating vendor:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to create vendor. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add vendor modal close
  const handleAddVendorClose = () => {
    setIsAddVendorModalOpen(false);
    setVendorForm({
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      whatsapp: '',
      reference: '',
      companyName: '',
      address: '',
      country: '',
      city: '',
      location: '',
      businessDescription: '',
      profilePhoto: null,
      previousProfilePhoto: '',
      cnicFront: null,
      cnicBack: null,
      businessCard: null,
      additionalAttachments: [{ id: '1', title: '', file: null }],
      attachments: [],
      category: '',
      specialties: [{ id: '1', name: '', description: '' }],
      hostelId: '',
      paymentTerms: 'prepaid',
      status: 'active',
    });
    setActiveTab('vendorInfo');
  };

  const handleUpdateVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVendor) return;

    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};
    if (!vendorForm.name.trim()) {
      errors.push('Vendor name is required');
      fieldErrors.name = 'Vendor name is required';
    }
    if (!vendorForm.email.trim()) {
      errors.push('Email is required');
      fieldErrors.email = 'Email is required';
    }
    if (!vendorForm.phone.trim()) {
      errors.push('Phone is required');
      fieldErrors.phone = 'Phone is required';
    }
    if (!vendorForm.companyName.trim()) {
      errors.push('Company name is required');
      fieldErrors.companyName = 'Company name is required';
    }
    if (!vendorForm.category.trim()) {
      errors.push('Category is required');
      fieldErrors.category = 'Category is required';
    }
    if (vendorForm.specialties.length === 0 || vendorForm.specialties.some((s) => !s.name.trim())) {
      errors.push('At least one specialty service name is required');
      fieldErrors.specialties = 'At least one specialty service name is required';
      fieldErrors.specialties = 'At least one specialty service name is required';
    }
    if (!vendorForm.hostelId) {
      errors.push('Hostel is required');
      fieldErrors.hostelId = 'Hostel is required';
    }

    if (errors.length > 0) {
      setVendorFormErrors(fieldErrors);
      setToast({
        open: true,
        type: 'warning',
        message: 'Please fill in all required fields:\n' + errors.join('\n'),
      });
      return;
    }

    setIsSubmitting(true);
    setVendorFormErrors({});

    try {
      const requestPayload = {
        name: vendorForm.name.trim(),
        companyName: vendorForm.companyName.trim(),
        reference: vendorForm.reference.trim() || null,
        address: vendorForm.address.trim(),
        email: vendorForm.email.trim(),
        phone: vendorForm.phone.trim(),
        alternatePhone: vendorForm.alternatePhone.trim() || null,
        whatsapp: vendorForm.whatsapp.trim() || null,
        country: vendorForm.country || null,
        city: vendorForm.city || null,
        businessDescription: vendorForm.businessDescription.trim() || null,
        profilePhoto: vendorForm.profilePhoto ? vendorForm.profilePhoto.name : null,
        specialty: vendorForm.category.trim(),
        services: vendorForm.specialties.map((s) => ({
          name: s.name.trim(),
          description: s.description?.trim() || null,
        })).filter((s) => s.name),
        location: vendorForm.location.trim() || null,
        attachments: (() => {
          const baseAttachments = [
            ...(vendorForm.cnicFront ? [{ title: 'CNIC Front', type: 'cnicFront', name: vendorForm.cnicFront.name, uploadedAt: new Date().toISOString() }] : []),
            ...(vendorForm.cnicBack ? [{ title: 'CNIC Back', type: 'cnicBack', name: vendorForm.cnicBack.name, uploadedAt: new Date().toISOString() }] : []),
            ...(vendorForm.businessCard ? [{ title: 'Business Card', type: 'businessCard', name: vendorForm.businessCard.name, uploadedAt: new Date().toISOString() }] : []),
            ...vendorForm.additionalAttachments
              .filter((attachment) => attachment.title.trim() || attachment.file)
              .map((attachment) => ({
                title: attachment.title.trim() || attachment.file?.name || 'Attachment',
                type: 'additional',
                name: attachment.file?.name || attachment.title.trim(),
                uploadedAt: new Date().toISOString(),
              })),
            ...vendorForm.attachments,
          ];
          return baseAttachments.length > 0 ? baseAttachments : null;
        })(),
        paymentTerms: vendorForm.paymentTerms,
        hostelId: Number(vendorForm.hostelId),
        status: vendorForm.status,
      };

      const response = await api.put(API_ROUTES.VENDOR.UPDATE(selectedVendor.id), requestPayload);

      if (response.success && response.data) {
        setToast({
          open: true,
          type: 'success',
          message: response.message || `Vendor "${vendorForm.name}" updated successfully!`,
        });

        setVendorForm({
          name: '',
          email: '',
          phone: '',
          alternatePhone: '',
          whatsapp: '',
          reference: '',
          companyName: '',
          address: '',
          country: '',
          city: '',
          location: '',
          businessDescription: '',
          profilePhoto: null,
          previousProfilePhoto: '',
          cnicFront: null,
          cnicBack: null,
          businessCard: null,
          additionalAttachments: [{ id: '1', title: '', file: null }],
          attachments: [],
          category: '',
          specialties: [{ id: '1', name: '', description: '' }],
          hostelId: '',
          paymentTerms: 'prepaid',
          status: 'active',
        });
        setVendorFormErrors({});
        setActiveTab('vendorInfo');
        setSelectedVendor(null);
        setIsEditVendorModalOpen(false);

        if (selectedHostelId) {
          fetchVendorsByHostel(selectedHostelId);
        }
      } else {
        throw new Error(response.message || 'Failed to update vendor');
      }
    } catch (error: any) {
      console.error('❌ Error updating vendor:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to update vendor. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle specialty service changes
  const handleSpecialtyChange = (id: string, field: 'name' | 'description', value: string) => {
    setVendorForm((prev) => ({
      ...prev,
      specialties: prev.specialties.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addSpecialty = () => {
    setVendorForm((prev) => ({
      ...prev,
      specialties: [...prev.specialties, { id: Date.now().toString(), name: '', description: '' }],
    }));
  };

  const removeSpecialty = (id: string) => {
    setVendorForm((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s.id !== id),
    }));
  };

  // Get category options from vendor categories (user-specific)
  const categoryOptions = useMemo(() => {
    return [
      { value: '', label: 'Select Category' },
      ...vendorCategories.map((cat) => ({ value: cat.name, label: cat.name })),
    ];
  }, [vendorCategories]);

  // Effect to handle body overflow when modal is open
  useEffect(() => {
    if (isAddVendorModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddVendorModalOpen]);

  // Listen for openAddVendorModal event from parent
  useEffect(() => {
    const handleOpenModal = () => {
      setIsAddVendorModalOpen(true);
    };
    window.addEventListener('openAddVendorModal', handleOpenModal);
    return () => {
      window.removeEventListener('openAddVendorModal', handleOpenModal);
    };
  }, []);

  // Handle PDF export for Vendor List
  const handleExportPDFList = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      doc.setFontSize(18);
      doc.text('Vendor List Report', 105, yPos, { align: 'center' });
      yPos += 10;
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      if (filteredVendors.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Vendors', 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        filteredVendors.slice(0, 30).forEach((vendor, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${vendor.name || 'N/A'} - ${vendor.email || 'N/A'} - ${vendor.phone || 'N/A'}`, 20, yPos);
          yPos += 6;
        });
      } else {
        doc.setFontSize(12);
        doc.text('No vendors available', 20, yPos);
      }
      
      doc.save(`vendor-list-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to export PDF. Please try again.',
      });
    }
  };

  // Handle PDF export for Vendor Management
  const handleExportPDFManagement = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      doc.setFontSize(18);
      doc.text('Vendor Management Report', 105, yPos, { align: 'center' });
      yPos += 10;
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      if (servicesWithVendors.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Services & Vendor Assignments', 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        servicesWithVendors.slice(0, 30).forEach((service, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${service.name} - Assigned Vendors: ${service.assignedVendorsCount}`, 20, yPos);
          yPos += 6;
        });
      } else {
        doc.setFontSize(12);
        doc.text('No services available', 20, yPos);
      }
      
      doc.save(`vendor-management-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to export PDF. Please try again.',
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Content */}
        <AnimatePresence mode="wait">
          {activeSection === 'management' ? (
            <motion.div
              key="management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header with Filter and Add Button */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Vendor Management</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage vendor service assignments</p>
                  </div>
                  <div className="flex items-center gap-3 sm:mt-0 mt-2">
                    {/* Hostel Filter - Right side of heading */}
                    <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                      Filter by Hostel:
                    </label>
                    <div className="w-64">
                      <Select
                        value={selectedHostelIdForManagement}
                        onChange={(value) => setSelectedHostelIdForManagement(value)}
                        options={hostelOptions}
                        disabled={hostelsLoading}
                      />
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setAssignForm({ serviceId: '', vendorId: '', hostelId: '', status: 'active', attachment: null });
                        setIsAssignModalOpen(true);
                      }}
                      icon={PlusIcon}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              </div>

              {/* Vendor Management Assignments Table */}
              {assignmentsLoading ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading vendor assignments...</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allAssignments
                          .filter((assignment: any) => 
                            !selectedHostelIdForManagement || 
                            String(assignment.hostelId) === selectedHostelIdForManagement
                          )
                          .length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              No vendor assignments found.
                            </td>
                          </tr>
                        ) : (
                          allAssignments
                            .filter((assignment: any) => 
                              !selectedHostelIdForManagement || 
                              String(assignment.hostelId) === selectedHostelIdForManagement
                            )
                            .map((assignment: any) => (
                              <tr key={assignment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {assignment.service?.name || assignment.serviceName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {assignment.vendor?.name || assignment.vendorName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {assignment.hostel?.name || assignment.hostelName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge
                                    variant={assignment.isActive ? 'success' : 'warning'}
                                  >
                                    {assignment.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {assignment.attachment ? (
                                    <a
                                      href={assignment.attachment}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View
                                    </a>
                                  ) : (
                                    <span className="text-gray-400">No attachment</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingAssignment(assignment);
                                        setAssignForm({
                                          serviceId: String(assignment.serviceId),
                                          vendorId: String(assignment.vendorId),
                                          hostelId: String(assignment.hostelId),
                                          attachment: null,
                                        });
                                        setIsEditAssignmentModalOpen(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedVendor({ id: assignment.id, name: `${assignment.vendor?.name || ''} - ${assignment.service?.name || ''}` } as Vendor);
                                        setIsDeleteConfirmOpen(true);
                                      }}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeSection === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Vendor List</h2>
                    <p className="text-sm text-gray-600 mt-1">View all vendor managements with details and attachments</p>
                  </div>
                </div>
              </div>

              {/* Vendor List Table */}
              {assignmentsLoading ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading vendor managements...</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {filteredVendors.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
                      No vendors found. Try selecting a hostel or adjust your filters.
                    </div>
                  ) : null}

                  {filteredVendors.length > 0 && (
                    <>
                      {(() => {
                        const activeVendors = filteredVendors
                          .filter((vendor: any) => getVendorStatus(vendor) === 'active')
                          .map((vendor: any, index: number) => ({ ...vendor, rowNumber: index + 1 }));

                        const inactiveVendors = filteredVendors
                          .filter((vendor: any) => getVendorStatus(vendor) !== 'active')
                          .map((vendor: any, index: number) => ({
                            ...vendor,
                            rowNumber: activeVendors.length + index + 1,
                          }));

                        const renderVendorTable = (title: string, description: string, vendorsList: any[]) => (
                          <div>
                            <div className="mb-4 rounded-2xl border-l-4 border-blue-500 bg-blue-50/70 p-4">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <div className="text-sm uppercase tracking-wide text-blue-700 font-semibold">{title}</div>
                                  <div className="text-sm text-blue-600">{description}</div>
                                </div>
                                <div className="text-sm font-semibold text-slate-700">Total vendors: {vendorsList.length}</div>
                              </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {vendorsList.map((vendor: any) => {
                                    const isActive = getVendorStatus(vendor) === 'active';
                                    return (
                                      <tr key={vendor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vendor.rowNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          <div className="font-medium truncate">{vendor.name || 'N/A'}</div>
                                          <div className="text-xs text-gray-500 truncate">{vendor.location || vendor.hostel?.name || 'No location'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.companyName || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {vendor.contact?.phone || vendor.phone || 'No phone'}
                                          <div className="text-xs text-gray-500 truncate">{vendor.contact?.email || vendor.email || 'No email'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <Badge
                                            variant={getVendorStatus(vendor) === 'active'
                                              ? 'success'
                                              : getVendorStatus(vendor) === 'suspended'
                                                ? 'danger'
                                                : 'warning'}
                                          >
                                            {vendor.statusLabel || vendor.status || (isActive ? 'Active' : 'Inactive')}
                                          </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center gap-2">
                                          <button
                                            onClick={() => handleViewVendor(vendor)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
                                            title="View Vendor"
                                          >
                                            <EyeIcon className="w-4 h-4" />
                                            View
                                          </button>
                                          <button
                                            onClick={() => handleEditVendor(vendor)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-medium text-sm"
                                            title="Edit Vendor"
                                          >
                                            <PencilIcon className="w-4 h-4" />
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => handleToggleVendorStatus(vendor)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors font-medium text-sm"
                                            title={isActive ? 'Mark vendor as left/inactive' : 'Restore vendor to active'}
                                          >
                                            <ArrowPathIcon className="w-4 h-4" />
                                            {isActive ? 'Mark Left' : 'Restore'}
                                          </button>
                                          <button
                                            onClick={() => handleSuspendVendor(vendor)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors font-medium text-sm"
                                            title="Suspend vendor"
                                          >
                                            <TrashIcon className="w-4 h-4" />
                                            Suspend
                                          </button>
                                          <button
                                            onClick={() => handleDeleteVendor(vendor)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                                            title="Delete Vendor"
                                          >
                                            <TrashIcon className="w-4 h-4" />
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );

                        return (
                          <>
                            {activeVendors.length > 0 && renderVendorTable('Active Vendors', 'Vendors currently available and active.', activeVendors)}
                            {inactiveVendors.length > 0 && (
                              <div className="pt-6 border-t border-blue-200">
                                {renderVendorTable('Inactive Vendors', 'Vendors that are currently inactive or marked left.', inactiveVendors)}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Assign/Edit Vendor Modal */}
      <Modal
        isOpen={isAssignModalOpen || isEditAssignmentModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setIsEditAssignmentModalOpen(false);
          setEditingAssignment(null);
          setAssignForm({ serviceId: '', vendorId: '', hostelId: '', status: 'active', attachment: null });
        }}
        title={editingAssignment ? "Edit Vendor Assignment" : "Assign Vendor to Service"}
        size="lg"
      >
        <form onSubmit={handleAssignVendor} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service <span className="text-red-500">*</span>
            </label>
            <Select
              value={assignForm.serviceId}
              onChange={(value) => setAssignForm({ ...assignForm, serviceId: value })}
              options={serviceOptions}
              disabled={servicesLoading}
              placeholder={servicesLoading ? "Loading services..." : "Select Service"}
            />
            {serviceOptions.length === 0 && !servicesLoading && (
              <p className="text-sm text-amber-600 mt-1">
                No services found. Please add services in Settings → Vendor Service.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor <span className="text-red-500">*</span>
            </label>
            <Select
              value={assignForm.vendorId}
              onChange={(value) => setAssignForm({ ...assignForm, vendorId: value })}
              options={vendorOptions}
              disabled={allVendorsLoading}
              placeholder={allVendorsLoading ? "Loading vendors..." : "Select Vendor"}
            />
            {vendorOptions.length === 0 && !allVendorsLoading && (
              <p className="text-sm text-amber-600 mt-1">
                No active vendors found. Please add vendors first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hostel <span className="text-red-500">*</span>
            </label>
            <Select
              value={assignForm.hostelId}
              onChange={(value) => setAssignForm({ ...assignForm, hostelId: value })}
              options={hostelOptions.filter((opt) => opt.value !== '')}
              disabled={hostelsLoading}
              placeholder={hostelsLoading ? "Loading hostels..." : "Select Hostel"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <Select
              value={assignForm.status || 'active'}
              onChange={(value) => setAssignForm({ ...assignForm, status: value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachment (Image)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setAssignForm({ ...assignForm, attachment: file });
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {assignForm.attachment && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {assignForm.attachment.name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAssignModalOpen(false);
                setAssignForm({ serviceId: '', vendorId: '', hostelId: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={PlusIcon} disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Vendor'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Vendor Modal - Tabbed Interface */}
      <AnimatePresence>
        {isAddVendorModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleAddVendorClose}
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
                  {/* Header */}
                  <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="w-6 h-6 text-white" />
                      <h2 className="text-lg font-semibold text-white">Vendor Info</h2>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex-1 p-4 space-y-2">
                    <button
                      onClick={() => setActiveTab('vendorInfo')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'vendorInfo'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span className="font-medium">Vendor Info</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('vendorService')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'vendorService'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <WrenchScrewdriverIcon className="w-5 h-5" />
                      <span className="font-medium">Vendor Service</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                  {/* Header with Close Button */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {activeTab === 'vendorInfo' && 'VENDOR INFO'}
                        {activeTab === 'vendorService' && 'VENDOR SERVICE'}
                      </h3>
                      <span className="block w-12 h-1 bg-pink-500 mt-1" />
                    </div>
                    <button
                      onClick={handleAddVendorClose}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
                      <XMarkIcon className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={handleAddVendor} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                      {activeTab === 'vendorInfo' && (
                        <div className="space-y-6">
          {/* Vendor Name */}
          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
              Vendor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={vendorForm.name}
              onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
              placeholder="Enter vendor name"
                              className={getVendorFieldClass('name')}
              required
            />
          </div>

                          {/* Email and Phone Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email <span className="text-red-500">*</span>
            </label>
            <input
                                type="email"
                                value={vendorForm.email}
                                onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                                placeholder="vendor@example.com"
                                className={getVendorFieldClass('email')}
              required
            />
          </div>
            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={vendorForm.phone}
                onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                                placeholder="03001234567"
                                className={getVendorFieldClass('phone')}
                required
              />
                            </div>
            </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Alternate Phone
                              </label>
                              <input
                                type="tel"
                                value={vendorForm.alternatePhone}
                                onChange={(e) => setVendorForm({ ...vendorForm, alternatePhone: e.target.value })}
                                placeholder="Alternate phone"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                WhatsApp Number
                              </label>
                              <input
                                type="tel"
                                value={vendorForm.whatsapp}
                                onChange={(e) => setVendorForm({ ...vendorForm, whatsapp: e.target.value })}
                                placeholder="WhatsApp number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          {/* Company Name */}
            <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Company Name <span className="text-red-500">*</span>
              </label>
              <input
                              type="text"
                              value={vendorForm.companyName}
                              onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                              placeholder="Enter company name"
                              className={getVendorFieldClass('companyName')}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Reference
                            </label>
                            <input
                              type="text"
                              value={vendorForm.reference}
                              onChange={(e) => setVendorForm({ ...vendorForm, reference: e.target.value })}
                              placeholder="Reference or source"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          {/* Address */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={vendorForm.address}
                              onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                              placeholder="Enter address"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Country
                              </label>
                              <Select
                                value={vendorForm.country}
                                onChange={(value) => setVendorForm({ ...vendorForm, country: value, city: '' })}
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
                                value={vendorForm.city}
                                onChange={(value) => setVendorForm({ ...vendorForm, city: value })}
                                options={[
                                  { value: '', label: 'Select City' },
                                  ...((countryCityMap[vendorForm.country] || []).map((city) => ({ value: city, label: city }))),
                                ]}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={vendorForm.address}
                              onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                              placeholder="Enter address"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          {/* Location (Google Map Link) */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Location (Google Map Link)
                            </label>
                            <input
                              type="url"
                              value={vendorForm.location}
                              onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                              placeholder="https://maps.google.com/..."
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Business Description
                            </label>
                            <textarea
                              value={vendorForm.businessDescription}
                              onChange={(e) => setVendorForm({ ...vendorForm, businessDescription: e.target.value })}
                              placeholder="Describe the vendor or business"
                              rows={4}
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex flex-col items-center gap-4 py-4 rounded-lg border border-slate-200 bg-white p-4">
                            <div className="relative w-28 h-28 rounded-full border border-slate-300 overflow-hidden bg-slate-100">
                              {vendorForm.profilePhoto ? (
                                <img
                                  src={profilePhotoPreview || undefined}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : vendorForm.previousProfilePhoto ? (
                                <img
                                  src={vendorForm.previousProfilePhoto}
                                  alt="Previous profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-500 text-sm">
                                  No Photo
                                </div>
                              )}
                            </div>
                            <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                              <span>Choose Profile Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  setVendorForm({ ...vendorForm, profilePhoto: file });
                                }}
                                className="hidden"
                              />
                            </label>
                            {vendorForm.profilePhoto && (
                              <p className="text-sm text-slate-600">Selected: {vendorForm.profilePhoto.name}</p>
                            )}
                          </div>

                          {/* Hostel */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hostel <span className="text-red-500">*</span>
            </label>
            <Select
              value={vendorForm.hostelId}
              onChange={(value) => setVendorForm({ ...vendorForm, hostelId: value })}
                                  options={hostelOptions.filter((opt) => opt.value !== '')}
              disabled={hostelsLoading}
              placeholder={hostelsLoading ? "Loading hostels..." : "Select Hostel"}
            />
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Status <span className="text-red-500">*</span>
                            </label>
                            <Select
                              value={vendorForm.status}
                              onChange={(value) => setVendorForm({ ...vendorForm, status: value })}
                              options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'suspended', label: 'Suspended due to Poor experience' },
                              ]}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payment Terms
                              </label>
                              <Select
                                value={vendorForm.paymentTerms}
                                onChange={(value) => setVendorForm({ ...vendorForm, paymentTerms: value })}
                                options={[
                                  { value: 'prepaid', label: 'Prepaid' },
                                  { value: 'cod', label: 'Cash on Delivery (COD)' },
                                  { value: 'net15', label: 'Net 15' },
                                  { value: 'net30', label: 'Net 30' },
                                  { value: 'net45', label: 'Net 45' },
                                  { value: 'net60', label: 'Net 60' },
                                ]}
                              />
                            </div>
                          </div>

                          {/* CNIC Documents */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                CNIC Front (Image)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setVendorForm({ ...vendorForm, cnicFront: e.target.files?.[0] || null })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {vendorForm.cnicFront && (
                                <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.cnicFront.name}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                CNIC Back (Image)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setVendorForm({ ...vendorForm, cnicBack: e.target.files?.[0] || null })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {vendorForm.cnicBack && (
                                <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.cnicBack.name}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Business Card
                            </label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => setVendorForm({ ...vendorForm, businessCard: e.target.files?.[0] || null })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {vendorForm.businessCard && (
                              <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.businessCard.name}</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-slate-700">Additional Attachments</label>
                              <button
                                type="button"
                                onClick={() =>
                                  setVendorForm({
                                    ...vendorForm,
                                    additionalAttachments: [
                                      ...vendorForm.additionalAttachments,
                                      { id: `${Date.now()}`, title: '', file: null },
                                    ],
                                  })
                                }
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                + Add Attachment
                              </button>
                            </div>
                            <div className="space-y-4">
                              {vendorForm.additionalAttachments.map((attachment, idx) => (
                                <div key={attachment.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                    <input
                                      type="text"
                                      value={attachment.title}
                                      onChange={(e) => {
                                        const next = [...vendorForm.additionalAttachments];
                                        next[idx] = { ...next[idx], title: e.target.value };
                                        setVendorForm({ ...vendorForm, additionalAttachments: next });
                                      }}
                                      placeholder="Attachment title"
                                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        const next = [...vendorForm.additionalAttachments];
                                        next[idx] = { ...next[idx], file: e.target.files?.[0] || null };
                                        setVendorForm({ ...vendorForm, additionalAttachments: next });
                                      }}
                                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {attachment.file && (
                                      <p className="text-sm text-slate-600 mt-1">Selected: {attachment.file.name}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVendorForm({
                                          ...vendorForm,
                                          additionalAttachments: vendorForm.additionalAttachments.filter((_, i) => i !== idx),
                                        });
                                      }}
                                      className="text-sm text-red-600 hover:text-red-800"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'vendorService' && (
                        <div className="space-y-6">
                          {/* Category */}
            <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Category <span className="text-red-500">*</span>
              </label>
              <Select
                              value={vendorForm.category}
                              onChange={(value) => setVendorForm({ ...vendorForm, category: value })}
                              options={categoryOptions}
                              disabled={categoriesLoading}
                              error={vendorFormErrors.category}
              />
            </div>

                          {/* Specialty Services */}
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Specialty Services</h4>
                            <div className="space-y-4">
                              {vendorForm.specialties.map((specialty) => (
                                <div key={specialty.id} className="space-y-2 border border-slate-200 rounded-lg p-4">
                                  <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                      <div>
                                        <label className="block text-xs text-slate-500 mb-1">
                                          Service Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={specialty.name}
                                          onChange={(e) => handleSpecialtyChange(specialty.id, 'name', e.target.value)}
                                          placeholder="e.g., Plumbing, Cleaning, IT Services"
                                          className={getVendorFieldClass('specialties', 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2')}
                                          required
                                        />
                                        {vendorFormErrors.specialties && (
                                          <p className="mt-1 text-xs text-red-600">{vendorFormErrors.specialties}</p>
                                        )}
                                      </div>
                                      <div>
                                        <label className="block text-xs text-slate-500 mb-1">
                                          Description
                                        </label>
                                        <textarea
                                          value={specialty.description}
                                          onChange={(e) => handleSpecialtyChange(specialty.id, 'description', e.target.value)}
                                          placeholder="Enter service description"
                                          rows={3}
                                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    </div>
                                    {vendorForm.specialties.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeSpecialty(specialty.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <XMarkIcon className="w-5 h-5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={addSpecialty}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                              >
                                <PlusIcon className="w-4 h-4" />
                                Add New Service
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
          </div>

                    {/* Footer Buttons */}
                    <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                      <button
              type="button"
              onClick={handleAddVendorClose}
                        className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
                      </button>
                      <button
              type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
          </div>
        </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Vendor Modal */}
      <Modal
        isOpen={isViewVendorModalOpen}
        onClose={() => {
          setIsViewVendorModalOpen(false);
          setSelectedVendor(null);
        }}
        title="Vendor Details"
        size="lg"
      >
        {selectedVendor && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                <p className="text-sm text-gray-900">{selectedVendor.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <p className="text-sm text-gray-900">{selectedVendor.companyName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900">{selectedVendor.contact?.email || selectedVendor.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-sm text-gray-900">{selectedVendor.contact?.phone || selectedVendor.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <p className="text-sm text-gray-900">{selectedVendor.specialty || selectedVendor.primaryService || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Badge variant={
                  selectedVendor.status === 'active' || selectedVendor.statusLabel === 'Active' ? 'success' : 
                  selectedVendor.status === 'pending' || selectedVendor.statusLabel === 'Pending' ? 'warning' : 
                  'default'
                }>
                  {selectedVendor.statusLabel || selectedVendor.status}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
                <p className="text-sm text-gray-900">{selectedVendor.hostel?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                {selectedVendor.attachments && selectedVendor.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {Array.isArray(selectedVendor.attachments) ? (
                      selectedVendor.attachments.map((attachment: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          {attachment.url && (
                            <img 
                              src={attachment.url} 
                              alt={attachment.filename || `Attachment ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <div>
                            <p className="text-sm text-gray-900">{attachment.filename || attachment.originalName || `Attachment ${idx + 1}`}</p>
                            {attachment.url && (
                              <a 
                                href={attachment.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                View Full Size
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-900">No attachments available</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No attachments</p>
                )}
              </div>
            </div>
            {selectedVendor.serviceTags && selectedVendor.serviceTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
                <div className="flex flex-wrap gap-2">
                  {selectedVendor.serviceTags.map((tag, idx) => (
                    <Badge key={idx} variant="default">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Vendor Modal - Reuse Add Vendor Modal structure */}
      <AnimatePresence>
        {isEditVendorModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditVendorModalOpen(false);
                setSelectedVendor(null);
              }}
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
                  {/* Header */}
                  <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="w-6 h-6 text-white" />
                      <h2 className="text-lg font-semibold text-white">Edit Vendor</h2>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex-1 p-4 space-y-2">
                    <button
                      onClick={() => setActiveTab('vendorInfo')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'vendorInfo'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span className="font-medium">Vendor Info</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('vendorService')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'vendorService'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <WrenchScrewdriverIcon className="w-5 h-5" />
                      <span className="font-medium">Vendor Service</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                  {/* Header with Close Button */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {activeTab === 'vendorInfo' && 'EDIT VENDOR INFO'}
                        {activeTab === 'vendorService' && 'EDIT VENDOR SERVICE'}
                      </h3>
                      <span className="block w-12 h-1 bg-pink-500 mt-1" />
                    </div>
                    <button
                      onClick={() => {
                        setIsEditVendorModalOpen(false);
                        setSelectedVendor(null);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>

                  {/* Form Content - Reuse the same form structure as Add Vendor */}
                  <form onSubmit={handleUpdateVendor} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                      {activeTab === 'vendorInfo' && (
                        <div className="space-y-6">
                                                    <div className="flex flex-col items-center gap-4 py-4 rounded-lg border border-slate-200 bg-white p-4">
                            <div className="relative w-28 h-28 rounded-full border border-slate-300 overflow-hidden bg-slate-100">
                              {vendorForm.profilePhoto ? (
                                <img
                                  src={profilePhotoPreview || undefined}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : vendorForm.previousProfilePhoto ? (
                                <img
                                  src={vendorForm.previousProfilePhoto}
                                  alt="Previous profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-500 text-sm">
                                  No Photo
                                </div>
                              )}
                            </div>
                            <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                              <span>Choose Profile Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  setVendorForm({ ...vendorForm, profilePhoto: file });
                                }}
                                className="hidden"
                              />
                            </label>
                            {vendorForm.profilePhoto && (
                              <p className="text-sm text-slate-600">Selected: {vendorForm.profilePhoto.name}</p>
                            )}
                          </div>
                          {/* Vendor Name */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Vendor Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={vendorForm.name}
                              onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                              placeholder="Enter vendor name"
                              className={getVendorFieldClass('name')}
                              required
                            />
                          </div>

                          {/* Email and Phone Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                value={vendorForm.email}
                                onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                                placeholder="vendor@example.com"
                                                  className={getVendorFieldClass('email')}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                value={vendorForm.phone}
                                onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                                placeholder="03001234567"
                                                className={getVendorFieldClass('phone')}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Alternate Phone
                              </label>
                              <input
                                type="tel"
                                value={vendorForm.alternatePhone}
                                onChange={(e) => setVendorForm({ ...vendorForm, alternatePhone: e.target.value })}
                                placeholder="Alternate phone"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                WhatsApp Number
                              </label>
                              <input
                                type="tel"
                                value={vendorForm.whatsapp}
                                onChange={(e) => setVendorForm({ ...vendorForm, whatsapp: e.target.value })}
                                placeholder="WhatsApp number"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          {/* Company Name */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={vendorForm.companyName}
                              onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                              placeholder="Enter company name"
                              className={getVendorFieldClass('companyName')}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Reference
                            </label>
                            <input
                              type="text"
                              value={vendorForm.reference}
                              onChange={(e) => setVendorForm({ ...vendorForm, reference: e.target.value })}
                              placeholder="Reference or source"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          {/* Address */}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Country
                              </label>
                              <Select
                                value={vendorForm.country}
                                onChange={(value) => setVendorForm({ ...vendorForm, country: value, city: '' })}
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
                                value={vendorForm.city}
                                onChange={(value) => setVendorForm({ ...vendorForm, city: value })}
                                options={[
                                  { value: '', label: 'Select City' },
                                  ...((countryCityMap[vendorForm.country] || []).map((city) => ({ value: city, label: city }))),
                                ]}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={vendorForm.address}
                              onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                              placeholder="Enter address"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          {/* Location (Google Map Link) */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Location (Google Map Link)
                            </label>
                            <input
                              type="url"
                              value={vendorForm.location}
                              onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                              placeholder="https://maps.google.com/..."
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Business Description
                            </label>
                            <textarea
                              value={vendorForm.businessDescription}
                              onChange={(e) => setVendorForm({ ...vendorForm, businessDescription: e.target.value })}
                              placeholder="Describe the vendor or business"
                              rows={4}
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>


                          {/* Hostel */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hostel <span className="text-red-500">*</span>
            </label>
            <Select
              value={vendorForm.hostelId}
              onChange={(value) => setVendorForm({ ...vendorForm, hostelId: value })}
                                  options={hostelOptions.filter((opt) => opt.value !== '')}
              disabled={hostelsLoading}
              placeholder={hostelsLoading ? "Loading hostels..." : "Select Hostel"}
            />
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Status <span className="text-red-500">*</span>
                            </label>
                            <Select
                              value={vendorForm.status}
                              onChange={(value) => setVendorForm({ ...vendorForm, status: value })}
                              options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'suspended', label: 'Suspended due to Poor experience' },
                              ]}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payment Terms
                              </label>
                              <Select
                                value={vendorForm.paymentTerms}
                                onChange={(value) => setVendorForm({ ...vendorForm, paymentTerms: value })}
                                options={[
                                  { value: 'prepaid', label: 'Prepaid' },
                                  { value: 'cod', label: 'Cash on Delivery (COD)' },
                                  { value: 'net15', label: 'Net 15' },
                                  { value: 'net30', label: 'Net 30' },
                                  { value: 'net45', label: 'Net 45' },
                                  { value: 'net60', label: 'Net 60' },
                                ]}
                              />
                            </div>
                          </div>

                          {/* CNIC Documents */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                CNIC Front (Image)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setVendorForm({ ...vendorForm, cnicFront: e.target.files?.[0] || null })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {vendorForm.cnicFront && (
                                <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.cnicFront.name}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                CNIC Back (Image)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setVendorForm({ ...vendorForm, cnicBack: e.target.files?.[0] || null })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {vendorForm.cnicBack && (
                                <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.cnicBack.name}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Business Card
                            </label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => setVendorForm({ ...vendorForm, businessCard: e.target.files?.[0] || null })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {vendorForm.businessCard && (
                              <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.businessCard.name}</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-slate-700">Additional Attachments</label>
                              <button
                                type="button"
                                onClick={() =>
                                  setVendorForm({
                                    ...vendorForm,
                                    additionalAttachments: [
                                      ...vendorForm.additionalAttachments,
                                      { id: `${Date.now()}`, title: '', file: null },
                                    ],
                                  })
                                }
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                + Add Attachment
                              </button>
                            </div>
                            <div className="space-y-4">
                              {vendorForm.additionalAttachments.map((attachment, idx) => (
                                <div key={attachment.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                    <input
                                      type="text"
                                      value={attachment.title}
                                      onChange={(e) => {
                                        const next = [...vendorForm.additionalAttachments];
                                        next[idx] = { ...next[idx], title: e.target.value };
                                        setVendorForm({ ...vendorForm, additionalAttachments: next });
                                      }}
                                      placeholder="Attachment title"
                                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        const next = [...vendorForm.additionalAttachments];
                                        next[idx] = { ...next[idx], file: e.target.files?.[0] || null };
                                        setVendorForm({ ...vendorForm, additionalAttachments: next });
                                      }}
                                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {attachment.file && (
                                      <p className="text-sm text-slate-600 mt-1">Selected: {attachment.file.name}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVendorForm({
                                          ...vendorForm,
                                          additionalAttachments: vendorForm.additionalAttachments.filter((_, i) => i !== idx),
                                        });
                                      }}
                                      className="text-sm text-red-600 hover:text-red-800"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'vendorService' && (
                        <div className="space-y-6">
                          {/* Category */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Category <span className="text-red-500">*</span>
                            </label>
                            <Select
                              value={vendorForm.category}
                              onChange={(value) => setVendorForm({ ...vendorForm, category: value })}
                              options={categoryOptions}
                              disabled={categoriesLoading}
                              error={vendorFormErrors.category}
                            />
                          </div>

                          {/* Specialty Services */}
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-4">Specialty Services</h4>
                            <div className="space-y-4">
                              {vendorForm.specialties.map((specialty) => (
                                <div key={specialty.id} className="space-y-2 border border-slate-200 rounded-lg p-4">
                                  <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                      <div>
                                        <label className="block text-xs text-slate-500 mb-1">
                                          Service Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={specialty.name}
                                          onChange={(e) => handleSpecialtyChange(specialty.id, 'name', e.target.value)}
                                          placeholder="e.g., Plumbing, Cleaning, IT Services"
                                          className={getVendorFieldClass('specialties', 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2')}
                                          required
                                        />
                                        {vendorFormErrors.specialties && (
                                          <p className="mt-1 text-xs text-red-600">{vendorFormErrors.specialties}</p>
                                        )}
                                      </div>
                                      <div>
                                        <label className="block text-xs text-slate-500 mb-1">
                                          Description
                                        </label>
                                        <textarea
                                          value={specialty.description}
                                          onChange={(e) => handleSpecialtyChange(specialty.id, 'description', e.target.value)}
                                          placeholder="Enter service description"
                                          rows={3}
                                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    </div>
                                    {vendorForm.specialties.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeSpecialty(specialty.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <XMarkIcon className="w-5 h-5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={addSpecialty}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                              >
                                <PlusIcon className="w-4 h-4" />
                                Add New Service
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditVendorModalOpen(false);
                          setSelectedVendor(null);
                        }}
                        className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Updating...' : 'Update Vendor'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedVendor(null);
        }}
        title="Delete Vendor"
        size="md"
      >
        {selectedVendor && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{selectedVendor.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setSelectedVendor(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmDeleteVendor}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        )}
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

export default VendorList;
