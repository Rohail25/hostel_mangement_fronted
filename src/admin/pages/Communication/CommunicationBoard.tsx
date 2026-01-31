/**
 * CommunicationBoard page
 * Communication management with tab-based filtering - Shows biodata/profiles
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BriefcaseIcon,
  HomeIcon,
  CalendarIcon,
  StarIcon,
  PaperAirplaneIcon,
  EyeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  MapPinIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import ROUTES from '../../routes/routePaths';
import { Badge } from '../../components/Badge';
import { Select } from '../../components/Select';
import TenantTable from '../People/components/TenantTable';
import EmployeeTable from '../People/components/EmployeeTable';
import VendorTable from '../People/components/VendorTable';
import TenantForm from '../People/components/TenantForm';
import EmployeeForm from '../People/components/EmployeeForm';
import VendorForm from '../People/components/VendorForm';
import type { Tenant } from '../../types/people';
import type { Employee } from '../../types/people';
import type { Vendor } from '../../types/comms';
import tenantsData from '../../mock/tenants.json';
import employeesData from '../../mock/employees.json';
import vendorsData from '../../mock/vendors.json';
import accountsData from '../../mock/accounts.json';
import * as hostelService from '../../services/hostel.service';
import * as tenantService from '../../services/tenant.service';
import * as employeeService from '../../services/employee.service';
import { api } from '../../../services/apiClient';
import { API_BASE_URL, API_ROUTES } from '../../../services/api.config';
import { formatDate, formatCurrency } from '../../types/common';

type ActiveTab = 'Tenants' | 'Employees' | 'Vendors';

/**
 * Communication board page - Shows all biodata
 */
