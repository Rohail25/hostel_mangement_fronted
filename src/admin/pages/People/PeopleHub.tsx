/**
 * PeopleHub page
 * Select a hostel, then view Tenants/Employees in tabs
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs } from '../../components/Tabs';
import type { Tab } from '../../components/Tabs';
import { Badge } from '../../components/Badge';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import tenantsData from '../../mock/tenants.json';
import employeesData from '../../mock/employees.json';
import hostels from '../../mock/hostels.json';
import * as hostelService from '../../services/hostel.service';
import type { ArchitectureData } from '../../types/hostel';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  BriefcaseIcon, 
  HomeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';

type TabId = 'Tenants' | 'Employees';

const PeopleHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('Tenants');
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [modal, setModal] = useState<{ mode: 'view' | 'edit'; type: 'Tenant' | 'Employee'; data: any } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<'details' | 'scorecard'>('details');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreForm, setScoreForm] = useState({
    behavior: 5,
    punctuality: 5,
    cleanliness: 5,
    remarks: '',
  });
  const [currentScoreEntity, setCurrentScoreEntity] = useState<{ type: 'Tenant' | 'Employee'; id: number; name: string } | null>(null);
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [tenantFormData, setTenantFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    cnic: '',
    phone: '',
    // Step 2: Room Allocation
    hostelId: '',
    floorNumber: '',
    roomNumber: '',
    seatNumber: '',
    // Step 3: Lease Information
    leaseStart: '',
    leaseEnd: '',
    rent: '',
    deposit: '',
  });

  // Architecture data for selected hostel
  const [architectureData, setArchitectureData] = useState<ArchitectureData | null>(null);
  const [availableFloors, setAvailableFloors] = useState<{ value: string; label: string }[]>([]);
  const [availableRooms, setAvailableRooms] = useState<{ value: string; label: string }[]>([]);
  const [availableSeats, setAvailableSeats] = useState<{ value: string; label: string }[]>([]);

  const [addFormData, setAddFormData] = useState<any>({
    // Employee form fields (kept for employee form)
    name: '',
    email: '',
    phone: '',
    role: '',
    salary: '',
    joinDate: '',
  });

  const hostelOptions = useMemo(
    () => [
      { value: '', label: 'All Hostels' },
      ...hostels.map((h) => ({ value: String((h as any).id), label: `${(h as any).name} - ${(h as any).city}` })),
    ],
    []
  );

  // Filter tenants and employees by selected hostel
  const filteredTenants = useMemo(() => {
    let data = tenantsData as any[];
    if (selectedHostelId) {
      data = data.filter((t) => String(t.hostelId) === selectedHostelId);
    }
    return data;
  }, [selectedHostelId]);

  const filteredEmployees = useMemo(() => {
    let data = employeesData as any[];
    if (selectedHostelId) {
      data = data.filter((e) => String(e.hostelId) === selectedHostelId);
    }
    return data;
  }, [selectedHostelId]);

  const tabs: Tab[] = [
    { id: 'Tenants', label: 'Tenants', count: (filteredTenants as any[]).length },
    { id: 'Employees', label: 'Employees', count: (filteredEmployees as any[]).length },
  ];

  // Load architecture data when hostel is selected
  useEffect(() => {
    if (tenantFormData.hostelId) {
      try {
        const archData = hostelService.getArchitectureData(Number(tenantFormData.hostelId));
        setArchitectureData(archData);
        
        // Populate floors
        const floors = archData.floors.map(floor => ({
          value: String(floor.floorNumber),
          label: `Floor ${floor.floorNumber}`,
        }));
        setAvailableFloors(floors);
      } catch (error) {
        console.error('Error loading architecture data:', error);
        setArchitectureData(null);
      }
    } else {
      setArchitectureData(null);
      setAvailableFloors([]);
      setAvailableRooms([]);
      setAvailableSeats([]);
    }
  }, [tenantFormData.hostelId]);

  // Update rooms when floor is selected
  useEffect(() => {
    if (architectureData && tenantFormData.floorNumber) {
      const floor = architectureData.floors.find(
        f => f.floorNumber === Number(tenantFormData.floorNumber)
      );
      if (floor) {
        const rooms = floor.rooms.map(room => ({
          value: room.roomNumber,
          label: `Room ${tenantFormData.floorNumber}${room.roomNumber}`,
        }));
        setAvailableRooms(rooms);
      } else {
        setAvailableRooms([]);
      }
      setAvailableSeats([]);
      setTenantFormData(prev => ({ ...prev, roomNumber: '', seatNumber: '' }));
    } else {
      setAvailableRooms([]);
      setAvailableSeats([]);
    }
  }, [tenantFormData.floorNumber, architectureData]);

  // Update seats when room is selected
  useEffect(() => {
    if (architectureData && tenantFormData.floorNumber && tenantFormData.roomNumber) {
      const floor = architectureData.floors.find(
        f => f.floorNumber === Number(tenantFormData.floorNumber)
      );
      if (floor) {
        const room = floor.rooms.find(r => r.roomNumber === tenantFormData.roomNumber);
        if (room) {
          // Only show unoccupied seats
          const unoccupiedSeats = room.seats
            .filter(seat => !seat.isOccupied)
            .map(seat => ({
              value: seat.seatNumber,
              label: `Seat ${seat.seatNumber} (Available)`,
            }));
          setAvailableSeats(unoccupiedSeats);
        } else {
          setAvailableSeats([]);
        }
      } else {
        setAvailableSeats([]);
      }
      setTenantFormData(prev => ({ ...prev, seatNumber: '' }));
    } else {
      setAvailableSeats([]);
    }
  }, [tenantFormData.roomNumber, tenantFormData.floorNumber, architectureData]);

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

  const saveScore = (type: 'Tenant' | 'Employee', id: number, scoreData: any) => {
    const key = getScoreKey(type, id);
    const historyKey = `score_history_${type.toLowerCase()}_${id}`;
    
    // Calculate average
    const average = (scoreData.behavior + scoreData.punctuality + scoreData.cleanliness) / 3;
    const scoreRecord = {
      ...scoreData,
      average,
      date: new Date().toISOString(),
    };
    
    // Save current score
    localStorage.setItem(key, JSON.stringify(scoreRecord));
    
    // Add to history
    const history = getScoreHistory(type, id);
    history.unshift(scoreRecord);
    // Keep only last 10 records
    if (history.length > 10) history.pop();
    localStorage.setItem(historyKey, JSON.stringify(history));
    
    return scoreRecord;
  };


  // Action handlers
  const handleView = (id: number, type: 'Tenant' | 'Employee') => {
    const source = type === 'Tenant' ? (filteredTenants as any[]) : (filteredEmployees as any[]);
    const item = source.find((x) => x.id === id);
    if (item) {
      setModal({ mode: 'view', type, data: item });
      setDetailTab('details');
    }
  };

  const handleEdit = (id: number, type: 'Tenant' | 'Employee') => {
    const source = type === 'Tenant' ? (filteredTenants as any[]) : (filteredEmployees as any[]);
    const item = source.find((x) => x.id === id);
    if (item) setModal({ mode: 'edit', type, data: item });
  };

  const handleDelete = (id: number, type: 'Tenant' | 'Employee', name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      console.log(`Delete ${type} ID:`, id);
      // TODO: Implement delete functionality
    }
  };

  const handleAddClick = () => {
    if (activeTab === 'Tenants') {
      // Reset tenant form for multi-step wizard
      setCurrentStep(1);
      setTenantFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        cnic: '',
        phone: '',
        hostelId: '',
        floorNumber: '',
        roomNumber: '',
        seatNumber: '',
        leaseStart: '',
        leaseEnd: '',
        rent: '',
        deposit: '',
      });
      setArchitectureData(null);
      setAvailableFloors([]);
      setAvailableRooms([]);
      setAvailableSeats([]);
    } else {
      // Reset employee form
      setAddFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        salary: '',
        joinDate: '',
      });
    }
    setIsAddModalOpen(true);
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        tenantFormData.firstName &&
        tenantFormData.lastName &&
        tenantFormData.username &&
        tenantFormData.email &&
        tenantFormData.cnic
      );
    } else if (step === 2) {
      return !!(
        tenantFormData.hostelId &&
        tenantFormData.floorNumber &&
        tenantFormData.roomNumber &&
        tenantFormData.seatNumber
      );
    } else if (step === 3) {
      return !!(
        tenantFormData.leaseStart &&
        tenantFormData.leaseEnd
      );
    }
    return false;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      setToast({
        open: true,
        type: 'warning',
        message: 'Please fill in all required fields before proceeding.',
      });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setToast({
        open: true,
        type: 'warning',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    // Combine room number: floorNumber + roomNumber (e.g., "101" from floor 1, room "01")
    const fullRoomNumber = `${tenantFormData.floorNumber}${tenantFormData.roomNumber}`;
    
    console.log('New Tenant:', {
      firstName: tenantFormData.firstName,
      lastName: tenantFormData.lastName,
      name: `${tenantFormData.firstName} ${tenantFormData.lastName}`,
      username: tenantFormData.username,
      email: tenantFormData.email,
      cnic: tenantFormData.cnic,
      phone: tenantFormData.phone,
      hostelId: Number(tenantFormData.hostelId),
      room: fullRoomNumber,
      bed: tenantFormData.seatNumber,
      leaseStart: tenantFormData.leaseStart,
      leaseEnd: tenantFormData.leaseEnd,
      rent: tenantFormData.rent || 0,
      deposit: tenantFormData.deposit || 0,
      status: 'Pending',
    });

    setToast({
      open: true,
      type: 'success',
      message: `Tenant "${tenantFormData.firstName} ${tenantFormData.lastName}" added successfully!`,
    });

    setIsAddModalOpen(false);
    setCurrentStep(1);
    setTenantFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      cnic: '',
      phone: '',
      hostelId: '',
      floorNumber: '',
      roomNumber: '',
      seatNumber: '',
      leaseStart: '',
      leaseEnd: '',
      rent: '',
      deposit: '',
    });
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Employee:', {
      name: addFormData.name,
      email: addFormData.email,
      phone: addFormData.phone,
      role: addFormData.role,
      salary: addFormData.salary,
      joinedAt: addFormData.joinDate,
      status: 'Active',
    });
    alert(`Employee "${addFormData.name}" added successfully!`);
    setIsAddModalOpen(false);
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      salary: '',
      joinDate: '',
    });
  };

  const handleAddClose = () => {
    setIsAddModalOpen(false);
    setCurrentStep(1);
    setTenantFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      cnic: '',
      phone: '',
      hostelId: '',
      floorNumber: '',
      roomNumber: '',
      seatNumber: '',
      leaseStart: '',
      leaseEnd: '',
      rent: '',
      deposit: '',
    });
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      salary: '',
      joinDate: '',
    });
    setArchitectureData(null);
    setAvailableFloors([]);
    setAvailableRooms([]);
    setAvailableSeats([]);
  };

  const handleScoreClick = (type: 'Tenant' | 'Employee', id: number, name: string) => {
    setCurrentScoreEntity({ type, id, name });
    const existingScore = getScore(type, id);
    if (existingScore) {
      setScoreForm({
        behavior: existingScore.behavior,
        punctuality: existingScore.punctuality,
        cleanliness: existingScore.cleanliness,
        remarks: existingScore.remarks || '',
      });
    } else {
      setScoreForm({
        behavior: 5,
        punctuality: 5,
        cleanliness: 5,
        remarks: '',
      });
    }
    setIsScoreModalOpen(true);
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScoreEntity) return;

    const scoreRecord = saveScore(
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
      remarks: '',
    });
  };

  const calculateAverage = () => {
    return ((scoreForm.behavior + scoreForm.punctuality + scoreForm.cleanliness) / 3).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">People</h1>
          <p className="text-slate-600 mt-1">Choose a hostel, then manage tenants and employees.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-full sm:w-80">
            <Select
              value={selectedHostelId}
              onChange={setSelectedHostelId}
              options={hostelOptions}
            />
          </div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            icon={UserPlusIcon}
          >
            {activeTab === 'Tenants' ? 'Add Tenant' : 'Add Employee'}
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl border border-white/20 shadow-xl">
        <div className="px-6 pt-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
        </div>

        <div className="p-6">
          {!selectedHostelId ? (
            <div className="text-center py-16">
              <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Hostel</h3>
              <p className="text-gray-600 mb-6">Please select a hostel from the dropdown above to view tenants and employees.</p>
            </div>
          ) : activeTab === 'Tenants' ? (
            filteredTenants.length === 0 ? (
              <div className="text-center py-16">
                <UserPlusIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tenants Found</h3>
                <p className="text-gray-600 mb-6">No tenants found for the selected hostel.</p>
                <Button variant="primary" onClick={handleAddClick} icon={UserPlusIcon}>
                  Add Tenant
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(filteredTenants as any[]).map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{t.name}</h3>
                      <Badge variant={t.status === 'Active' ? 'success' : t.status === 'Pending' ? 'warning' : 'default'}>
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-blue-500" />{t.email}</div>
                    <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-blue-500" />{t.phone}</div>
                    <div className="flex items-center gap-2"><HomeIcon className="w-4 h-4 text-blue-500" />Room {t.room}-{t.bed}</div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleView(t.id, 'Tenant')}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(t.id, 'Tenant')}
                      className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(t.id, 'Tenant', t.name)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
                ))}
              </div>
            )
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-16">
              <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Employees Found</h3>
              <p className="text-gray-600 mb-6">No employees found for the selected hostel.</p>
              <Button variant="primary" onClick={handleAddClick} icon={UserPlusIcon}>
                Add Employee
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredEmployees as any[]).map((e, idx) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-lg">
                      {e.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{e.name}</h3>
                      <Badge variant={e.status === 'Active' ? 'success' : 'default'}>
                        {e.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-2"><BriefcaseIcon className="w-4 h-4 text-green-500" />{e.role}</div>
                    <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-green-500" />{e.email}</div>
                    <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-green-500" />{e.phone}</div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleView(e.id, 'Employee')}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(e.id, 'Employee')}
                      className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(e.id, 'Employee', e.name)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 ${modal.mode === 'view' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'}`}>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {modal.mode === 'view' ? 'View Details' : 'Edit Details'} — {modal.type}
                </h3>
                <p className="text-white/80 text-sm">{modal.data?.name}</p>
              </div>
              <button onClick={() => setModal(null)} className="text-white/90 hover:text-white text-lg">×</button>
            </div>

            {/* Body */}
            <div className="p-6">
              {modal.mode === 'view' ? (
                <>
                  {/* Tabs */}
                  <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => setDetailTab('details')}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        detailTab === 'details'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setDetailTab('scorecard')}
                      className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                        detailTab === 'scorecard'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <TrophyIcon className="w-4 h-4" />
                      Score Card 🏆
                    </button>
                  </div>

                  {/* Tab Content */}
                  {detailTab === 'details' ? (
                    <div className="space-y-4">
                      {modal.type === 'Tenant' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Info label="Name" value={modal.data.name} />
                            <Info label="Status" value={modal.data.status} />
                            <Info label="Email" value={modal.data.email} />
                            <Info label="Phone" value={modal.data.phone} />
                            <Info label="Room/Bed" value={`Room ${modal.data.room}-${modal.data.bed}`} />
                            <Info label="Lease Start" value={modal.data.leaseStart} />
                            <Info label="Lease End" value={modal.data.leaseEnd} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Info label="Name" value={modal.data.name} />
                            <Info label="Status" value={modal.data.status} />
                            <Info label="Email" value={modal.data.email} />
                            <Info label="Phone" value={modal.data.phone} />
                            <Info label="Role" value={modal.data.role} />
                            <Info label="Joined" value={modal.data.joinedAt} />
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <ScoreCardView
                      type={modal.type}
                      id={modal.data.id}
                      name={modal.data.name}
                      onUpdateClick={() => handleScoreClick(modal.type, modal.data.id, modal.data.name)}
                      getScore={getScore}
                      getScoreHistory={getScoreHistory}
                    />
                  )}
                </>
              ) : (
                <EditForm modal={modal} onClose={() => setModal(null)} />
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Tenant/Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleAddClose}
        title={activeTab === 'Tenants' ? `Add New Tenant - Step ${currentStep} of 3` : 'Add New Employee'}
        size="lg"
      >
        {activeTab === 'Tenants' ? (
          <form onSubmit={handleTenantSubmit} className="space-y-6">
            {/* Step Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          currentStep >= step
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {currentStep > step ? '✓' : step}
                      </div>
                      <div className="ml-2 hidden sm:block">
                        <p className={`text-xs font-medium ${
                          currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step === 1 ? 'Personal' : step === 2 ? 'Room' : 'Lease'}
                        </p>
                      </div>
                    </div>
                    {step < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Personal Information */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={tenantFormData.firstName}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={tenantFormData.lastName}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={tenantFormData.username}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, username: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                        placeholder="johndoe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={tenantFormData.email}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNIC <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={tenantFormData.cnic}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, cnic: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                        placeholder="12345-1234567-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={tenantFormData.phone}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Room Allocation */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Allocation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hostel <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={tenantFormData.hostelId}
                        onChange={(value) => {
                          setTenantFormData({
                            ...tenantFormData,
                            hostelId: value,
                            floorNumber: '',
                            roomNumber: '',
                            seatNumber: '',
                          });
                        }}
                        options={hostelOptions.filter(opt => opt.value !== '')}
                        placeholder="Select Hostel"
                      />
                    </div>
                    {tenantFormData.hostelId && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Floor <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={tenantFormData.floorNumber}
                            onChange={(value) => {
                              setTenantFormData({
                                ...tenantFormData,
                                floorNumber: value,
                                roomNumber: '',
                                seatNumber: '',
                              });
                            }}
                            options={availableFloors}
                            placeholder="Select Floor"
                          />
                        </div>
                        {tenantFormData.floorNumber && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Room <span className="text-red-500">*</span>
                            </label>
                            <Select
                              value={tenantFormData.roomNumber}
                              onChange={(value) => {
                                setTenantFormData({
                                  ...tenantFormData,
                                  roomNumber: value,
                                  seatNumber: '',
                                });
                              }}
                              options={availableRooms}
                              placeholder="Select Room"
                            />
                          </div>
                        )}
                        {tenantFormData.roomNumber && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Seat <span className="text-red-500">*</span>
                            </label>
                            <Select
                              value={tenantFormData.seatNumber}
                              onChange={(value) => {
                                setTenantFormData({
                                  ...tenantFormData,
                                  seatNumber: value,
                                });
                              }}
                              options={availableSeats}
                              placeholder="Select Available Seat"
                            />
                            {availableSeats.length === 0 && (
                              <p className="text-sm text-red-600 mt-2">No available seats in this room.</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Lease Information */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lease Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lease Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={tenantFormData.leaseStart}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, leaseStart: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lease End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={tenantFormData.leaseEnd}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, leaseEnd: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent
                      </label>
                      <input
                        type="number"
                        value={tenantFormData.rent}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, rent: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deposit
                      </label>
                      <input
                        type="number"
                        value={tenantFormData.deposit}
                        onChange={(e) => setTenantFormData({ ...tenantFormData, deposit: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? handleAddClose : handlePreviousStep}
              >
                {currentStep === 1 ? 'Cancel' : 'Previous'}
              </Button>
              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    icon={UserPlusIcon}
                  >
                    Add Tenant
                  </Button>
                )}
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleEmployeeSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Employee Specific Fields */}
          {activeTab === 'Employees' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addFormData.role}
                    onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                    placeholder="Manager, Staff, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={addFormData.joinDate}
                    onChange={(e) => setAddFormData({ ...addFormData, joinDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary
                  </label>
                  <input
                    type="number"
                    value={addFormData.salary}
                    onChange={(e) => setAddFormData({ ...addFormData, salary: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
                    placeholder="3000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={UserPlusIcon}
            >
              Add Employee
            </Button>
          </div>
        </form>
        )}
      </Modal>

      {/* Score Update Modal */}
      <Modal
        isOpen={isScoreModalOpen}
        onClose={handleScoreClose}
        title={`${currentScoreEntity ? `Update Score - ${currentScoreEntity.name}` : 'Update Score'}`}
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

          {/* Cleanliness / Task Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentScoreEntity?.type === 'Tenant' ? 'Cleanliness' : 'Task Quality'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scoreForm.cleanliness}
                onChange={(e) => setScoreForm({ ...scoreForm, cleanliness: Number(e.target.value) })}
                className="flex-1"
                required
              />
              <div className="flex items-center gap-1 min-w-[100px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-6 h-6 ${
                      star <= scoreForm.cleanliness
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-700">{scoreForm.cleanliness}/5</span>
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2176FF] focus:border-transparent"
              placeholder="Add any additional notes or comments..."
            />
          </div>

          {/* Live Average Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
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
    </div>
  );
};

export default PeopleHub;


// Small info row component
const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-slate-50 rounded-lg p-3">
    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</p>
    <p className="text-slate-900 font-medium break-words">{value || '-'}</p>
  </div>
);

// Edit form component for both Tenant and Employee
const EditForm = ({ modal, onClose }: { modal: { mode: 'view' | 'edit'; type: 'Tenant' | 'Employee'; data: any }; onClose: () => void }) => {
  const [form, setForm] = useState<any>({ ...modal.data });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update', modal.type, form);
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" required />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        {modal.type === 'Employee' ? (
          <>
            <Field label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
            <Field label="Joined" value={form.joinedAt} onChange={(v) => setForm({ ...form, joinedAt: v })} type="date" />
          </>
        ) : (
          <>
            <Field label="Room" value={form.room} onChange={(v) => setForm({ ...form, room: v })} />
            <Field label="Bed" value={form.bed} onChange={(v) => setForm({ ...form, bed: v })} />
            <Field label="Lease Start" value={form.leaseStart} onChange={(v) => setForm({ ...form, leaseStart: v })} type="date" />
            <Field label="Lease End" value={form.leaseEnd} onChange={(v) => setForm({ ...form, leaseEnd: v })} type="date" />
          </>
        )}
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg">Save Changes</button>
      </div>
    </form>
  );
};

const Field = ({ label, value, onChange, type = 'text', required = false }: { label: string; value: any; onChange: (v: string) => void; type?: string; required?: boolean }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}{required ? ' *' : ''}</label>
    <input
      type={type}
      value={value || ''}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
    />
  </div>
);

// Score Card View Component
interface ScoreCardViewProps {
  type: 'Tenant' | 'Employee';
  id: number;
  name: string;
  onUpdateClick: () => void;
  getScore: (type: 'Tenant' | 'Employee', id: number) => any;
  getScoreHistory: (type: 'Tenant' | 'Employee', id: number) => any[];
}

const ScoreCardView: React.FC<ScoreCardViewProps> = ({
  type,
  id,
  name,
  onUpdateClick,
  getScore,
  getScoreHistory,
}) => {
  const currentScore = getScore(type, id);
  const scoreHistory = getScoreHistory(type, id);

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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Performance Score</h3>
            <p className="text-sm text-gray-600">{name}</p>
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
                    <span className="text-sm text-gray-700">
                      {type === 'Tenant' ? 'Cleanliness' : 'Task Quality'}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-4 h-4 ${
                            star <= currentScore.cleanliness
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {currentScore.cleanliness}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {currentScore.remarks && (
              <div className="mt-4 pt-4 border-t border-blue-200">
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
                  <div>
                    {type === 'Tenant' ? 'Cleanliness' : 'Quality'}: {record.cleanliness}/5
                  </div>
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


