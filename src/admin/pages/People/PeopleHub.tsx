/**
 * PeopleHub page
 * Sidebar navigation with Tenants, Employees, Vendors, and Prospects sections
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as alertService from '../../services/alert.service';
import { Toast } from '../../components/Toast';
import * as hostelService from '../../services/hostel.service';
import * as tenantService from '../../services/tenant.service';
import * as employeeService from '../../services/employee.service';
import * as roleService from '../../services/role.service';
import * as prospectService from '../../services/prospect.service';
import jsPDF from 'jspdf';
import { addPDFBranding, addPDFHeader } from '../../utils/pdfExport';
import { useAuth } from '../../context/AuthContext';

// Import components
import TenantForm, { type TenantFormData } from './components/TenantForm';
import EmployeeForm, { type EmployeeFormData } from './components/EmployeeForm';
import ProspectForm, { type ProspectFormData } from './components/ProspectForm';
import ViewModal from './components/ViewModal';
import ScoreModal from './components/ScoreModal';
import { PeopleHeader } from './components/PeopleHeader';
import { PeopleContent } from './components/PeopleContent';

// Lazy load VendorList
const VendorListLazy = React.lazy(() => import('../Vendor/VendorList'));

// Wrapper component to pass props to lazy-loaded VendorList
const VendorListWrapper: React.FC<{ selectedHostelId: string; onHostelChange: (id: string) => void }> = ({ selectedHostelId, onHostelChange }) => {
  return <VendorListLazy selectedHostelId={selectedHostelId} onHostelChange={onHostelChange} />;
};

type PeopleSection = 'Tenants' | 'Employees' | 'Vendors' | 'Prospects';

const PeopleHub: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Get active section from URL
  const getActiveSection = (): PeopleSection | null => {
    if (location.pathname.includes('/tenants')) return 'Tenants';
    if (location.pathname.includes('/employees')) return 'Employees';
    if (location.pathname.includes('/vendors')) return 'Vendors';
    if (location.pathname.includes('/prospects')) return 'Prospects';
    return null; // On base route
  };
  
  const activeSection = getActiveSection();
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [hostels, setHostels] = useState<Array<{ id: string | number; name: string; city: string }>>([]);
  const [hostelsLoading, setHostelsLoading] = useState<boolean>(true);
  const [tenants, setTenants] = useState<any[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState<boolean>(false);
  const [prospects, setProspects] = useState<any[]>([]);
  const [prospectsLoading, setProspectsLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Array<{ value: string; label: string; id: number }>>([]);
  const [rolesLoading, setRolesLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<{ mode: 'view' | 'edit'; type: 'Tenant' | 'Employee' | 'Prospect'; data: any } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<'details' | 'scorecard'>('details');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreForm, setScoreForm] = useState({
    behavior: 5,
    punctuality: 5,
    cleanliness: 5,
    referrals: 0,
    timePeriod: '',
    remarks: '',
  });
  const [currentScoreEntity, setCurrentScoreEntity] = useState<{ type: 'Tenant' | 'Employee'; id: number; name: string } | null>(null);
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });
  // Form state for Tenant, Employee, and Prospect (for editing/pre-filling)
  const [editingTenantId, setEditingTenantId] = useState<number | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [editingProspectId, setEditingProspectId] = useState<number | null>(null);
  const [tenantFormData, setTenantFormData] = useState<Partial<TenantFormData>>({});
  const [employeeFormData, setEmployeeFormData] = useState<Partial<EmployeeFormData>>({});
  const [prospectFormData, setProspectFormData] = useState<Partial<ProspectFormData>>({});


  // Fetch hostels from API on component mount
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setHostelsLoading(true);
        const hostelsData = await hostelService.getAllHostelsFromAPI();
        // Map hostels to expected format - handle both string and number IDs
        const mappedHostels = hostelsData.map(h => ({
          id: typeof h.id === 'string' ? Number(h.id) : h.id,
          name: h.name,
          city: h.city,
        }));
        setHostels(mappedHostels);
      } catch (err: any) {
        console.error('Error fetching hostels:', err);
        // Set empty array on error to prevent crashes
        setHostels([]);
      } finally {
        setHostelsLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Fetch roles from API on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const rolesData = await roleService.getAllRoles();
        // Map roles to Select options format using role ID as value and roleName as label
        const roleOptions = rolesData.map(role => ({
          value: String(role.id), // Use role ID as value
          label: role.roleName, // Use roleName as display label
          id: role.id, // Store ID for reference
        }));
        setRoles(roleOptions);
      } catch (err: any) {
        console.error('Error fetching roles:', err);
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const hostelOptions = useMemo(
    () => {
      if (hostelsLoading) {
        return [
          { value: '', label: 'Loading hostels...' },
        ];
      }
      return [
        { value: '', label: 'All Hostels' },
        ...hostels.map((h) => ({ value: String(h.id), label: `${h.name} - ${h.city}` })),
      ];
    },
    [hostels, hostelsLoading]
  );

  // Fetch tenants when hostel is selected (only for Tenants section)
  useEffect(() => {
    const fetchTenants = async () => {
      if (activeSection === 'Tenants' && selectedHostelId) {
        try {
          setTenantsLoading(true);
          const tenantsData = await tenantService.getTenantsByHostel(Number(selectedHostelId));
          setTenants(tenantsData);
        } catch (error) {
          console.error('Error fetching tenants:', error);
          setTenants([]);
        } finally {
          setTenantsLoading(false);
        }
      } else if (activeSection === 'Tenants' && !selectedHostelId) {
        // Clear tenants when no hostel is selected
        setTenants([]);
      }
    };

    fetchTenants();
  }, [selectedHostelId, activeSection]);

  // Fetch employees when hostel is selected (only for Employees section)
  useEffect(() => {
    const fetchEmployees = async () => {
      if (activeSection === 'Employees' && selectedHostelId) {
        try {
          setEmployeesLoading(true);
          const employeesData = await employeeService.getEmployeesByHostel(Number(selectedHostelId));
          setEmployees(employeesData);
        } catch (error) {
          console.error('Error fetching employees:', error);
          setEmployees([]);
        } finally {
          setEmployeesLoading(false);
        }
      } else if (activeSection === 'Employees' && !selectedHostelId) {
        // Clear employees when no hostel is selected
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, [selectedHostelId, activeSection]);

  // Fetch prospects when Prospects section is active (no hostel filter needed)
  useEffect(() => {
    const fetchProspects = async () => {
      if (activeSection === 'Prospects') {
        try {
          setProspectsLoading(true);
          const prospectsData = await prospectService.getAllProspects();
          setProspects(prospectsData);
        } catch (error) {
          console.error('Error fetching prospects:', error);
          setProspects([]);
        } finally {
          setProspectsLoading(false);
        }
      } else {
        // Clear prospects when not on Prospects section
        setProspects([]);
      }
    };

    fetchProspects();
  }, [activeSection]);

  // Use fetched tenants for Tenants section, otherwise use mock data filtering
  const filteredTenants = useMemo(() => {
    if (activeSection !== 'Tenants') {
      return [];
    }
    return tenants;
  }, [tenants, activeSection]);

  const filteredEmployees = useMemo(() => {
    if (activeSection !== 'Employees') {
      return [];
    }
    return employees;
  }, [employees, activeSection]);

  const filteredProspects = useMemo(() => {
    if (activeSection !== 'Prospects') {
      return [];
    }
    return prospects;
  }, [prospects, activeSection]);



  // Floors, rooms, and beds are now managed inside TenantForm component

  // Score management functions
  const getScoreKey = (type: 'Tenant' | 'Employee', id: number) => `score_${type.toLowerCase()}_${id}`;
  
  const getScore = (type: 'Tenant' | 'Employee', id: number) => {
    const key = getScoreKey(type, id);
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

  const getScoreHistory = (type: 'Tenant' | 'Employee', id: number) => {
    const key = `score_history_${type.toLowerCase()}_${id}`;
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

  const saveScore = async (type: 'Tenant' | 'Employee', id: number, scoreData: any) => {
    const key = getScoreKey(type, id);
    const historyKey = `score_history_${type.toLowerCase()}_${id}`;

    // Calculate average
    const average = (scoreData.behavior + scoreData.punctuality + scoreData.cleanliness) / 3;
    const scoreRecord = {
      ...scoreData,
      average,
      date: new Date().toISOString(),
    };

    // Save current score locally
    localStorage.setItem(key, JSON.stringify(scoreRecord));

    // Add to history
    const history = getScoreHistory(type, id);
    history.unshift(scoreRecord);
    // Keep only last 10 records
    if (history.length > 10) history.pop();
    localStorage.setItem(historyKey, JSON.stringify(history));

    // Persist tenant score to backend when possible
    if (type === 'Tenant') {
      try {
        await tenantService.upsertTenantScore(id, {
          behavior: scoreData.behavior,
          punctuality: scoreData.punctuality,
          cleanliness: scoreData.cleanliness,
          remarks: scoreData.remarks,
          referrals: scoreData.referrals,
          timePeriod: scoreData.timePeriod,
        });
      } catch (backendError) {
        console.error('Failed to persist tenant score to backend:', backendError);
      }
    }

    return scoreRecord;
  };


  // Action handlers - wrapped in useCallback for performance
  const handleView = useCallback(async (id: number, type: 'Tenant' | 'Employee' | 'Prospect') => {
    if (type === 'Tenant') {
      // Fetch full tenant details from API
      try {
        setTenantsLoading(true);
        const tenantData = await tenantService.getTenantById(id);
        if (tenantData) {
          // Map API response to display format
          const mappedData = {
            id: tenantData.id,
            name: tenantData.fullName || tenantData.name,
            fatherName: tenantData.fatherName || tenantData.father_name || tenantData.father || tenantData.lastName || '',
            firstName: tenantData.firstName,
            lastName: tenantData.lastName,
            email: tenantData.email,
            phone: tenantData.phone,
            alternatePhone: tenantData.alternatePhone,
            gender: tenantData.gender,
            dateOfBirth: tenantData.dateOfBirth,
            status: tenantData.status,
            profilePhoto: tenantData.profilePhoto,
            cnicNumber: tenantData.cnicNumber,
            vehicleParkingStatus: tenantData.vehicleParkingStatus,
            vehicleType: tenantData.vehicleType,
            vehicleNumberPlate: tenantData.vehicleNumberPlate,
            vehicleRegistrationNumber: tenantData.vehicleRegistrationNumber,
            vehicleColor: tenantData.vehicleColor,
            monthlyRent: tenantData.monthlyRent,
            securityDeposit: tenantData.securityDeposit,
            leaseStartDate: tenantData.leaseStartDate,
            leaseEndDate: tenantData.leaseEndDate,
            notes: tenantData.notes,
            rating: tenantData.rating,
            documents: tenantData.documents,
            room: tenantData.activeAllocation?.room?.roomNumber || tenantData.activeAllocation?.room?.number || 'N/A',
            bed: tenantData.activeAllocation?.bed?.bedNumber || tenantData.activeAllocation?.bed?.number || 'N/A',
            floor: tenantData.activeAllocation?.floor?.floorName || tenantData.activeAllocation?.floor?.name || 'N/A',
            hostel: tenantData.activeAllocation?.hostel?.name || 'N/A',
            checkInDate: tenantData.activeAllocation?.checkInDate,
            expectedCheckOutDate: tenantData.activeAllocation?.expectedCheckOutDate,
            allocations: tenantData.allocations,
            recentPayments: tenantData.recentPayments || [],
            recentAlerts: tenantData.recentAlerts || [],
          };
          setModal({ mode: 'view', type, data: mappedData });
          setDetailTab('details');
        }
      } catch (error) {
        console.error('Error fetching tenant details:', error);
        setToast({
          open: true,
          type: 'error',
          message: 'Failed to load tenant details. Please try again.',
        });
      } finally {
        setTenantsLoading(false);
      }
    } else if (type === 'Employee') {
      // Fetch full employee details from API
      try {
        setEmployeesLoading(true);
        const employeeData = await employeeService.getEmployeeById(id);
        if (employeeData) {
          // Map API response to display format
          const mappedData = {
            id: employeeData.id,
            name: employeeData.user?.username || 'Unknown',
            email: employeeData.user?.email || '',
            phone: employeeData.user?.phone || null,
            username: employeeData.user?.username || '',
            status: employeeData.status,
            profilePhoto: employeeData.profilePhoto,
            employeeCode: employeeData.employeeCode,
            role: employeeData.role,
            department: employeeData.department,
            designation: employeeData.designation,
            salary: employeeData.salary,
            salaryType: employeeData.salaryType,
            joinDate: employeeData.joinDate,
            terminationDate: employeeData.terminationDate,
            workingHours: employeeData.workingHours,
            hostelId: employeeData.hostelId,
            hostel: employeeData.hostel?.name || 'N/A',
            address: employeeData.address,
            documents: employeeData.documents,
            notes: employeeData.notes,
            emergencyContact: employeeData.emergencyContact,
            qualifications: employeeData.qualifications,
            bankDetails: employeeData.bankDetails,
            createdAt: employeeData.createdAt,
            updatedAt: employeeData.updatedAt,
            user: employeeData.user,
          };
          setModal({ mode: 'view', type, data: mappedData });
          setDetailTab('details');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setToast({
          open: true,
          type: 'error',
          message: 'Failed to load employee details. Please try again.',
        });
      } finally {
        setEmployeesLoading(false);
      }
    } else if (type === 'Prospect') {
      // Fetch full prospect details from API
      try {
        setProspectsLoading(true);
        const prospectData = await prospectService.getProspectById(id);
        if (prospectData && prospectData.prospect) {
          // Map API response to display format
          const mappedData = {
            id: prospectData.prospect.id,
            firstName: prospectData.prospect.firstName || '',
            lastName: prospectData.prospect.lastName || '',
            name: prospectData.prospect.name || `${prospectData.prospect.firstName} ${prospectData.prospect.lastName}`,
            email: prospectData.prospect.email || '',
            phone: prospectData.prospect.phone || '',
            gender: prospectData.prospect.gender || '',
            dateOfBirth: prospectData.prospect.dateOfBirth || '',
            cnicNumber: prospectData.prospect.cnicNumber || '',
            status: prospectData.prospect.status || 'pending',
            profilePhoto: prospectData.prospect.profilePhoto,
            documents: prospectData.prospect.documents || [],
            profession: prospectData.prospect.profession || '',
            professionDetails: prospectData.prospect.professionDetails || '',
            professionDocuments: prospectData.prospect.professionDocuments || [],
            createdAt: prospectData.prospect.createdAt,
            updatedAt: prospectData.prospect.updatedAt,
          };
          setModal({ mode: 'view', type, data: mappedData });
          setDetailTab('details');
        }
      } catch (error) {
        console.error('Error fetching prospect details:', error);
        setToast({
          open: true,
          type: 'error',
          message: 'Failed to load prospect details. Please try again.',
        });
      } finally {
        setProspectsLoading(false);
      }
    }
  }, []);

  const handleEdit = useCallback(async (id: number, type: 'Tenant' | 'Employee' | 'Prospect') => {
    if (type === 'Tenant') {
      // Fetch tenant data from API and populate form
      try {
        setTenantsLoading(true);
        const tenantData = await tenantService.getTenantById(id);
        if (tenantData) {
          // Set editing tenant ID
          setEditingTenantId(id);
          
          // Populate form with tenant data
          const emergencyContact = typeof tenantData.emergencyContact === 'string' 
            ? JSON.parse(tenantData.emergencyContact) 
            : tenantData.emergencyContact || {};
          const nearestRelative = typeof tenantData.nearestRelative === 'string'
            ? JSON.parse(tenantData.nearestRelative)
            : tenantData.nearestRelative || {};
          const address = typeof tenantData.address === 'string'
            ? JSON.parse(tenantData.address)
            : tenantData.address || {};
            
          setTenantFormData({
            fullName: tenantData.fullName || tenantData.firstName || tenantData.name || '',
            fatherName: tenantData.fatherName || tenantData.lastName || '',
            firstName: tenantData.firstName || tenantData.fullName || tenantData.name || '', // Keep for backward compatibility
            lastName: tenantData.lastName || tenantData.fatherName || '', // Keep for backward compatibility
            email: tenantData.email || '',
            phone: tenantData.phone || '',
            whatsappNumber: tenantData.whatsappNumber || '',
            gender: tenantData.gender || '',
            genderOther: tenantData.genderOther || '',
            dateOfBirth: tenantData.dateOfBirth ? new Date(tenantData.dateOfBirth).toISOString().split('T')[0] : '',
            cnicNumber: tenantData.cnicNumber || '',
            profilePhoto: null, // Keep as null, user can upload new one if needed
            previousProfilePhoto: tenantData.profilePhoto || null,
            attachments: null,
            previousAttachments: tenantData.attachments || null,
            address: {
              street: address.street || address.line1 || '',
              city: address.city || '',
              country: address.country || '',
            },
            professionType: tenantData.professionType || '',
            academicName: tenantData.academicName || '',
            academicAddress: tenantData.academicAddress || '',
            academicLocation: tenantData.academicLocation || '',
            studentCardNo: tenantData.studentCardNo || '',
            academicAttachments: null,
            jobTitle: tenantData.jobTitle || '',
            companyName: tenantData.companyName || '',
            jobAddress: tenantData.jobAddress || '',
            jobLocation: tenantData.jobLocation || '',
            jobIdNo: tenantData.jobIdNo || '',
            jobAttachments: null,
            businessName: tenantData.businessName || '',
            businessAddress: tenantData.businessAddress || '',
            businessLocation: tenantData.businessLocation || '',
            businessAttachments: null,
            professionDescription: tenantData.professionDescription || '',
            reference: tenantData.reference || '',
            emergencyContactName: emergencyContact.name || '',
            emergencyContactNumber: emergencyContact.phone || '',
            emergencyContactWhatsapp: tenantData.emergencyContactWhatsapp || emergencyContact.whatsappNumber || '',
            emergencyContactRelation: emergencyContact.relationship || '',
            emergencyContactRelationOther: tenantData.emergencyContactRelationOther || emergencyContact.relationOther || '',
            anyDisease: tenantData.anyDisease || '',
            bloodGroup: tenantData.bloodGroup || '',
            nearestRelativeContact: nearestRelative.contactNumber || '',
            nearestRelativeWhatsapp: nearestRelative.whatsappNumber || '',
            nearestRelativeRelation: nearestRelative.relation || '',
            nearestRelativeRelationOther: nearestRelative.relationOther || '',
            vehicleParkingStatus: tenantData.vehicleParkingStatus || '',
            vehicleType: tenantData.vehicleType || '',
            vehicleNumberPlate: tenantData.vehicleNumberPlate || '',
            vehicleRegistrationNumber: tenantData.vehicleRegistrationNumber || '',
            vehicleColor: tenantData.vehicleColor || '',
            hostelId: tenantData.activeAllocation?.hostel?.id?.toString() || '',
            floorId: tenantData.activeAllocation?.floor?.id?.toString() || '',
            roomId: tenantData.activeAllocation?.room?.id?.toString() || '',
            bedId: tenantData.activeAllocation?.bed?.id?.toString() || '',
            leaseStartDate: tenantData.leaseStartDate ? new Date(tenantData.leaseStartDate).toISOString().split('T')[0] : '',
            leaseEndDate: tenantData.leaseEndDate ? new Date(tenantData.leaseEndDate).toISOString().split('T')[0] : '',
            monthlyRent: tenantData.monthlyRent?.toString() || '',
            securityDeposit: tenantData.securityDeposit?.toString() || '',
            lateFeesFine: tenantData.lateFeesFine || '',
            lateFeesPercentage: tenantData.lateFeesPercentage?.toString() || '',
            lateFeesChargeDate: tenantData.lateFeesChargeDate ? new Date(tenantData.lateFeesChargeDate).toISOString().split('T')[0] : '',
            otherDocuments: tenantData.otherDocuments?.map((doc: any) => ({ documentName: doc.name || '', documentFile: null })) || [],
            rentalDocument: null,
            previousRentalDocument: tenantData.rentalDocument || null,
            securityDepositFile: null,
            previousSecurityDepositFile: tenantData.securityDepositFile || null,
            advancedRentReceivedFile: null,
            previousAdvancedRentReceivedFile: tenantData.advancedRentReceivedFile || null,
            documents: null, // Keep as null, user can upload new one if needed
          });
          
          // Floors, rooms, and beds will be loaded automatically by TenantForm component
          // when it opens with the hostelId from initialData
          
          // Open the add modal in edit mode - form will load data from initialData prop
          setIsAddModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching tenant for edit:', error);
        setToast({
          open: true,
          type: 'error',
          message: 'Failed to load tenant data for editing. Please try again.',
        });
      } finally {
        setTenantsLoading(false);
      }
    } else if (type === 'Employee') {
      // Set editing employee ID and open modal first - form will reset itself
      setEditingEmployeeId(id);
      setIsAddModalOpen(true);
      
      // Then fetch employee data from API and populate form
      try {
        setEmployeesLoading(true);
        console.log('Fetching employee data for edit, ID:', id);
        const employeeData = await employeeService.getEmployeeForEdit(id);
        console.log('Employee data received:', employeeData);
        
        // The service should return { user: {...}, employee: {...} }
        if (employeeData && employeeData.employee && employeeData.user) {
          // Find the role ID from the roles list based on role name
          // The employee.role might be a role name string, we need to find matching role ID
          const roleName = employeeData.employee.role;
          console.log('Looking for role:', roleName, 'in roles:', roles);
          const roleOption = roles.find(r => r.label.toLowerCase() === roleName?.toLowerCase());
          const roleId = roleOption ? roleOption.value : '';
          console.log('Found role ID:', roleId);
          
          // Parse emergency contact and nearest relative
          const emergencyContact = typeof employeeData.employee.emergencyContact === 'string'
            ? JSON.parse(employeeData.employee.emergencyContact)
            : employeeData.employee.emergencyContact || {};
          const nearestRelative = typeof employeeData.employee.nearestRelative === 'string'
            ? JSON.parse(employeeData.employee.nearestRelative)
            : employeeData.employee.nearestRelative || {};
          
          // Populate form with employee data
          setEmployeeFormData({
            name: employeeData.user.username || '',
            fatherName: employeeData.employee.fatherName || '',
            email: employeeData.user.email || '',
            phone: employeeData.user.phone || '',
            whatsappNumber: employeeData.employee.whatsappNumber || '',
            username: employeeData.user.username || '',
            password: '', // Don't pre-fill password
            profilePhoto: null, // Keep as null, user can upload new one if needed
            previousProfilePhoto: employeeData.employee.profilePhoto || null,
            address: {
              street: employeeData.employee.address?.street || '',
              city: employeeData.employee.address?.city || '',
              country: employeeData.employee.address?.country || '',
            },
            roleId: roleId,
            hostelId: employeeData.employee.hostelId?.toString() || '',
            joinDate: employeeData.employee.joinDate ? new Date(employeeData.employee.joinDate).toISOString().split('T')[0] : '',
            salary: employeeData.employee.salary?.toString() || '',
            salaryType: employeeData.employee.salaryType || 'monthly',
            workingHours: employeeData.employee.workingHours || '',
            terminationDate: employeeData.employee.terminationDate || '',
            reference: employeeData.employee.reference || '',
            cnicDocuments: null,
            previousCnicDocuments: employeeData.employee.cnicDocuments || null,
            agreementDocument: null,
            previousAgreementDocument: employeeData.employee.agreementDocument || null,
            policeCharacterCertificate: null,
            previousPoliceCharacterCertificate: employeeData.employee.policeCharacterCertificate || null,
            anyOtherDocuments: null,
            previousAnyOtherDocuments: employeeData.employee.anyOtherDocuments || null,
            notes: employeeData.employee.notes || '',
            professionType: employeeData.employee.professionType || '',
            academicName: employeeData.employee.academicName || '',
            academicAddress: employeeData.employee.academicAddress || '',
            academicLocation: employeeData.employee.academicLocation || '',
            studentCardNo: employeeData.employee.studentCardNo || '',
            academicAttachments: null,
            jobTitle: employeeData.employee.jobTitle || '',
            companyName: employeeData.employee.companyName || '',
            jobAddress: employeeData.employee.jobAddress || '',
            jobLocation: employeeData.employee.jobLocation || '',
            jobIdNo: employeeData.employee.jobIdNo || '',
            jobAttachments: null,
            businessName: employeeData.employee.businessName || '',
            businessAddress: employeeData.employee.businessAddress || '',
            businessLocation: employeeData.employee.businessLocation || '',
            businessAttachments: null,
            professionDescription: employeeData.employee.professionDescription || '',
            emergencyContactName: emergencyContact.name || '',
            emergencyContactNumber: emergencyContact.phone || '',
            emergencyContactWhatsapp: employeeData.employee.emergencyContactWhatsapp || emergencyContact.whatsappNumber || '',
            emergencyContactRelation: emergencyContact.relationship || '',
            emergencyContactRelationOther: employeeData.employee.emergencyContactRelationOther || emergencyContact.relationOther || '',
            anyDisease: employeeData.employee.anyDisease || '',
            bloodGroup: employeeData.employee.bloodGroup || '',
            nearestRelativeContact: nearestRelative.contactNumber || '',
            nearestRelativeWhatsapp: nearestRelative.whatsappNumber || '',
            nearestRelativeRelation: nearestRelative.relation || '',
            nearestRelativeRelationOther: nearestRelative.relationOther || '',
          });
          
          console.log('Form data populated successfully');
        } else {
          console.error('Invalid employee data structure:', employeeData);
          console.error('Full response object:', JSON.stringify(employeeData, null, 2));
          
          setToast({
            open: true,
            type: 'error',
            message: 'Failed to load employee data. The response structure is invalid. Please check the console for details.',
          });
        }
      } catch (error: any) {
        console.error('Error fetching employee for edit:', error);
        console.error('Error details:', error?.response?.data || error?.message);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load employee data for editing. Please try again.';
        setToast({
          open: true,
          type: 'error',
          message: errorMessage,
        });
      } finally {
        setEmployeesLoading(false);
      }
    } else if (type === 'Prospect') {
      // Fetch prospect data from API and populate form
      try {
        setProspectsLoading(true);
        const prospectData = await prospectService.getProspectForEdit(id);
        if (prospectData && prospectData.prospect) {
          // Set editing prospect ID
          setEditingProspectId(id);
          
          // Parse profession detail JSON if it exists
          const professionDetail = prospectData.prospect.professionDetail 
            ? (typeof prospectData.prospect.professionDetail === 'string' 
                ? JSON.parse(prospectData.prospect.professionDetail) 
                : prospectData.prospect.professionDetail)
            : {};
          
          // Parse emergency contact JSON if it exists
          const emergencyContact = prospectData.prospect.emergencyContact
            ? (typeof prospectData.prospect.emergencyContact === 'string'
                ? JSON.parse(prospectData.prospect.emergencyContact)
                : prospectData.prospect.emergencyContact)
            : {};
          
          // Parse nearest relative JSON if it exists
          const nearestRelative = prospectData.prospect.nearestRelative
            ? (typeof prospectData.prospect.nearestRelative === 'string'
                ? JSON.parse(prospectData.prospect.nearestRelative)
                : prospectData.prospect.nearestRelative)
            : {};
          
          // Populate form with prospect data
          setProspectFormData({
            fullName: prospectData.prospect.fullName || prospectData.prospect.name || '',
            fatherName: prospectData.prospect.fatherName || '',
            firstName: prospectData.prospect.firstName || prospectData.prospect.fullName || '',
            lastName: prospectData.prospect.lastName || '',
            email: prospectData.prospect.email || '',
            phone: prospectData.prospect.phone || '',
            whatsappNumber: prospectData.prospect.whatsappNumber || '',
            gender: prospectData.prospect.gender || '',
            genderOther: prospectData.prospect.genderOther || '',
            dateOfBirth: prospectData.prospect.dateOfBirth ? new Date(prospectData.prospect.dateOfBirth).toISOString().split('T')[0] : '',
            cnicNumber: prospectData.prospect.cnicNumber || '',
            profilePhoto: null,
            attachments: null,
            previousProfilePhoto: prospectData.prospect.profilePhoto || null,
            previousAttachments: prospectData.prospect.attachments || null,
            professionType: prospectData.prospect.professionType || '',
            academicName: professionDetail.academicName || '',
            academicAddress: professionDetail.academicAddress || '',
            academicLocation: professionDetail.academicLocation || '',
            studentCardNo: professionDetail.studentCardNo || '',
            academicAttachments: null,
            jobTitle: professionDetail.jobTitle || '',
            companyName: professionDetail.companyName || '',
            jobAddress: professionDetail.jobAddress || '',
            jobLocation: professionDetail.jobLocation || '',
            jobIdNo: professionDetail.jobIdNo || '',
            jobAttachments: null,
            businessName: professionDetail.businessName || '',
            businessAddress: professionDetail.businessAddress || '',
            businessLocation: professionDetail.businessLocation || '',
            businessAttachments: null,
            professionDescription: prospectData.prospect.professionDescription || '',
            status: prospectData.prospect.status || 'Active',
            emergencyContactName: emergencyContact.name || '',
            emergencyContactNumber: emergencyContact.phone || '',
            emergencyContactWhatsapp: prospectData.prospect.emergencyContactWhatsapp || emergencyContact.whatsappNumber || '',
            emergencyContactRelation: emergencyContact.relationship || '',
            emergencyContactRelationOther: prospectData.prospect.emergencyContactRelationOther || emergencyContact.relationOther || '',
            anyDisease: prospectData.prospect.anyDisease || '',
            bloodGroup: prospectData.prospect.bloodGroup || '',
            nearestRelativeContact: nearestRelative.contactNumber || '',
            nearestRelativeWhatsapp: nearestRelative.whatsappNumber || '',
            nearestRelativeRelation: nearestRelative.relation || '',
            nearestRelativeRelationOther: nearestRelative.relationOther || '',
          });
          
          // Open the add modal in edit mode - form will load data from initialData prop
          setIsAddModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching prospect for edit:', error);
        setToast({
          open: true,
          type: 'error',
          message: 'Failed to load prospect data for editing. Please try again.',
        });
      } finally {
        setProspectsLoading(false);
      }
    }
  }, [roles]);

  const handleDelete = useCallback(async (id: number, type: 'Tenant' | 'Employee' | 'Prospect', name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    if (type === 'Tenant') {
      try {
        setTenantsLoading(true);
        await tenantService.deleteTenant(id);
        
        setToast({
          open: true,
          type: 'success',
          message: `Tenant "${name}" deleted successfully!`,
        });

        // Refresh tenant list if a hostel is selected
        if (selectedHostelId && activeSection === 'Tenants') {
          try {
            const tenantsData = await tenantService.getTenantsByHostel(Number(selectedHostelId));
            setTenants(tenantsData);
          } catch (error) {
            console.error('Error refreshing tenant list:', error);
          }
        }
      } catch (error: any) {
        console.error('Error deleting tenant:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete tenant. Please try again.';
        setToast({
          open: true,
          type: 'error',
          message: errorMessage,
        });
      } finally {
        setTenantsLoading(false);
      }
    } else if (type === 'Employee') {
      try {
        setEmployeesLoading(true);
        await employeeService.deleteEmployee(id);
        
        setToast({
          open: true,
          type: 'success',
          message: `Employee "${name}" deleted successfully!`,
        });

        // Refresh employee list if a hostel is selected
        if (selectedHostelId && activeSection === 'Employees') {
          try {
            const employeesData = await employeeService.getEmployeesByHostel(Number(selectedHostelId));
            setEmployees(employeesData);
          } catch (error) {
            console.error('Error refreshing employee list:', error);
          }
        }
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete employee. Please try again.';
        setToast({
          open: true,
          type: 'error',
          message: errorMessage,
        });
      } finally {
        setEmployeesLoading(false);
      }
    } else if (type === 'Prospect') {
      try {
        setProspectsLoading(true);
        await prospectService.deleteProspect(id);
        
        setToast({
          open: true,
          type: 'success',
          message: `Prospect "${name}" deleted successfully!`,
        });

        // Refresh prospects list
        if (activeSection === 'Prospects') {
          try {
            const prospectsData = await prospectService.getAllProspects();
            setProspects(prospectsData);
          } catch (error) {
            console.error('Error refreshing prospects list:', error);
          }
        }
      } catch (error: any) {
        console.error('Error deleting prospect:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete prospect. Please try again.';
        setToast({
          open: true,
          type: 'error',
          message: errorMessage,
        });
      } finally {
        setProspectsLoading(false);
      }
    }
  }, [selectedHostelId, activeSection]);

  const handleTransfer = useCallback(async (id: number, type: 'Tenant' | 'Employee' | 'Prospect', currentStatus: string) => {
    const normalizedStatus = String(currentStatus || '').toLowerCase();
    const newStatus = normalizedStatus === 'active' ? 'inactive' : 'active';

    const confirmMessage = type === 'Employee'
      ? normalizedStatus === 'active'
        ? 'Mark this employee as left/inactive?'
        : 'Restore this employee to active status?'
      : type === 'Prospect'
        ? normalizedStatus === 'active'
          ? 'Mark this prospect as inactive?'
          : 'Restore this prospect to active status?'
      : normalizedStatus === 'active'
        ? 'Mark this tenant as left/inactive?'
        : 'Restore this tenant to active status?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      if (type === 'Tenant') {
        setTenantsLoading(true);
        const formData = new FormData();
        formData.append('status', newStatus);
        await tenantService.updateTenant(id, formData);

        setToast({
          open: true,
          type: 'success',
          message: `Tenant status updated to ${newStatus === 'active' ? 'Active' : 'Inactive'} successfully!`,
        });

        if (selectedHostelId && activeSection === 'Tenants') {
          try {
            const tenantsData = await tenantService.getTenantsByHostel(Number(selectedHostelId));
            setTenants(tenantsData);
          } catch (refreshError) {
            console.error('Error refreshing tenant list after status update:', refreshError);
          }
        }
      } else if (type === 'Employee') {
        setEmployeesLoading(true);
        const formData = new FormData();
        formData.append('status', newStatus);
        await employeeService.updateEmployee(id, formData);

        setToast({
          open: true,
          type: 'success',
          message: `Employee status updated to ${newStatus === 'active' ? 'Active' : 'Inactive'} successfully!`,
        });

        if (selectedHostelId && activeSection === 'Employees') {
          try {
            const employeesData = await employeeService.getEmployeesByHostel(Number(selectedHostelId));
            setEmployees(employeesData);
          } catch (refreshError) {
            console.error('Error refreshing employee list after status update:', refreshError);
          }
        }
      } else if (type === 'Prospect') {
        setProspectsLoading(true);
        const formData = new FormData();
        formData.append('status', newStatus);
        await prospectService.updateProspect(id, formData);

        setToast({
          open: true,
          type: 'success',
          message: `Prospect status updated to ${newStatus === 'active' ? 'Active' : 'Inactive'} successfully!`,
        });

        if (activeSection === 'Prospects') {
          try {
            const prospectsData = await prospectService.getAllProspects();
            setProspects(prospectsData);
          } catch (refreshError) {
            console.error('Error refreshing prospect list after status update:', refreshError);
          }
        }
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update status. Please try again.';
      setToast({
        open: true,
        type: 'error',
        message: errorMessage,
      });
    } finally {
      if (type === 'Tenant') {
        setTenantsLoading(false);
      } else if (type === 'Prospect') {
        setProspectsLoading(false);
      } else if (type === 'Employee') {
        setEmployeesLoading(false);
      }
    }
  }, [selectedHostelId, activeSection]);

  const handleAddClick = useCallback(() => {
    // Reset editing IDs - forms will reset themselves when opened
    setEditingTenantId(null);
    setEditingEmployeeId(null);
    setEditingProspectId(null);
    setTenantFormData({});
    setEmployeeFormData({});
    setProspectFormData({});
    setIsAddModalOpen(true);
  }, []);

  // Wrapper function for TenantForm onSubmit - receives formData from TenantForm component
  const handleTenantSubmit = async (formDataFromComponent: TenantFormData): Promise<void> => {
    const tenantName = formDataFromComponent.fullName || `${formDataFromComponent.firstName || ''} ${formDataFromComponent.lastName || ''}`.trim();
    const isEditing = editingTenantId !== null;
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Personal Information
    formData.append('fullName', formDataFromComponent.fullName);
    formData.append('fatherName', formDataFromComponent.fatherName);
    formData.append('firstName', formDataFromComponent.fullName); // Keep for backward compatibility
    formData.append('lastName', formDataFromComponent.fatherName); // Keep for backward compatibility
    formData.append('email', formDataFromComponent.email);
    formData.append('phone', formDataFromComponent.phone);
    if (formDataFromComponent.whatsappNumber) {
      formData.append('whatsappNumber', formDataFromComponent.whatsappNumber);
    }
    formData.append('reference', formDataFromComponent.reference);
    formData.append('gender', formDataFromComponent.gender);
    if (formDataFromComponent.gender === 'other' && formDataFromComponent.genderOther) {
      formData.append('genderOther', formDataFromComponent.genderOther);
    }
    if (formDataFromComponent.dateOfBirth) {
      formData.append('dateOfBirth', formDataFromComponent.dateOfBirth);
    }
    if (formDataFromComponent.cnicNumber) {
      formData.append('cnicNumber', formDataFromComponent.cnicNumber);
    }
    if (formDataFromComponent.profilePhoto) {
      formData.append('profilePhoto', formDataFromComponent.profilePhoto);
    }
    // Handle multiple attachments
    if (formDataFromComponent.attachments) {
      Array.from(formDataFromComponent.attachments).forEach((file) => {
        formData.append('attachments', file);
      });
    }
    formData.append('address', JSON.stringify(formDataFromComponent.address || { street: '', city: '', country: '' }));
    
    // Professional fields
    if (formDataFromComponent.professionType) {
      formData.append('professionType', formDataFromComponent.professionType);
    }
    
    // Student fields
    if (formDataFromComponent.professionType === 'student') {
      if (formDataFromComponent.academicName) {
        formData.append('academicName', formDataFromComponent.academicName);
      }
      if (formDataFromComponent.academicAddress) {
        formData.append('academicAddress', formDataFromComponent.academicAddress);
      }
      if (formDataFromComponent.academicLocation) {
        formData.append('academicLocation', formDataFromComponent.academicLocation);
      }
      if (formDataFromComponent.studentCardNo) {
        formData.append('studentCardNo', formDataFromComponent.studentCardNo);
      }
      if (formDataFromComponent.academicAttachments) {
        Array.from(formDataFromComponent.academicAttachments).forEach((file) => {
          formData.append('academicAttachments', file);
        });
      }
    }
    
    // Job fields
    if (formDataFromComponent.professionType === 'job') {
      if (formDataFromComponent.jobTitle) {
        formData.append('jobTitle', formDataFromComponent.jobTitle);
      }
      if (formDataFromComponent.companyName) {
        formData.append('companyName', formDataFromComponent.companyName);
      }
      if (formDataFromComponent.jobAddress) {
        formData.append('jobAddress', formDataFromComponent.jobAddress);
      }
      if (formDataFromComponent.jobLocation) {
        formData.append('jobLocation', formDataFromComponent.jobLocation);
      }
      if (formDataFromComponent.jobIdNo) {
        formData.append('jobIdNo', formDataFromComponent.jobIdNo);
      }
      if (formDataFromComponent.jobAttachments) {
        Array.from(formDataFromComponent.jobAttachments).forEach((file) => {
          formData.append('jobAttachments', file);
        });
      }
    }
    
    // Business fields
    if (formDataFromComponent.professionType === 'business') {
      if (formDataFromComponent.businessName) {
        formData.append('businessName', formDataFromComponent.businessName);
      }
      if (formDataFromComponent.businessAddress) {
        formData.append('businessAddress', formDataFromComponent.businessAddress);
      }
      if (formDataFromComponent.businessLocation) {
        formData.append('businessLocation', formDataFromComponent.businessLocation);
      }
      if (formDataFromComponent.businessAttachments) {
        Array.from(formDataFromComponent.businessAttachments).forEach((file) => {
          formData.append('businessAttachments', file);
        });
      }
    }
    
    if (formDataFromComponent.professionDescription) {
      formData.append('professionDescription', formDataFromComponent.professionDescription);
    }
    
    // Emergency contact fields
    if (formDataFromComponent.emergencyContactName) {
      formData.append('emergencyContactName', formDataFromComponent.emergencyContactName);
    }
    if (formDataFromComponent.emergencyContactNumberLocal) {
      const phone = `${formDataFromComponent.emergencyContactNumberCountry || '+92'} ${formDataFromComponent.emergencyContactNumberLocal}`.trim();
      formData.append('emergencyContactNumber', phone);
    } else if (formDataFromComponent.emergencyContactNumber) {
      formData.append('emergencyContactNumber', formDataFromComponent.emergencyContactNumber);
    }
    if (formDataFromComponent.emergencyContactWhatsappLocal) {
      const phone = `${formDataFromComponent.emergencyContactWhatsappCountry || '+92'} ${formDataFromComponent.emergencyContactWhatsappLocal}`.trim();
      formData.append('emergencyContactWhatsapp', phone);
    } else if (formDataFromComponent.emergencyContactWhatsapp) {
      formData.append('emergencyContactWhatsapp', formDataFromComponent.emergencyContactWhatsapp);
    }
    if (formDataFromComponent.emergencyContactRelation) {
      formData.append('emergencyContactRelation', formDataFromComponent.emergencyContactRelation);
    }
    if (formDataFromComponent.emergencyContactRelation === 'other' && formDataFromComponent.emergencyContactRelationOther) {
      formData.append('emergencyContactRelationOther', formDataFromComponent.emergencyContactRelationOther);
    }
    if (formDataFromComponent.anyDisease) {
      formData.append('anyDisease', formDataFromComponent.anyDisease);
    }
    if (formDataFromComponent.diseaseDetails) {
      formData.append('diseaseDetails', formDataFromComponent.diseaseDetails);
    }
    if (formDataFromComponent.bloodGroup) {
      formData.append('bloodGroup', formDataFromComponent.bloodGroup);
    }
    
    // Nearest Relative fields
    if (formDataFromComponent.nearestRelativeContactLocal) {
      const phone = `${formDataFromComponent.nearestRelativeContactCountry || '+92'} ${formDataFromComponent.nearestRelativeContactLocal}`.trim();
      formData.append('nearestRelativeContact', phone);
    } else if (formDataFromComponent.nearestRelativeContact) {
      formData.append('nearestRelativeContact', formDataFromComponent.nearestRelativeContact);
    }
    if (formDataFromComponent.nearestRelativeWhatsappLocal) {
      const phone = `${formDataFromComponent.nearestRelativeWhatsappCountry || '+92'} ${formDataFromComponent.nearestRelativeWhatsappLocal}`.trim();
      formData.append('nearestRelativeWhatsapp', phone);
    } else if (formDataFromComponent.nearestRelativeWhatsapp) {
      formData.append('nearestRelativeWhatsapp', formDataFromComponent.nearestRelativeWhatsapp);
    }
    if (formDataFromComponent.nearestRelativeRelation) {
      formData.append('nearestRelativeRelation', formDataFromComponent.nearestRelativeRelation);
    }
    if (formDataFromComponent.nearestRelativeRelation === 'other' && formDataFromComponent.nearestRelativeRelationOther) {
      formData.append('nearestRelativeRelationOther', formDataFromComponent.nearestRelativeRelationOther);
    }

    // Vehicle/Bike Detail fields - append empty values too so edit can clear them
    formData.append('vehicleParkingStatus', formDataFromComponent.vehicleParkingStatus || '');
    formData.append('vehicleType', formDataFromComponent.vehicleType || '');
    formData.append('vehicleNumberPlate', formDataFromComponent.vehicleNumberPlate || '');
    formData.append('vehicleRegistrationNumber', formDataFromComponent.vehicleRegistrationNumber || '');
    formData.append('vehicleColor', formDataFromComponent.vehicleColor || '');
    
    // Hostel Info fields
    if (formDataFromComponent.hostelId) {
      formData.append('hostelId', formDataFromComponent.hostelId);
    }
    if (formDataFromComponent.floorId) {
      formData.append('floorId', formDataFromComponent.floorId);
    }
    if (formDataFromComponent.roomId) {
      formData.append('roomId', formDataFromComponent.roomId);
    }
    if (formDataFromComponent.bedId) {
      formData.append('bedId', formDataFromComponent.bedId);
    }
    if (formDataFromComponent.leaseStartDate) {
      formData.append('leaseStartDate', formDataFromComponent.leaseStartDate);
    }
    if (formDataFromComponent.leaseEndDate) {
      formData.append('leaseEndDate', formDataFromComponent.leaseEndDate);
    }
    formData.append('monthlyRent', formDataFromComponent.monthlyRent || '0');
    formData.append('securityDeposit', formDataFromComponent.securityDeposit || '0');
    if (formDataFromComponent.lateFeesFine) {
      formData.append('lateFeesFine', formDataFromComponent.lateFeesFine);
    }
    if (formDataFromComponent.lateFeesFine === 'Yes') {
      if (formDataFromComponent.lateFeesPercentage) {
        formData.append('lateFeesPercentage', formDataFromComponent.lateFeesPercentage);
      }
      if (formDataFromComponent.lateFeesChargeDate) {
        formData.append('lateFeesChargeDate', formDataFromComponent.lateFeesChargeDate);
      }
    }
    
    // Hostel document fields
    if (formDataFromComponent.rentalDocument) {
      Array.from(formDataFromComponent.rentalDocument).forEach((file) => {
        formData.append('rentalDocument', file);
      });
    }
    if (formDataFromComponent.securityDepositFile) {
      Array.from(formDataFromComponent.securityDepositFile).forEach((file) => {
        formData.append('securityDepositFile', file);
      });
    }
    if (formDataFromComponent.advancedRentReceivedFile) {
      Array.from(formDataFromComponent.advancedRentReceivedFile).forEach((file) => {
        formData.append('advancedRentReceivedFile', file);
      });
    }

    if (formDataFromComponent.otherDocuments && formDataFromComponent.otherDocuments.length > 0) {
      formDataFromComponent.otherDocuments.forEach((item) => {
        if (item.documentName) {
          formData.append('otherDocumentsName', item.documentName);
        }
        if (item.documentFile) {
          formData.append('otherDocuments', item.documentFile);
        }
      });
    }

    try {
      setToast({
        open: true,
        type: 'info',
        message: isEditing ? 'Updating tenant...' : 'Creating tenant...',
      });

      let response;
      if (isEditing && editingTenantId) {
        response = await tenantService.updateTenant(editingTenantId, formData);
      } else {
        response = await tenantService.createTenant(formData);
        
        // Create check-in alert in maintenance tab (only for new tenants)
        try {
          alertService.createCheckInAlert(
            tenantName,
            `Room ${formDataFromComponent.roomId}`,
            `Bed ${formDataFromComponent.bedId}`
          );
        } catch (error) {
          console.error('Failed to create check-in alert:', error);
        }
      }

      setToast({
        open: true,
        type: 'success',
        message: response.message || (isEditing ? `Tenant "${tenantName}" updated successfully!` : `Tenant "${tenantName}" added successfully!`),
      });

      setIsAddModalOpen(false);
      setEditingTenantId(null);
      setTenantFormData({});

      // Refresh tenant list if a hostel is selected
      if (selectedHostelId && activeSection === 'Tenants') {
        try {
          const tenantsData = await tenantService.getTenantsByHostel(Number(selectedHostelId));
          setTenants(tenantsData);
        } catch (error) {
          console.error('Error refreshing tenants:', error);
        }
      }
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} tenant:`, error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || `Failed to ${isEditing ? 'update' : 'create'} tenant. Please try again.`,
      });
      throw error; // Re-throw so TenantForm can handle it
    }
  };

  // Wrapper function for EmployeeForm onSubmit - receives formData from EmployeeForm component
  const handleEmployeeSubmit = async (formDataFromComponent: EmployeeFormData): Promise<void> => {
    const employeeName = formDataFromComponent.name;
    const isEditing = editingEmployeeId !== null;
    
    try {
      setEmployeesLoading(true);
      setToast({
        open: true,
        type: 'info',
        message: isEditing ? 'Updating employee...' : 'Creating employee...',
      });

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      
      // User fields (from Hostel Access tab)
      formData.append('username', formDataFromComponent.username);
      formData.append('email', formDataFromComponent.email);
      formData.append('phone', formDataFromComponent.phone);
      if (formDataFromComponent.password) {
        formData.append('password', formDataFromComponent.password);
      }
      
      // Personal Information fields
      formData.append('name', formDataFromComponent.name);
      if (formDataFromComponent.fatherName) {
        formData.append('fatherName', formDataFromComponent.fatherName);
      }
      if (formDataFromComponent.whatsappNumber) {
        formData.append('whatsappNumber', formDataFromComponent.whatsappNumber);
      }
      
      // Employee fields
      if (formDataFromComponent.roleId) {
        formData.append('roleId', formDataFromComponent.roleId);
      }
      if (formDataFromComponent.hostelId) {
        formData.append('hostelId', formDataFromComponent.hostelId);
      }
      if (formDataFromComponent.joinDate) {
        formData.append('joinDate', formDataFromComponent.joinDate);
      }
      if (formDataFromComponent.salary) {
        formData.append('salary', formDataFromComponent.salary);
      }
      if (formDataFromComponent.workingHours) {
        formData.append('workingHours', formDataFromComponent.workingHours);
      }
      if (formDataFromComponent.reference) {
        formData.append('reference', formDataFromComponent.reference);
      }
      if (formDataFromComponent.notes) {
        formData.append('notes', formDataFromComponent.notes);
      }
      
      // Address fields
      if (formDataFromComponent.address.street) {
        formData.append('address[street]', formDataFromComponent.address.street);
      }
      if (formDataFromComponent.address.city) {
        formData.append('address[city]', formDataFromComponent.address.city);
      }
      if (formDataFromComponent.address.country) {
        formData.append('address[country]', formDataFromComponent.address.country);
      }
      
      // Files - Profile Photo
      if (formDataFromComponent.profilePhoto) {
        formData.append('profilePhoto', formDataFromComponent.profilePhoto);
      }
      
      // Files - CNIC Documents (max 2 images)
      if (formDataFromComponent.cnicDocuments) {
        Array.from(formDataFromComponent.cnicDocuments).forEach((file) => {
          formData.append('cnicDocuments', file);
        });
      }
      
      // Files - Agreement Document (1 image)
      if (formDataFromComponent.agreementDocument) {
        formData.append('agreementDocument', formDataFromComponent.agreementDocument);
      }
      
      // Files - Police Character Certificate (1 image)
      if (formDataFromComponent.policeCharacterCertificate) {
        formData.append('policeCharacterCertificate', formDataFromComponent.policeCharacterCertificate);
      }
      
      // Files - Any Other Documents (multiple files)
      if (formDataFromComponent.anyOtherDocuments) {
        Array.from(formDataFromComponent.anyOtherDocuments).forEach((file) => {
          formData.append('anyOtherDocuments', file);
        });
      }
      
      // Professional fields
      if (formDataFromComponent.professionType) {
        formData.append('professionType', formDataFromComponent.professionType);
      }
      
      // Student fields
      if (formDataFromComponent.professionType === 'student') {
        if (formDataFromComponent.academicName) {
          formData.append('academicName', formDataFromComponent.academicName);
        }
        if (formDataFromComponent.academicAddress) {
          formData.append('academicAddress', formDataFromComponent.academicAddress);
        }
        if (formDataFromComponent.academicLocation) {
          formData.append('academicLocation', formDataFromComponent.academicLocation);
        }
        if (formDataFromComponent.studentCardNo) {
          formData.append('studentCardNo', formDataFromComponent.studentCardNo);
        }
        if (formDataFromComponent.academicAttachments) {
          Array.from(formDataFromComponent.academicAttachments).forEach((file) => {
            formData.append('academicAttachments', file);
          });
        }
      }
      
      // Job fields
      if (formDataFromComponent.professionType === 'job') {
        if (formDataFromComponent.jobTitle) {
          formData.append('jobTitle', formDataFromComponent.jobTitle);
        }
        if (formDataFromComponent.companyName) {
          formData.append('companyName', formDataFromComponent.companyName);
        }
        if (formDataFromComponent.jobAddress) {
          formData.append('jobAddress', formDataFromComponent.jobAddress);
        }
        if (formDataFromComponent.jobLocation) {
          formData.append('jobLocation', formDataFromComponent.jobLocation);
        }
        if (formDataFromComponent.jobIdNo) {
          formData.append('jobIdNo', formDataFromComponent.jobIdNo);
        }
        if (formDataFromComponent.jobAttachments) {
          Array.from(formDataFromComponent.jobAttachments).forEach((file) => {
            formData.append('jobAttachments', file);
          });
        }
      }
      
      // Business fields
      if (formDataFromComponent.professionType === 'business') {
        if (formDataFromComponent.businessName) {
          formData.append('businessName', formDataFromComponent.businessName);
        }
        if (formDataFromComponent.businessAddress) {
          formData.append('businessAddress', formDataFromComponent.businessAddress);
        }
        if (formDataFromComponent.businessLocation) {
          formData.append('businessLocation', formDataFromComponent.businessLocation);
        }
        if (formDataFromComponent.businessAttachments) {
          Array.from(formDataFromComponent.businessAttachments).forEach((file) => {
            formData.append('businessAttachments', file);
          });
        }
      }
      
      if (formDataFromComponent.professionDescription) {
        formData.append('professionDescription', formDataFromComponent.professionDescription);
      }
      
      // Emergency fields
      if (formDataFromComponent.emergencyContactName) {
        formData.append('emergencyContactName', formDataFromComponent.emergencyContactName);
      }
      if (formDataFromComponent.emergencyContactNumber) {
        formData.append('emergencyContactNumber', formDataFromComponent.emergencyContactNumber);
      }
      if (formDataFromComponent.emergencyContactWhatsapp) {
        formData.append('emergencyContactWhatsapp', formDataFromComponent.emergencyContactWhatsapp);
      }
      if (formDataFromComponent.emergencyContactRelation) {
        formData.append('emergencyContactRelation', formDataFromComponent.emergencyContactRelation);
      }
      if (formDataFromComponent.emergencyContactRelation === 'other' && formDataFromComponent.emergencyContactRelationOther) {
        formData.append('emergencyContactRelationOther', formDataFromComponent.emergencyContactRelationOther);
      }
      if (formDataFromComponent.anyDisease) {
        formData.append('anyDisease', formDataFromComponent.anyDisease);
      }
      if (formDataFromComponent.bloodGroup) {
        formData.append('bloodGroup', formDataFromComponent.bloodGroup);
      }
      
      // Nearest Relative fields
      if (formDataFromComponent.nearestRelativeContact) {
        formData.append('nearestRelativeContact', formDataFromComponent.nearestRelativeContact);
      }
      if (formDataFromComponent.nearestRelativeWhatsapp) {
        formData.append('nearestRelativeWhatsapp', formDataFromComponent.nearestRelativeWhatsapp);
      }
      if (formDataFromComponent.nearestRelativeRelation) {
        formData.append('nearestRelativeRelation', formDataFromComponent.nearestRelativeRelation);
      }
      if (formDataFromComponent.nearestRelativeRelation === 'other' && formDataFromComponent.nearestRelativeRelationOther) {
        formData.append('nearestRelativeRelationOther', formDataFromComponent.nearestRelativeRelationOther);
      }

      let response;
      if (isEditing && editingEmployeeId) {
        response = await employeeService.updateEmployee(editingEmployeeId, formData);
      } else {
        response = await employeeService.createEmployee(formData);
      }
      
      if (response && response.success) {
        setToast({
          open: true,
          type: 'success',
          message: response.message || (isEditing ? `Employee "${employeeName}" updated successfully!` : `Employee "${employeeName}" added successfully!`),
        });
        setIsAddModalOpen(false);
        setEditingEmployeeId(null);
        setEmployeeFormData({});
        
        // Refresh employees list if hostel is selected
        if (selectedHostelId && activeSection === 'Employees') {
          const employeesData = await employeeService.getEmployeesByHostel(Number(selectedHostelId));
          setEmployees(employeesData);
        }
      } else {
        throw new Error(response?.message || `Failed to ${isEditing ? 'update' : 'create'} employee`);
      }
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} employee:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditing ? 'update' : 'create'} employee. Please try again.`;
      setToast({
        open: true,
        type: 'error',
        message: errorMessage,
      });
      throw error; // Re-throw so EmployeeForm can handle it
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Wrapper function for ProspectForm onSubmit - receives formData from ProspectForm component
  const handleProspectSubmit = async (formDataFromComponent: ProspectFormData): Promise<void> => {
    const prospectName = formDataFromComponent.fullName || `${formDataFromComponent.firstName || ''} ${formDataFromComponent.lastName || ''}`.trim();
    const isEditing = editingProspectId !== null;
    
    try {
      setProspectsLoading(true);
      setToast({
        open: true,
        type: 'info',
        message: isEditing ? 'Updating prospect...' : 'Creating prospect...',
      });

      // Create FormData for file uploads
      const formData = new FormData();
      
      // Personal Information
      formData.append('fullName', formDataFromComponent.fullName);
      formData.append('fatherName', formDataFromComponent.fatherName);
      formData.append('firstName', formDataFromComponent.fullName); // Keep for backward compatibility
      formData.append('lastName', formDataFromComponent.fatherName); // Keep for backward compatibility
      formData.append('email', formDataFromComponent.email);
      formData.append('phone', formDataFromComponent.phone);
      if (formDataFromComponent.whatsappNumber) {
        formData.append('whatsappNumber', formDataFromComponent.whatsappNumber);
      }
      formData.append('gender', formDataFromComponent.gender);
      if (formDataFromComponent.gender === 'other' && formDataFromComponent.genderOther) {
        formData.append('genderOther', formDataFromComponent.genderOther);
      }
      if (formDataFromComponent.dateOfBirth) {
        formData.append('dateOfBirth', formDataFromComponent.dateOfBirth);
      }
      if (formDataFromComponent.cnicNumber) {
        formData.append('cnicNumber', formDataFromComponent.cnicNumber);
      }
      if (formDataFromComponent.profilePhoto) {
        formData.append('profilePhoto', formDataFromComponent.profilePhoto);
      }
      // Handle multiple attachments
      if (formDataFromComponent.attachments) {
        Array.from(formDataFromComponent.attachments).forEach((file) => {
          formData.append('attachments', file);
        });
      }
      
      // Professional fields
      if (formDataFromComponent.professionType) {
        formData.append('professionType', formDataFromComponent.professionType);
      }
      
      // Student fields
      if (formDataFromComponent.professionType === 'student') {
        if (formDataFromComponent.academicName) {
          formData.append('academicName', formDataFromComponent.academicName);
        }
        if (formDataFromComponent.academicAddress) {
          formData.append('academicAddress', formDataFromComponent.academicAddress);
        }
        if (formDataFromComponent.academicLocation) {
          formData.append('academicLocation', formDataFromComponent.academicLocation);
        }
        if (formDataFromComponent.studentCardNo) {
          formData.append('studentCardNo', formDataFromComponent.studentCardNo);
        }
        if (formDataFromComponent.academicAttachments) {
          Array.from(formDataFromComponent.academicAttachments).forEach((file) => {
            formData.append('academicAttachments', file);
          });
        }
      }
      
      // Job fields
      if (formDataFromComponent.professionType === 'job') {
        if (formDataFromComponent.jobTitle) {
          formData.append('jobTitle', formDataFromComponent.jobTitle);
        }
        if (formDataFromComponent.companyName) {
          formData.append('companyName', formDataFromComponent.companyName);
        }
        if (formDataFromComponent.jobAddress) {
          formData.append('jobAddress', formDataFromComponent.jobAddress);
        }
        if (formDataFromComponent.jobLocation) {
          formData.append('jobLocation', formDataFromComponent.jobLocation);
        }
        if (formDataFromComponent.jobIdNo) {
          formData.append('jobIdNo', formDataFromComponent.jobIdNo);
        }
        if (formDataFromComponent.jobAttachments) {
          Array.from(formDataFromComponent.jobAttachments).forEach((file) => {
            formData.append('jobAttachments', file);
          });
        }
      }
      
      // Business fields
      if (formDataFromComponent.professionType === 'business') {
        if (formDataFromComponent.businessName) {
          formData.append('businessName', formDataFromComponent.businessName);
        }
        if (formDataFromComponent.businessAddress) {
          formData.append('businessAddress', formDataFromComponent.businessAddress);
        }
        if (formDataFromComponent.businessLocation) {
          formData.append('businessLocation', formDataFromComponent.businessLocation);
        }
        if (formDataFromComponent.businessAttachments) {
          Array.from(formDataFromComponent.businessAttachments).forEach((file) => {
            formData.append('businessAttachments', file);
          });
        }
      }
      
      if (formDataFromComponent.professionDescription) {
        formData.append('professionDescription', formDataFromComponent.professionDescription);
      }
      formData.append('status', formDataFromComponent.status || 'Active');
      
      // Emergency contact fields
      if (formDataFromComponent.emergencyContactName) {
        formData.append('emergencyContactName', formDataFromComponent.emergencyContactName);
      }
      if (formDataFromComponent.emergencyContactNumber) {
        formData.append('emergencyContactNumber', formDataFromComponent.emergencyContactNumber);
      }
      if (formDataFromComponent.emergencyContactWhatsapp) {
        formData.append('emergencyContactWhatsapp', formDataFromComponent.emergencyContactWhatsapp);
      }
      if (formDataFromComponent.emergencyContactRelation) {
        formData.append('emergencyContactRelation', formDataFromComponent.emergencyContactRelation);
      }
      if (formDataFromComponent.emergencyContactRelation === 'other' && formDataFromComponent.emergencyContactRelationOther) {
        formData.append('emergencyContactRelationOther', formDataFromComponent.emergencyContactRelationOther);
      }
      if (formDataFromComponent.anyDisease) {
        formData.append('anyDisease', formDataFromComponent.anyDisease);
      }
      if (formDataFromComponent.bloodGroup) {
        formData.append('bloodGroup', formDataFromComponent.bloodGroup);
      }
      
      // Nearest Relative fields
      if (formDataFromComponent.nearestRelativeContact) {
        formData.append('nearestRelativeContact', formDataFromComponent.nearestRelativeContact);
      }
      if (formDataFromComponent.nearestRelativeWhatsapp) {
        formData.append('nearestRelativeWhatsapp', formDataFromComponent.nearestRelativeWhatsapp);
      }
      if (formDataFromComponent.nearestRelativeRelation) {
        formData.append('nearestRelativeRelation', formDataFromComponent.nearestRelativeRelation);
      }
      if (formDataFromComponent.nearestRelativeRelation === 'other' && formDataFromComponent.nearestRelativeRelationOther) {
        formData.append('nearestRelativeRelationOther', formDataFromComponent.nearestRelativeRelationOther);
      }

      let response;
      if (isEditing && editingProspectId) {
        response = await prospectService.updateProspect(editingProspectId, formData);
      } else {
        response = await prospectService.createProspect(formData);
      }
      
      if (response && response.success) {
        setToast({
          open: true,
          type: 'success',
          message: response.message || (isEditing ? `Prospect "${prospectName}" updated successfully!` : `Prospect "${prospectName}" added successfully!`),
        });
        setIsAddModalOpen(false);
        setEditingProspectId(null);
        setProspectFormData({});
        
        // Refresh prospects list
        if (activeSection === 'Prospects') {
          const prospectsData = await prospectService.getAllProspects();
          setProspects(prospectsData);
        }
      } else {
        throw new Error(response?.message || `Failed to ${isEditing ? 'update' : 'create'} prospect`);
      }
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} prospect:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditing ? 'update' : 'create'} prospect. Please try again.`;
      setToast({
        open: true,
        type: 'error',
        message: errorMessage,
      });
      throw error; // Re-throw so ProspectForm can handle it
    } finally {
      setProspectsLoading(false);
    }
  };

  const handleAddClose = () => {
    setIsAddModalOpen(false);
    setEditingTenantId(null);
    setEditingEmployeeId(null);
    setEditingProspectId(null);
    setTenantFormData({});
    setEmployeeFormData({});
    setProspectFormData({});
  };

  const handleScoreClick = (type: 'Tenant' | 'Employee', id: number, name: string) => {
    setCurrentScoreEntity({ type, id, name });
    const existingScore = getScore(type, id);
    if (existingScore) {
      setScoreForm({
        behavior: existingScore.behavior,
        punctuality: existingScore.punctuality,
        cleanliness: existingScore.cleanliness,
        referrals: typeof existingScore.referrals === 'number' ? existingScore.referrals : 0,
        timePeriod: existingScore.timePeriod || '',
        remarks: existingScore.remarks || '',
      });
    } else {
      setScoreForm({
        behavior: 5,
        punctuality: 5,
        cleanliness: 5,
        referrals: 0,
        timePeriod: '',
        remarks: '',
      });
    }
    setIsScoreModalOpen(true);
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScoreEntity) return;

    const scoreRecord = await saveScore(
      currentScoreEntity.type,
      currentScoreEntity.id,
      scoreForm
    );

    setToast({
      open: true,
      type: 'success',
      message: `Score updated successfully! Overall: ${scoreRecord.average.toFixed(1)}/5`,
    });

    setIsScoreModalOpen(false);
    
    // Refresh modal data if open
    if (modal && modal.data.id === currentScoreEntity.id) {
      setModal({ ...modal });
    }
  };

  const handleScoreClose = () => {
    setIsScoreModalOpen(false);
    setCurrentScoreEntity(null);
    setScoreForm({
      behavior: 5,
      punctuality: 5,
      cleanliness: 5,
      referrals: 0,
      timePeriod: '',
      remarks: '',
    });
  };

  const calculateAverage = useCallback(() => {
    return ((scoreForm.behavior + scoreForm.punctuality + scoreForm.cleanliness) / 3).toFixed(1);
  }, [scoreForm.behavior, scoreForm.punctuality, scoreForm.cleanliness]);

  // Handle PDF export
  const handleExportPDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      
      // Add branding (watermark, logo, center text, user name)
      const userName = user?.username || 'User';
      addPDFBranding(doc, userName);
      
      let yPos = 35; // Start after header
      
      // Title
      doc.setFontSize(18);
      doc.text(`${activeSection || 'People'} Report`, 105, yPos, { align: 'center' });
      yPos += 10;
      
      // Date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      // Data based on active section
      if (activeSection === 'Tenants' && filteredTenants.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Tenants List', 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        filteredTenants.slice(0, 20).forEach((tenant, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${tenant.name || 'N/A'} - ${tenant.email || 'N/A'} - ${tenant.phone || 'N/A'}`, 20, yPos);
          yPos += 6;
        });
      } else if (activeSection === 'Employees' && filteredEmployees.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Employees List', 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        filteredEmployees.slice(0, 20).forEach((employee, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${employee.name || 'N/A'} - ${employee.email || 'N/A'} - ${employee.phone || 'N/A'}`, 20, yPos);
          yPos += 6;
        });
      } else if (activeSection === 'Prospects' && filteredProspects.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Prospects List', 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        filteredProspects.slice(0, 20).forEach((prospect, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${prospect.name || 'N/A'} - ${prospect.email || 'N/A'} - ${prospect.phone || 'N/A'}`, 20, yPos);
          yPos += 6;
        });
      } else {
        doc.setFontSize(12);
        doc.text('No data available for export', 20, yPos);
      }
      
      // Add header to all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        if (i > 1) {
          addPDFHeader(doc, userName);
        }
      }
      
      // Save PDF
      doc.save(`${activeSection?.toLowerCase() || 'people'}-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to export PDF. Please try again.',
      });
    }
  }, [activeSection, filteredTenants, filteredEmployees, filteredProspects, user]);

  // Memoized handlers - use the original handlers directly
  const handleViewMemo = handleView;
  const handleEditMemo = handleEdit;
  const handleDeleteMemo = handleDelete;
  const handleTransferMemo = handleTransfer;

  // Vendor wrapper component
  const vendorListWrapper = activeSection === 'Vendors' ? (
    <React.Suspense fallback={
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading vendors...</p>
      </div>
    }>
      <VendorListWrapper 
        selectedHostelId={selectedHostelId}
        onHostelChange={setSelectedHostelId}
      />
    </React.Suspense>
  ) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeSection && (
          <>
            {/* Header */}
            <PeopleHeader
              activeSection={activeSection}
              selectedHostelId={selectedHostelId}
              onHostelChange={setSelectedHostelId}
              hostelOptions={hostelOptions}
              hostelsLoading={hostelsLoading}
              onExportPDF={handleExportPDF}
              onAddClick={handleAddClick}
            />

            {/* Content */}
            <PeopleContent
              activeSection={activeSection}
              selectedHostelId={selectedHostelId}
              tenants={filteredTenants}
              employees={filteredEmployees}
              prospects={filteredProspects}
              tenantsLoading={tenantsLoading}
              employeesLoading={employeesLoading}
              prospectsLoading={prospectsLoading}
              onView={handleViewMemo}
              onEdit={handleEditMemo}
              onDelete={handleDeleteMemo}
              onTransfer={handleTransferMemo}
              onAddClick={handleAddClick}
              vendorListWrapper={vendorListWrapper}
            />
          </>
        )}
        {!activeSection && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Select a Section</h2>
              <p className="text-slate-600">Choose a section from the directory to get started.</p>
            </div>
          </div>
        )}
      </div>

      {/* View/Edit Modal */}
      {modal && (
        <ViewModal
          modal={modal}
          onClose={() => setModal(null)}
          detailTab={detailTab}
          onDetailTabChange={setDetailTab}
          onScoreClick={(type, id, name) => handleScoreClick(type, id, name)}
          getScore={getScore}
          getScoreHistory={getScoreHistory}
        />
      )}

      {/* Add Tenant Modal */}
      {isAddModalOpen && activeSection === 'Tenants' && (
        <TenantForm
          isOpen={isAddModalOpen}
          onClose={handleAddClose}
          onSubmit={handleTenantSubmit}
          editingId={editingTenantId}
          initialData={editingTenantId ? tenantFormData : undefined}
          hostelOptions={hostelOptions}
          hostelsLoading={hostelsLoading}
        />
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && activeSection === 'Employees' && (
        <EmployeeForm
          isOpen={isAddModalOpen}
          onClose={handleAddClose}
          onSubmit={handleEmployeeSubmit}
          editingId={editingEmployeeId}
          initialData={editingEmployeeId ? employeeFormData : undefined}
          hostelOptions={hostelOptions}
          hostelsLoading={hostelsLoading}
          roleOptions={roles}
          rolesLoading={rolesLoading}
        />
      )}

      {/* Add Prospect Modal */}
      {isAddModalOpen && activeSection === 'Prospects' && (
        <ProspectForm
          isOpen={isAddModalOpen}
          onClose={handleAddClose}
          onSubmit={handleProspectSubmit}
          editingId={editingProspectId}
          initialData={editingProspectId ? prospectFormData : undefined}
        />
      )}


      {/* Score Update Modal */}
      <ScoreModal
        isOpen={isScoreModalOpen}
        onClose={handleScoreClose}
        onSubmit={handleScoreSubmit}
        scoreForm={scoreForm}
        onScoreFormChange={(updates) => setScoreForm({ ...scoreForm, ...updates })}
        currentScoreEntity={currentScoreEntity}
        calculateAverage={calculateAverage}
      />

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default PeopleHub;