const CommunicationBoard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab from route
  const getActiveTab = (): ActiveTab => {
    if (location.pathname.includes('/communication/employees')) return 'Employees';
    if (location.pathname.includes('/communication/vendors')) return 'Vendors';
    return 'Tenants'; // Default
  };
  
  const activeTab = getActiveTab();
  
  // Redirect to /communication/tenants if just /communication
  useEffect(() => {
    if (location.pathname === ROUTES.COMM) {
      navigate(ROUTES.COMM_TENANTS, { replace: true });
    }
  }, [location.pathname, navigate]);
  const [hostelFilter, setHostelFilter] = useState('');
  const [hostels, setHostels] = useState<Array<{ id: number; name: string; city: string }>>([]);
  const [hostelsLoading, setHostelsLoading] = useState<boolean>(true);
  const [tenants, setTenants] = useState<any[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState<boolean>(false);
  const [isEmailCampaignOpen, setIsEmailCampaignOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    campaignType: 'email', // 'email' or 'whatsapp'
    message: '',
    sendToTenant: false,
    sendToEmployee: false,
    sendToVendor: false,
  });
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    type: 'Tenant' | 'Employee' | 'Vendor';
    data: any;
  }>({
    isOpen: false,
    type: 'Tenant',
    data: null,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  // State to control viewing via form
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [viewFormData, setViewFormData] = useState<any>(null);
  const [viewFormType, setViewFormType] = useState<'Tenant' | 'Employee' | 'Vendor'>('Tenant');
  const [viewingId, setViewingId] = useState<number | null>(null);

  // Fetch roles for EmployeeForm
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const rolesData = await employeeService.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const roleOptions = useMemo(() => {
    return roles.map(role => ({
      value: String(role.id),
      label: role.name
    }));
  }, [roles]);

  // Fetch hostels from API on component mount
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setHostelsLoading(true);
        const hostelsData = await hostelService.getAllHostelsFromAPI();
        setHostels(hostelsData);
      } catch (err: any) {
        console.error('Error fetching hostels:', err);
        setHostels([]);
      } finally {
        setHostelsLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Fetch vendors from API or mock
  const [vendors, setVendors] = useState<any[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState<boolean>(false);

  // Fetch tenants from API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setTenantsLoading(true);
        if (hostelFilter) {
          const data = await tenantService.getTenantsByHostel(Number(hostelFilter));
          setTenants(data);
        } else {
          const data = await tenantService.getAllTenants();
          setTenants(data);
        }
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setTenants([]);
      } finally {
        setTenantsLoading(false);
      }
    };

    fetchTenants();
  }, [hostelFilter]);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setEmployeesLoading(true);
        if (hostelFilter) {
          const data = await employeeService.getEmployeesByHostel(Number(hostelFilter));
          setEmployees(data);
        } else {
          const data = await employeeService.getAllEmployees();
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchEmployees();
  }, [hostelFilter]);

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setVendorsLoading(true);
        if (hostelFilter) {
          const response = await api.get(API_ROUTES.VENDOR.BY_HOSTEL(Number(hostelFilter)));
          if (response.success && response.data) {
            const vendorList = Array.isArray(response.data) ? response.data : response.data.data || [];
            setVendors(vendorList);
          } else {
            setVendors([]);
          }
        } else {
          const response = await api.get(API_ROUTES.VENDOR.LIST);
          if (response.success && response.data) {
            const vendorList = Array.isArray(response.data) ? response.data : response.data.data || [];
            setVendors(vendorList);
          } else {
            setVendors([]);
          }
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setVendors([]);
      } finally {
        setVendorsLoading(false);
      }
    };
    fetchVendors();
  }, [hostelFilter]);

  const filteredTenants = tenants;
  const filteredEmployees = employees;
  const filteredVendors = vendors;

  // Prepare hostel options for dropdown
  const hostelOptions = useMemo(() => {
    if (hostelsLoading) {
      return [{ value: '', label: 'Loading hostels...' }];
    }
    const options = [{ value: '', label: 'All Hostels' }];
    hostels.forEach((hostel) => {
      options.push({
        value: String(hostel.id),
        label: `${hostel.name} - ${hostel.city}`,
      });
    });
    return options;
  }, [hostels, hostelsLoading]);

  // Get selected hostel name for display
  const selectedHostelName = useMemo(() => {
    if (!hostelFilter) return null;
    const hostel = hostels.find((h) => String(h.id) === hostelFilter);
    return hostel?.name || null;
  }, [hostelFilter, hostels]);


  const handleEmailCampaign = () => {
    setIsEmailCampaignOpen(true);
  };

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.message.trim()) {
      alert('Please fill in the message field.');
      return;
    }
    
    if (!campaignForm.sendToTenant && !campaignForm.sendToEmployee && !campaignForm.sendToVendor) {
      alert('Please select at least one recipient type (Tenant, Employee, or Vendor).');
      return;
    }
    
    console.log('Campaign:', campaignForm);
    const recipients = [];
    if (campaignForm.sendToTenant) recipients.push('Tenants');
    if (campaignForm.sendToEmployee) recipients.push('Employees');
    if (campaignForm.sendToVendor) recipients.push('Vendors');
    
    alert(`${campaignForm.campaignType === 'email' ? 'Email' : 'WhatsApp'} Campaign Created!\n\nType: ${campaignForm.campaignType}\n\nMessage: ${campaignForm.message}\n\nRecipients: ${recipients.join(', ')}`);
    
    // Reset form and close modal
    setCampaignForm({ 
      campaignType: 'email',
      message: '',
      sendToTenant: false,
      sendToEmployee: false,
      sendToVendor: false,
    });
    setIsEmailCampaignOpen(false);
  };

  const handleCampaignClose = () => {
    setCampaignForm({ 
      campaignType: 'email',
      message: '',
      sendToTenant: false,
      sendToEmployee: false,
      sendToVendor: false,
    });
    setIsEmailCampaignOpen(false);
  };

  // Handle PDF export
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      doc.setFontSize(18);
      doc.text(`${activeTab} Communication Report`, 105, yPos, { align: 'center' });
      yPos += 10;
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      let dataToExport: any[] = [];
      if (activeTab === 'Tenants') {
        dataToExport = tenants;
      } else if (activeTab === 'Employees') {
        dataToExport = employees;
      } else if (activeTab === 'Vendors') {
        dataToExport = filteredVendors;
      }
      
      if (dataToExport.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${activeTab} List`, 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        dataToExport.slice(0, 30).forEach((item, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${item.name || 'N/A'} - ${item.email || item.phone || 'N/A'}`, 20, yPos);
          yPos += 6;
        });
      } else {
        doc.setFontSize(12);
        doc.text(`No ${activeTab.toLowerCase()} available`, 20, yPos);
      }
      
      doc.save(`communication-${activeTab.toLowerCase()}-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleView = async (type: 'Tenant' | 'Employee' | 'Vendor', data: any) => {
    setViewingId(data.id);
    setViewFormType(type);
    
    if (type === 'Tenant') {
      // Fetch full tenant details from API
      try {
        setTenantsLoading(true);
        const tenantData = await tenantService.getTenantById(data.id);
        if (tenantData) {
          // Map API response to display format for TenantForm
          const mappedData = {
            fullName: tenantData.name || `${tenantData.firstName} ${tenantData.lastName}`,
            fatherName: tenantData.fatherName || '',
            email: tenantData.email || '',
            phone: tenantData.phone || '',
            whatsappNumber: tenantData.whatsappNumber || '',
            gender: tenantData.gender || '',
            dateOfBirth: tenantData.dateOfBirth || '',
            cnicNumber: tenantData.cnicNumber || '',
            professionType: tenantData.professionType || '',
            academicName: tenantData.academicName || '',
            academicAddress: tenantData.academicAddress || '',
            academicLocation: tenantData.academicLocation || '',
            studentCardNo: tenantData.studentCardNo || '',
            jobTitle: tenantData.jobTitle || '',
            companyName: tenantData.companyName || '',
            jobAddress: tenantData.jobAddress || '',
            jobLocation: tenantData.jobLocation || '',
            jobIdNo: tenantData.jobIdNo || '',
            businessName: tenantData.businessName || '',
            businessAddress: tenantData.businessAddress || '',
            businessLocation: tenantData.businessLocation || '',
            professionDescription: tenantData.professionDescription || '',
            emergencyContactName: tenantData.emergencyContactName || '',
            emergencyContactNumber: tenantData.emergencyContactNumber || '',
            emergencyContactWhatsapp: tenantData.emergencyContactWhatsapp || '',
            emergencyContactRelation: tenantData.emergencyContactRelation || '',
            anyDisease: tenantData.anyDisease || '',
            bloodGroup: tenantData.bloodGroup || '',
            nearestRelativeContact: tenantData.nearestRelativeContact || '',
            nearestRelativeWhatsapp: tenantData.nearestRelativeWhatsapp || '',
            nearestRelativeRelation: tenantData.nearestRelativeRelation || '',
            hostelId: String(tenantData.activeAllocation?.hostelId || ''),
            floorId: String(tenantData.activeAllocation?.floorId || ''),
            roomId: String(tenantData.activeAllocation?.roomId || ''),
            bedId: String(tenantData.activeAllocation?.bedId || ''),
            leaseStartDate: tenantData.leaseStartDate || '',
            leaseEndDate: tenantData.leaseEndDate || '',
            monthlyRent: String(tenantData.monthlyRent || ''),
            securityDeposit: String(tenantData.securityDeposit || ''),
            previousProfilePhoto: tenantData.profilePhoto,
          };
          setViewFormData(mappedData);
          setIsViewFormOpen(true);
        }
      } catch (error) {
        console.error('Error fetching tenant details:', error);
      } finally {
        setTenantsLoading(false);
      }
    } else if (type === 'Employee') {
      // Fetch full employee details from API
      try {
        setEmployeesLoading(true);
        const employeeData = await employeeService.getEmployeeById(data.id);
        if (employeeData) {
          // Map API response to display format for EmployeeForm
          const mappedData = {
            name: employeeData.user?.username || employeeData.user?.email || 'Unknown',
            email: employeeData.user?.email || '',
            phone: employeeData.user?.phone || '',
            whatsappNumber: employeeData.whatsappNumber || '',
            address: employeeData.address || { street: '', city: '', country: '' },
            roleId: String(employeeData.roleId || ''),
            hostelId: String(employeeData.hostelId || ''),
            joinDate: employeeData.joinDate || '',
            salary: String(employeeData.salary || ''),
            salaryType: employeeData.salaryType || 'monthly',
            workingHours: employeeData.workingHours || '',
            reference: employeeData.reference || '',
            notes: employeeData.notes || '',
            professionType: employeeData.professionType || '',
            emergencyContactName: employeeData.emergencyContactName || '',
            emergencyContactNumber: employeeData.emergencyContactNumber || '',
            emergencyContactWhatsapp: employeeData.emergencyContactWhatsapp || '',
            emergencyContactRelation: employeeData.emergencyContactRelation || '',
            anyDisease: employeeData.anyDisease || '',
            bloodGroup: employeeData.bloodGroup || '',
            nearestRelativeContact: employeeData.nearestRelativeContact || '',
            nearestRelativeWhatsapp: employeeData.nearestRelativeWhatsapp || '',
            nearestRelativeRelation: employeeData.nearestRelativeRelation || '',
            username: employeeData.user?.username || '',
            previousProfilePhoto: employeeData.profilePhoto,
          };
          setViewFormData(mappedData);
          setIsViewFormOpen(true);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      } finally {
        setEmployeesLoading(false);
      }
    } else if (type === 'Vendor') {
      // Fetch full vendor details from API
      try {
        setVendorsLoading(true);
        const response = await api.get(API_ROUTES.VENDOR.BY_ID(data.id));
        if (response.success && response.data) {
          const vendorData = response.data;
          // Map API response to display format for VendorForm
          const mappedData = {
            name: vendorData.name || '',
            email: vendorData.contact?.email || vendorData.email || '',
            phone: vendorData.contact?.phone || vendorData.phone || '',
            companyName: vendorData.companyName || '',
            address: vendorData.address || '',
            location: vendorData.location || '',
            category: vendorData.category || '',
            specialties: vendorData.services && vendorData.services.length > 0
              ? vendorData.services.map((s: any, idx: number) => ({
                  id: String(idx + 1),
                  name: s.name || s.specialty || '',
                  description: s.description || '',
                }))
              : [{ id: '1', name: vendorData.specialty || '', description: '' }],
            rating: vendorData.rating?.average ? String(vendorData.rating.average) : '4.5',
            hostelId: vendorData.hostelId ? String(vendorData.hostelId) : '',
            paymentTerms: vendorData.paymentTerms || 'prepaid',
            status: vendorData.status || 'active',
            attachments: vendorData.attachments || [],
          };
          setViewFormData(mappedData);
          setIsViewFormOpen(true);
        }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      } finally {
        setVendorsLoading(false);
      }
    }
  };

  const handleViewClose = () => {
    setViewModal({ isOpen: false, type: 'Tenant', data: null });
    setIsViewFormOpen(false);
    setViewFormData(null);
    setViewingId(null);
  };

  const handleEdit = (id: number, type: 'Tenant' | 'Employee' | 'Vendor') => {
    // This is just to satisfy the table's onEdit prop, but we might not need full edit here
    // based on the user's request to "show all detail according to this user" when clicking View.
    // However, if we want to allow editing from here too:
    const data = type === 'Tenant' 
      ? filteredTenants.find(t => t.id === id)
      : type === 'Employee'
      ? filteredEmployees.find(e => e.id === id)
      : filteredVendors.find(v => v.id === id);
    
    if (data) {
      handleView(type, data);
    }
  };

  const handleDelete = (id: number, type: 'Tenant' | 'Employee' | 'Vendor', name: string) => {
    if (window.confirm(`Are you sure you want to delete ${type} ${name}?`)) {
      console.log(`Deleting ${type} with id ${id}`);
      // Implement delete logic if needed
    }
  };

  // Get transactions for tenant (filtered by hostel if selected)
  const getTenantTransactions = useMemo(() => {
    if (!viewModal.data || viewModal.type !== 'Tenant') return [];
    let transactions = accountsData.filter(
      (account) => account.tenantName === viewModal.data.name
    );
    // Apply hostel filter if active
    if (hostelFilter) {
      transactions = transactions.filter((t) => String(t.hostelId) === hostelFilter);
    }
    return transactions;
  }, [viewModal.data, viewModal.type, hostelFilter]);

  // Get transactions for vendor (expenses that might be related, filtered by hostel)
  const getVendorTransactions = useMemo(() => {
    if (!viewModal.data || viewModal.type !== 'Vendor') return [];
    // Match vendor name in expense descriptions
    let transactions = accountsData.filter(
      (account) =>
        account.type === 'Expense' &&
        account.description &&
        account.description.toLowerCase().includes(viewModal.data.name.toLowerCase())
    );
    // Apply hostel filter if active
    if (hostelFilter) {
      transactions = transactions.filter((t) => String(t.hostelId) === hostelFilter);
    }
    return transactions;
  }, [viewModal.data, viewModal.type, hostelFilter]);

  return (
    <div className="space-y-6">
      {/* Header with Hostel Filter */}
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Communication Directory</h1>
          <p className="text-slate-600 mt-1">
            View biodata and contact information for tenants, employees, and vendors
          </p>
        </div>
        <div className="flex items-center gap-3 sm:mt-0 mt-2">
          {/* Hostel Filter - Right side of heading */}
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            Filter by Hostel:
          </label>
          <div className="w-64">
            <Select
              value={hostelFilter}
              onChange={setHostelFilter}
              options={hostelOptions}
              placeholder={hostelsLoading ? "Loading hostels..." : "Select Hostel"}
              disabled={hostelsLoading}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            icon={ArrowDownTrayIcon}
          >
            Export PDF
          </Button>
          <Button
            variant="primary"
            onClick={handleEmailCampaign}
            icon={PaperAirplaneIcon}
          >
            Campaign
          </Button>
        </div>
      </div>

      {/* Selected Hostel Badge - Below header */}
      {selectedHostelName && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-100/50 rounded-lg border border-brand-200/50 w-fit"
        >
          <span className="text-xs text-brand-700 font-medium">Showing:</span>
          <span className="text-sm text-brand-900 font-semibold">{selectedHostelName}</span>
        </motion.div>
      )}

      {/* Content - No tabs, navigation handled by second sidebar */}
      <div className="glass rounded-2xl border border-white/20 shadow-xl">
        {/* Biodata Table */}
        <div className="p-6">
          {/* Tenants */}
          {activeTab === 'Tenants' && (
            <div className="overflow-x-auto">
              {tenantsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading tenants...</p>
                </div>
              ) : (
                <TenantTable
                  tenants={filteredTenants}
                  onView={(id) => {
                    const tenant = filteredTenants.find(t => t.id === id);
                    if (tenant) handleView('Tenant', tenant);
                  }}
                  onEdit={(id) => handleEdit(id, 'Tenant')}
                  onDelete={(id, name) => handleDelete(id, 'Tenant', name)}
                />
              )}
            </div>
          )}

          {/* Employees */}
          {activeTab === 'Employees' && (
            <div className="overflow-x-auto">
              {employeesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading employees...</p>
                </div>
              ) : (
                <EmployeeTable
                  employees={filteredEmployees}
                  onView={(id) => {
                    const employee = filteredEmployees.find(e => e.id === id);
                    if (employee) handleView('Employee', employee);
                  }}
                  onEdit={(id) => handleEdit(id, 'Employee')}
                  onDelete={(id, name) => handleDelete(id, 'Employee', name)}
                />
              )}
            </div>
          )}

          {/* Vendors */}
          {activeTab === 'Vendors' && (
            <div className="overflow-x-auto">
              {vendorsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading vendors...</p>
                </div>
              ) : (
                <VendorTable
                  vendors={filteredVendors}
                  onView={(id) => {
                    const vendor = filteredVendors.find(v => v.id === id);
                    if (vendor) handleView('Vendor', vendor);
                  }}
                  onEdit={(id) => handleEdit(id, 'Vendor')}
                  onDelete={(id, name) => handleDelete(id, 'Vendor', name)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="glass p-6 rounded-2xl border border-white/20 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Directory Summary {selectedHostelName && `- ${selectedHostelName}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <UserCircleIcon className="w-6 h-6 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Total Tenants</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{filteredTenants.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <BriefcaseIcon className="w-6 h-6 text-green-600" />
              <p className="text-sm font-medium text-green-900">Total Employees</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{filteredEmployees.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <UserCircleIcon className="w-6 h-6 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">Total Vendors</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{filteredVendors.length}</p>
          </div>
        </div>
      </div>

      {/* Campaign Modal with Sidebar Layout */}
      <AnimatePresence>
        {isEmailCampaignOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCampaignClose}
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
                  <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <PaperAirplaneIcon className="w-6 h-6 text-white" />
                      <h2 className="text-lg font-semibold text-white">Campaign</h2>
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                      <span className="font-medium">Campaign</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">CAMPAIGN</h3>
                      <span className="block w-12 h-1 bg-pink-500 mt-1" />
                    </div>
                    <button
                      onClick={handleCampaignClose}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>

                  <form onSubmit={handleCampaignSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Campaign Type Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Campaign <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={campaignForm.campaignType}
                          onChange={(value) => setCampaignForm({ ...campaignForm, campaignType: value })}
                          options={[
                            { value: 'email', label: 'Email' },
                            { value: 'whatsapp', label: 'WhatsApp' },
                          ]}
                        />
                      </div>

                      {/* Message Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Messages <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          value={campaignForm.message}
                          onChange={(e) => setCampaignForm({ ...campaignForm, message: e.target.value })}
                          placeholder="Enter your message..."
                          rows={10}
                          className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                        />
                      </div>

                      {/* Send To Checkboxes */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Send <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={campaignForm.sendToTenant}
                              onChange={(e) => setCampaignForm({ ...campaignForm, sendToTenant: e.target.checked })}
                              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Tenant</span>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={campaignForm.sendToEmployee}
                              onChange={(e) => setCampaignForm({ ...campaignForm, sendToEmployee: e.target.checked })}
                              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Employee</span>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={campaignForm.sendToVendor}
                              onChange={(e) => setCampaignForm({ ...campaignForm, sendToVendor: e.target.checked })}
                              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Vendor</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCampaignClose}
                        className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Send Campaign
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={handleViewClose}
        title={`${viewModal.type} Details`}
        size="xl"
      >
        {viewModal.data && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              {viewModal.data.profilePhoto ? (
                <img 
                  src={`${API_BASE_URL.replace('/api', '')}${viewModal.data.profilePhoto}`} 
                  alt={viewModal.data.name}
                  className={`w-20 h-20 rounded-full object-cover border-4 shadow-lg ${
                    viewModal.type === 'Tenant'
                      ? 'border-blue-200'
                      : viewModal.type === 'Employee'
                      ? 'border-green-200'
                      : 'border-purple-200'
                  }`}
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = `w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
                        viewModal.type === 'Tenant'
                          ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                          : viewModal.type === 'Employee'
                          ? 'bg-gradient-to-br from-green-400 to-green-600'
                          : 'bg-gradient-to-br from-purple-400 to-purple-600'
                      }`;
                      if (viewModal.type === 'Tenant') {
                        const firstName = viewModal.data.firstName || viewModal.data.name?.split(' ')[0] || '';
                        const lastName = viewModal.data.lastName || viewModal.data.name?.split(' ')[1] || '';
                        fallback.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || viewModal.data.name.charAt(0).toUpperCase();
                      } else if (viewModal.type === 'Employee') {
                        const nameParts = viewModal.data.name?.split(' ') || [];
                        const firstName = nameParts[0] || '';
                        const lastName = nameParts[1] || '';
                        fallback.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || viewModal.data.name.charAt(0).toUpperCase();
                      } else {
                        fallback.textContent = viewModal.data.name.charAt(0).toUpperCase();
                      }
                      parent.insertBefore(fallback, target);
                    }
                  }}
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
                    viewModal.type === 'Tenant'
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                      : viewModal.type === 'Employee'
                      ? 'bg-gradient-to-br from-green-400 to-green-600'
                      : 'bg-gradient-to-br from-purple-400 to-purple-600'
                  }`}
                >
                  {viewModal.type === 'Tenant' ? (
                    (() => {
                      const firstName = viewModal.data.firstName || viewModal.data.name?.split(' ')[0] || '';
                      const lastName = viewModal.data.lastName || viewModal.data.name?.split(' ')[1] || '';
                      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || viewModal.data.name.charAt(0).toUpperCase();
                    })()
                  ) : viewModal.type === 'Employee' ? (
                    (() => {
                      const nameParts = viewModal.data.name?.split(' ') || [];
                      const firstName = nameParts[0] || '';
                      const lastName = nameParts[1] || '';
                      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || viewModal.data.name.charAt(0).toUpperCase();
                    })()
                  ) : (
                    viewModal.data.name.charAt(0).toUpperCase()
                  )}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {viewModal.data.name}
                </h3>
                <Badge
                  variant={
                    viewModal.data.status === 'Active' ? 'success' : 'default'
                  }
                >
                  {viewModal.data.status}
                </Badge>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewModal.type === 'Tenant' && (
                  <>
                    <InfoField label="Email" value={viewModal.data.email} icon={EnvelopeIcon} />
                    <InfoField label="Phone" value={viewModal.data.phone} icon={PhoneIcon} />
                    {viewModal.data.alternatePhone && <InfoField label="Alternate Phone" value={viewModal.data.alternatePhone} icon={PhoneIcon} />}
                    {viewModal.data.activeAllocation && (
                      <InfoField 
                        label="Room" 
                        value={`${viewModal.data.activeAllocation.room?.number || 'N/A'}-${viewModal.data.activeAllocation.bed?.number || 'N/A'}`} 
                        icon={HomeIcon} 
                      />
                    )}
                    {viewModal.data.leaseStartDate && (
                      <InfoField label="Lease Start" value={formatDate(viewModal.data.leaseStartDate)} icon={CalendarIcon} />
                    )}
                    {viewModal.data.leaseEndDate && (
                      <InfoField label="Lease End" value={formatDate(viewModal.data.leaseEndDate)} icon={CalendarIcon} />
                    )}
                    {viewModal.data.monthlyRent && (
                      <InfoField label="Monthly Rent" value={formatCurrency(viewModal.data.monthlyRent)} icon={CurrencyDollarIcon} />
                    )}
                    {viewModal.data.securityDeposit && (
                      <InfoField label="Security Deposit" value={formatCurrency(viewModal.data.securityDeposit)} icon={CurrencyDollarIcon} />
                    )}
                  </>
                )}
                {viewModal.type === 'Employee' && (
                  <>
                    <InfoField label="Email" value={viewModal.data.email} icon={EnvelopeIcon} />
                    <InfoField label="Phone" value={viewModal.data.phone || 'N/A'} icon={PhoneIcon} />
                    <InfoField label="Role" value={viewModal.data.role} icon={BriefcaseIcon} />
                    {viewModal.data.employeeCode && <InfoField label="Employee Code" value={viewModal.data.employeeCode} icon={BriefcaseIcon} />}
                    {viewModal.data.department && <InfoField label="Department" value={viewModal.data.department} icon={BriefcaseIcon} />}
                    {viewModal.data.designation && <InfoField label="Designation" value={viewModal.data.designation} icon={BriefcaseIcon} />}
                    {viewModal.data.joinDate && (
                      <InfoField label="Joined Date" value={formatDate(viewModal.data.joinDate)} icon={CalendarIcon} />
                    )}
                    {viewModal.data.terminationDate && (
                      <InfoField label="Termination Date" value={formatDate(viewModal.data.terminationDate)} icon={CalendarIcon} />
                    )}
                    {viewModal.data.salary && (
                      <InfoField label="Salary" value={`${formatCurrency(viewModal.data.salary)} ${viewModal.data.salaryType || '/month'}`} icon={CurrencyDollarIcon} />
                    )}
                    {viewModal.data.workingHours && (
                      <InfoField label="Working Hours" value={viewModal.data.workingHours} icon={CalendarIcon} />
                    )}
                    {viewModal.data.hostel && viewModal.data.hostel !== 'N/A' && (
                      <InfoField label="Hostel" value={viewModal.data.hostel} icon={HomeIcon} />
                    )}
                    {viewModal.data.address && (
                      <InfoField 
                        label="Address" 
                        value={`${viewModal.data.address.street || ''}, ${viewModal.data.address.city || ''}, ${viewModal.data.address.country || ''}`.replace(/^,\s*|,\s*$/g, '')} 
                        icon={MapPinIcon} 
                      />
                    )}
                    {viewModal.data.emergencyContact && (
                      <InfoField 
                        label="Emergency Contact" 
                        value={`${viewModal.data.emergencyContact.name || ''} (${viewModal.data.emergencyContact.relation || ''}) - ${viewModal.data.emergencyContact.phone || ''}`} 
                        icon={PhoneIcon} 
                      />
                    )}
                    {viewModal.data.qualifications && viewModal.data.qualifications.length > 0 && (
                      <InfoField 
                        label="Qualifications" 
                        value={Array.isArray(viewModal.data.qualifications) ? viewModal.data.qualifications.join(', ') : viewModal.data.qualifications} 
                        icon={DocumentTextIcon} 
                      />
                    )}
                    {viewModal.data.notes && (
                      <InfoField label="Notes" value={viewModal.data.notes} icon={DocumentTextIcon} />
                    )}
                  </>
                )}
                {viewModal.type === 'Vendor' && (
                  <>
                    <InfoField label="Email" value={viewModal.data.email || 'N/A'} icon={EnvelopeIcon} />
                    <InfoField label="Phone" value={viewModal.data.phone} icon={PhoneIcon} />
                    <InfoField label="Specialty" value={viewModal.data.specialty} icon={BriefcaseIcon} />
                    <InfoField label="Rating" value={`${viewModal.data.rating}/5`} icon={StarIcon} />
                    <InfoField label="Last Invoice" value={formatDate(viewModal.data.lastInvoice)} icon={CalendarIcon} />
                  </>
                )}
              </div>
            </div>

            {/* Documents Section - For Employees */}
            {viewModal.type === 'Employee' && viewModal.data.documents && viewModal.data.documents.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  Documents
                  <span className="text-sm font-normal text-gray-500">
                    ({viewModal.data.documents.length} document{viewModal.data.documents.length !== 1 ? 's' : ''})
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {viewModal.data.documents.map((doc: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {doc.mimetype && doc.mimetype.startsWith('image/') ? (
                          <img
                            src={`${API_BASE_URL.replace('/api', '')}${doc.url}`}
                            alt={doc.originalName || 'Document'}
                            className="w-16 h-16 object-cover rounded border border-gray-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
                            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" title={doc.originalName || doc.filename}>
                            {doc.originalName || doc.filename}
                          </p>
                          {doc.size && (
                            <p className="text-xs text-gray-500 mt-1">
                              {(doc.size / 1024).toFixed(2)} KB
                            </p>
                          )}
                          {doc.uploadedAt && (
                            <p className="text-xs text-gray-500">
                              {formatDate(doc.uploadedAt)}
                            </p>
                          )}
                          <a
                            href={`${API_BASE_URL.replace('/api', '')}${doc.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                          >
                            View/Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transactions Section - Only for Tenants and Vendors */}
            {(viewModal.type === 'Tenant' || viewModal.type === 'Vendor') && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5" />
                  Transactions
                  {viewModal.type === 'Tenant' && (
                    <span className="text-sm font-normal text-gray-500">
                      ({getTenantTransactions.length} transactions)
                    </span>
                  )}
                  {viewModal.type === 'Vendor' && (
                    <span className="text-sm font-normal text-gray-500">
                      ({getVendorTransactions.length} transactions)
                    </span>
                  )}
                </h4>
                {viewModal.type === 'Tenant' && getTenantTransactions.length > 0 && (
                  <div className="space-y-3">
                    {getTenantTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {transaction.type}
                              </span>
                              <Badge
                                variant={
                                  transaction.status === 'Paid'
                                    ? 'success'
                                    : transaction.status === 'Pending'
                                    ? 'warning'
                                    : 'default'
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 ml-8">
                              <p>Ref: {transaction.ref}</p>
                              <p>Date: {formatDate(transaction.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${
                                transaction.type === 'Expense' || transaction.type === 'Refund'
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {transaction.type === 'Expense' || transaction.type === 'Refund'
                                ? '-'
                                : '+'}
                              {formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {viewModal.type === 'Tenant' && getTenantTransactions.length === 0 && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-500">No transactions found for this tenant.</p>
                  </div>
                )}
                {viewModal.type === 'Vendor' && getVendorTransactions.length > 0 && (
                  <div className="space-y-3">
                    {getVendorTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {transaction.type}
                              </span>
                              <Badge
                                variant={
                                  transaction.status === 'Paid'
                                    ? 'success'
                                    : transaction.status === 'Pending'
                                    ? 'warning'
                                    : 'default'
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 ml-8">
                              <p>Ref: {transaction.ref}</p>
                              <p>Date: {formatDate(transaction.date)}</p>
                              {transaction.description && (
                                <p className="mt-1">Description: {transaction.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-600">
                              -{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {viewModal.type === 'Vendor' && getVendorTransactions.length === 0 && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-500">No transactions found for this vendor.</p>
                  </div>
                )}
              </div>
            )}

            {/* Summary for Tenants */}
            {viewModal.type === 'Tenant' && getTenantTransactions.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">Total Transactions:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {getTenantTransactions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium text-blue-900">Total Amount:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(
                      getTenantTransactions.reduce(
                        (sum, t) =>
                          sum +
                          (t.type === 'Expense' || t.type === 'Refund'
                            ? -t.amount
                            : t.amount),
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Summary for Vendors */}
            {viewModal.type === 'Vendor' && getVendorTransactions.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-900">Total Transactions:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {getVendorTransactions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium text-purple-900">Total Amount:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatCurrency(
                      getVendorTransactions.reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* View via Forms */}
      {isViewFormOpen && viewFormType === 'Tenant' && (
        <TenantForm
          isOpen={isViewFormOpen}
          onClose={handleViewClose}
          onSubmit={async () => {}} // Read-only view
          editingId={viewingId}
          initialData={viewFormData}
          hostelOptions={hostelOptions}
          hostelsLoading={hostelsLoading}
          isReadOnly={true}
        />
      )}

      {isViewFormOpen && viewFormType === 'Employee' && (
        <EmployeeForm
          isOpen={isViewFormOpen}
          onClose={handleViewClose}
          onSubmit={async () => {}} // Read-only view
          editingId={viewingId}
          initialData={viewFormData}
          hostelOptions={hostelOptions}
          hostelsLoading={hostelsLoading}
          roleOptions={roleOptions}
          rolesLoading={rolesLoading}
          isReadOnly={true}
        />
      )}
    </div>
  );
};

// Helper component for info fields
const InfoField: React.FC<{
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}> = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default CommunicationBoard;

