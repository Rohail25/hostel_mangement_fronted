import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  PlusIcon,
  UserGroupIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  BeakerIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import tenantsData from '../../mock/tenants.json';
import employeesData from '../../mock/employees.json';
import vendorsData from '../../mock/vendors.json';
import * as messService from '../../services/mess.service';
import * as messApiService from '../../services/mess-api.service';
import { Tabs } from '../../components/Tabs';
import { ArchitectureDiagram } from '../../components/ArchitectureDiagram';
import { AddRoomForm } from '../../components/AddRoomForm';
import { AddBlockForm } from '../../components/AddBlockForm';
import { ArrangeForm } from '../../components/ArrangeForm';
import { MessManagement } from '../../components/MessManagement';
import { EditAllocationModal } from '../../components/EditAllocationModal';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';
import { api } from '../../../services/apiClient';
import { API_ROUTES, API_BASE_URL } from '../../../services/api.config';
import type { Hostel, ArchitectureData, RoomFormData } from '../../types/hostel';
import type { ToastType } from '../../types/common';
import { useAuth } from '../../context/AuthContext';
import { getRolePrefix } from '../../../components/ProtectedRoute';

const normalizeAmenities = (amenities: any): string[] => {
  if (Array.isArray(amenities)) {
    return amenities;
  }

  if (typeof amenities === 'string' && amenities.trim()) {
    try {
      const parsed = JSON.parse(amenities);
      return Array.isArray(parsed) ? parsed : [amenities];
    } catch {
      return [amenities];
    }
  }

  return [];
};

const getMessMealPattern = (hostelId: string | number) => {
  const entries = messService.getMessEntriesByHostel(hostelId);
  if (!entries.length) {
    return { count: 0, label: 'No mess plan', details: 'Mess plan not configured' };
  }

  const mealSlots = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
  ] as const;

  const representativeEntry = entries[0];
  const activeMeals = mealSlots.filter(({ key }) => Array.isArray((representativeEntry as any)[key]?.items) && (representativeEntry as any)[key].items.length > 0);
  const count = activeMeals.length;

  if (count === 1) {
    return { count, label: '1 Time', details: 'Breakfast only' };
  }

  if (count === 2) {
    const hasLunch = activeMeals.some((meal) => meal.key === 'lunch');
    return {
      count,
      label: '2 Time',
      details: hasLunch ? 'Breakfast + Lunch' : 'Breakfast + Dinner',
    };
  }

  if (count >= 3) {
    return { count: 3, label: '3 Time', details: 'Breakfast + Lunch + Dinner' };
  }

  return { count: 0, label: 'No mess plan', details: 'Mess plan not configured' };
};

/**
 * Hostel View page with Details and Architecture tabs
 */
const HostelView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const rolePrefix = getRolePrefix(user?.roleType || 'user');
  // Determine if user is owner to use correct routes
  const isOwner = user?.roleType === 'owner' || user?.role?.name === 'owner';
  const floorRoutes = isOwner ? API_ROUTES.OWNER.FLOOR : API_ROUTES.FLOOR;
  const roomRoutes = isOwner ? API_ROUTES.OWNER.ROOM : API_ROUTES.ROOM;
  const bedRoutes = isOwner ? API_ROUTES.OWNER.BED : API_ROUTES.BED;
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [architectureData, setArchitectureData] =
    useState<ArchitectureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'arrangement' | 'architecture' | 'mess'>(
    'details'
  );
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [isArrangeOpen, setIsArrangeOpen] = useState(false);
  const [isEditAllocationOpen, setIsEditAllocationOpen] = useState(false);
  const [editingBed, setEditingBed] = useState<any>(null);
  const [floors, setFloors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [bedsLoading, setBedsLoading] = useState(false);
  const [messStats, setMessStats] = useState<{totalMess: number; totalPrice: number; averagePrice: number}>({totalMess: 0, totalPrice: 0, averagePrice: 0});
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: 'success', message: '' });

  // Calculate counts for additional cards
  const additionalStats = React.useMemo(() => {
    if (!hostel) {
      return {
        totalMess: 0,
        totalVendors: 0,
        totalEmployees: 0,
        totalTenants: 0,
      };
    }

    const hostelId = hostel.id;
    
    // Count mess entries - will be updated via API
    const messEntries = messService.getMessEntriesByHostel(hostelId);
    const totalMess = messEntries.length;

    // Count vendors for this hostel
    const vendors = (vendorsData as any[]).filter(
      (v) => v.hostelId === hostelId
    );
    const totalVendors = vendors.length;

    // Count employees for this hostel
    const employees = (employeesData as any[]).filter(
      (e) => e.hostelId === hostelId
    );
    const totalEmployees = employees.length;

    // Count tenants for this hostel
    const tenants = (tenantsData as any[]).filter(
      (t) => t.hostelId === hostelId
    );
    const totalTenants = tenants.length;

    return {
      totalMess,
      totalVendors,
      totalEmployees,
      totalTenants,
    };
  }, [hostel]);

  const messMealPattern = React.useMemo(() => {
    if (!hostel) {
      return { count: 0, label: 'No mess plan', details: 'Mess plan not configured' };
    }

    return getMessMealPattern(hostel.id);
  }, [hostel]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    loadHostelData(Number(id));
    
    // Check if we should open Add Room modal
    if (location.state && (location.state as { showAddRoom?: boolean }).showAddRoom) {
      setActiveTab('architecture');
      setIsAddRoomOpen(true);
    }
  }, [id, location.state]);

  const loadHostelData = async (hostelId: number) => {
    try {
      setLoading(true);
      
      // Load hostel details (owner uses admin endpoint, backend filters data)
      const hostelEndpoint = API_ROUTES.HOSTEL.BY_ID(hostelId);

      const hostelResponse = await api.get(hostelEndpoint);
      if (hostelResponse.success && hostelResponse.data) {
        const hostelData = hostelResponse.data;
        
        // Parse JSON fields for type and category
        let categoryValue = '';
        let typeValue = '';
        
        // Handle category - may be stored as JSON string, array, or direct value
        if (hostelData.category) {
          if (typeof hostelData.category === 'string') {
            try {
              const parsed = JSON.parse(hostelData.category);
              categoryValue = Array.isArray(parsed) ? parsed[0] : parsed;
            } catch {
              categoryValue = hostelData.category;
            }
          } else if (Array.isArray(hostelData.category)) {
            categoryValue = hostelData.category[0] || '';
          } else {
            categoryValue = hostelData.category || '';
          }
        }
        
        // Handle type - may be stored as JSON string, array, or direct value
        if (hostelData.type) {
          if (typeof hostelData.type === 'string') {
            try {
              const parsed = JSON.parse(hostelData.type);
              typeValue = Array.isArray(parsed) ? parsed[0] : parsed;
            } catch {
              typeValue = hostelData.type;
            }
          } else if (Array.isArray(hostelData.type)) {
            typeValue = hostelData.type[0] || '';
          } else {
            typeValue = hostelData.type || '';
          }
        }
        
        // Map backend response to frontend Hostel type
        const mappedHostel: Hostel = {
          id: String(hostelData.id),
          name: hostelData.name,
          city: hostelData.address?.city || hostelData.city || '',
          totalFloors: hostelData.statistics?.totalFloors || 0,
          roomsPerFloor: hostelData.statistics?.roomsPerFloor || 0,
          managerName: hostelData.manager?.username || hostelData.manager?.name || 'N/A',
          managerPhone: hostelData.contactInfo?.phone || 'N/A',
          notes: hostelData.description,
          amenities: normalizeAmenities(hostelData.amenities),
          category: categoryValue,
          type: typeValue,
        };
        setHostel(mappedHostel);
      }
      
      // Load architecture data
      await loadArchitectureData(hostelId);
      
      // Load beds with tenant data
      await loadBedsWithTenants(hostelId);
      
      // Load mess stats from API
      try {
        const stats = await messApiService.getMessStatsAPI(hostelId);
        setMessStats(stats);
      } catch (error) {
        console.error('Error loading mess stats:', error);
      }
      
    } catch (error: any) {
      console.error('Error loading hostel:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to load hostel details',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBedsWithTenants = async (hostelId: number) => {
    try {
      setBedsLoading(true);
      // Fetch all beds for this hostel through rooms
      const bedsData: any[] = [];
      
      // Get all rooms for this hostel
      const roomsResponse = await api.get(roomRoutes.BY_HOSTEL(hostelId));
      const roomsData = roomsResponse.success && roomsResponse.data
        ? (Array.isArray(roomsResponse.data) ? roomsResponse.data : roomsResponse.data.items || [])
        : [];
      
      // Fetch beds for each room with tenant information
      for (const room of roomsData) {
        try {
          const bedsResponse = await api.get(bedRoutes.BEDS_BY_ROOM(room.id));
          if (bedsResponse.success && bedsResponse.data) {
            const roomBeds = Array.isArray(bedsResponse.data) ? bedsResponse.data : bedsResponse.data.items || [];
            
            // For each bed, try to get tenant information if occupied
            for (const bed of roomBeds) {
              let tenantInfo = null;
              let leaseInfo = null;
              
              // Use currentTenant from bed response (User object)
              if (bed.currentTenant) {
                tenantInfo = {
                  name: bed.currentTenant.username || bed.currentTenant.email || 'Unknown',
                  id: bed.currentTenantId,
                };
              }
              
              // Try to get allocation/tenant details if currentTenantId exists
              if (bed.currentTenantId) {
                try {
                  // Get active allocation for this bed/user
                  const allocationResponse = await api.get(`/admin/allocations?userId=${bed.currentTenantId}&status=active`);
                  if (allocationResponse.success && allocationResponse.data) {
                    const allocations = Array.isArray(allocationResponse.data) 
                      ? allocationResponse.data 
                      : allocationResponse.data.items || [];
                    const activeAllocation = allocations.find((a: any) => a.bedId === bed.id);
                    
                    if (activeAllocation) {
                      // Get tenant details from allocation
                      if (activeAllocation.tenantId) {
                        const tenantResponse = await api.get(`/admin/tenants/${activeAllocation.tenantId}`);
                        if (tenantResponse.success && tenantResponse.data) {
                          tenantInfo = {
                            name: tenantResponse.data.name || tenantInfo?.name,
                            id: tenantResponse.data.id,
                          };
                          leaseInfo = {
                            startDate: tenantResponse.data.leaseStart || tenantResponse.data.lease?.startDate,
                            endDate: tenantResponse.data.leaseEnd || tenantResponse.data.lease?.endDate,
                            rent: tenantResponse.data.monthlyRent || tenantResponse.data.lease?.monthlyRent,
                          };
                        }
                      }
                    }
                  }
                } catch (err) {
                  console.error(`Error loading tenant details for bed ${bed.id}:`, err);
                }
              }
              
              bedsData.push({
                ...bed,
                roomId: room.id,
                roomNumber: room.roomNumber,
                floorId: room.floorId,
                currentTenant: tenantInfo || bed.currentTenant,
                tenantName: tenantInfo?.name || bed.currentTenant?.username || bed.currentTenant?.email,
                leaseStartDate: leaseInfo?.startDate,
                leaseEndDate: leaseInfo?.endDate,
                rent: leaseInfo?.rent,
              });
            }
          }
        } catch (err) {
          console.error(`Error loading beds for room ${room.id}:`, err);
        }
      }
      
      setBeds(bedsData);
    } catch (error: any) {
      console.error('Error loading beds:', error);
    } finally {
      setBedsLoading(false);
    }
  };

  const loadArchitectureData = async (hostelId: number) => {
    try {
      // Load floors (blocks)
      const floorsResponse = await api.get(floorRoutes.BY_HOSTEL(hostelId));
      const floorsData = floorsResponse.success && floorsResponse.data 
        ? (Array.isArray(floorsResponse.data) ? floorsResponse.data : floorsResponse.data.items || [])
        : [];
      setFloors(floorsData);

      // Load rooms
      const roomsResponse = await api.get(roomRoutes.BY_HOSTEL(hostelId));
      const roomsData = roomsResponse.success && roomsResponse.data
        ? (Array.isArray(roomsResponse.data) ? roomsResponse.data : roomsResponse.data.items || [])
        : [];
      setRooms(roomsData);

      // Transform backend data to ArchitectureData format
      const transformedFloors: import('../../types/hostel').Floor[] = floorsData.map((floor: any) => {
        const floorRooms = roomsData.filter((room: any) => room.floorId === floor.id);
        return {
          floorNumber: floor.floorNumber,
          rooms: floorRooms.map((room: any) => ({
            id: String(room.id),
            floorNumber: floor.floorNumber,
            roomNumber: room.roomNumber,
            totalSeats: room.totalBeds || 0,
            seats: Array.from({ length: room.totalBeds || 0 }, (_, i) => ({
              id: `${floor.floorNumber}-${room.roomNumber}-${String.fromCharCode(65 + i)}`,
              seatNumber: String.fromCharCode(65 + i),
              isOccupied: false, // TODO: Check bed occupancy from backend
              tenantName: undefined,
              tenantId: undefined,
            })),
          })),
        };
      });

      const totalRooms = roomsData.length;
      const totalSeats = roomsData.reduce((sum: number, room: any) => sum + (room.totalBeds || 0), 0);
      const occupiedSeats = 0; // TODO: Calculate from bed occupancy

      setArchitectureData({
        hostelId,
        floors: transformedFloors,
        totalRooms,
        totalSeats,
        occupiedSeats,
        availableSeats: totalSeats - occupiedSeats,
      });
    } catch (error: any) {
      console.error('Error loading architecture:', error);
    }
  };


  const handleAddRoom = async (roomData: RoomFormData & { floorId?: number }) => {
    if (!hostel || !id) return;
    
    try {
      // Use floorId if available (from form), otherwise find by floorNumber
      let floorId: number;
      if (roomData.floorId) {
        floorId = roomData.floorId;
      } else {
        const floor = floors.find((f: any) => f.floorNumber === roomData.floorNumber);
        if (!floor) {
          throw new Error('Block not found. Please create the block first.');
        }
        floorId = floor.id;
      }

      const payload = {
        hostel: Number(id),
        floor: floorId,
        roomNumber: roomData.roomNumber.trim(),
        roomType: roomData.roomType || 'single',
        totalBeds: roomData.totalSeats,
        pricePerBed: roomData.pricePerSeat || 0,
        furnishing: roomData.furnishing || 'furnished',
      };

      console.log('📡 Creating room:', payload);
      console.log('📡 Room CREATE route:', roomRoutes.CREATE);
      console.log('📡 Full URL will be:', `${API_BASE_URL}${roomRoutes.CREATE}`);

      const response = await api.post(roomRoutes.CREATE, payload);

      if (response.success) {
        console.log('✅ Room created successfully:', response);
        setToast({
          open: true,
          type: 'success',
          message: response.message || 'Room added successfully!',
        });
        
        // Reload architecture data
        await loadArchitectureData(Number(id));
        setIsAddRoomOpen(false);
      } else {
        throw new Error(response.message || 'Failed to create room');
      }
    } catch (error: any) {
      console.error('❌ Error creating room:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to add room. Please try again.',
      });
    }
  };

  const handleAddBlock = async () => {
    if (!id) return;
    // Reload architecture data after block is created
    await loadArchitectureData(Number(id));
  };

  // Handle adding a bed (seat) to a room via API
  const handleAddSeat = async (floorNumber: number, roomId: string) => {
    if (!architectureData || !hostel || !id) return;

    try {
      // Find the room in the architecture data
      const floor = architectureData.floors.find((f) => f.floorNumber === floorNumber);
      if (!floor) {
        throw new Error('Floor not found');
      }

      const room = floor.rooms.find((r) => r.id === roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Get existing beds for this room to determine next bed number
      const bedsResponse = await api.get(bedRoutes.BEDS_BY_ROOM(roomId));
      const existingBeds = bedsResponse.success && bedsResponse.data
        ? (Array.isArray(bedsResponse.data) ? bedsResponse.data : bedsResponse.data.items || [])
        : [];

      // Generate next bed number (S1, S2, S3, ... or use existing pattern)
      const existingBedNumbers = existingBeds.map((b: any) => b.bedNumber || b.number || '');
      let nextBedNumber = 'S1';
      let bedCounter = 1;
      
      while (existingBedNumbers.includes(nextBedNumber)) {
        bedCounter++;
        nextBedNumber = `S${bedCounter}`;
      }

      // Create bed via API
      const payload = {
        room: roomId,
        bedNumber: nextBedNumber,
        bedType: 'single',
      };

      const response = await api.post(bedRoutes.CREATE, payload);

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: `Bed ${nextBedNumber} added to Room ${room.roomNumber} successfully!`,
        });
        
        // Reload architecture data to reflect the new bed
        await loadArchitectureData(Number(id));
      } else {
        throw new Error(response.message || 'Failed to create bed');
      }
    } catch (error: any) {
      console.error('Error adding bed:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to add bed',
      });
    }
  };

  // Handle clicking on a room to create/add room
  const handleRoomClick = (floorNumber: number) => {
    // Find the floor to get its ID
    const floor = floors.find((f: any) => f.floorNumber === floorNumber);
    if (floor) {
      // Set the floor ID in the form and open the add room modal
      setIsAddRoomOpen(true);
      // The AddRoomForm will handle the floor selection
    } else {
      setToast({
        open: true,
        type: 'error',
        message: 'Floor not found. Please create the block first.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-[#2176FF] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-600">Loading hostel...</p>
        </div>
      </div>
    );
  }

  if (!hostel || !architectureData) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600">Hostel not found</p>
      </div>
    );
  }

  const tabs = [
    {
      id: 'details',
      label: 'Details',
    },
    {
      id: 'mess',
      label: 'Mess',
    },
    {
      id: 'arrangement',
      label: 'Arrangement',
    },
    {
      id: 'architecture',
      label: 'Architecture',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`${rolePrefix}/hostel`)}
            className="text-[#2176FF] hover:text-[#1966E6] mb-4 inline-flex items-center gap-2"
          >
            ← Back to Hostels
          </button>
          <h1 className="text-3xl font-bold text-slate-900">{hostel.name}</h1>
          <p className="text-slate-600 mt-1">Hostel Details & Architecture</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'arrangement' && (
            <Button
              variant="primary"
              onClick={() => setIsArrangeOpen(true)}
              icon={PlusIcon}
            >
              Arrange
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as 'details' | 'arrangement' | 'architecture' | 'mess')}
      />

      {/* Tab Content */}
      {activeTab === 'details' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
        >
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-[#2176FF]" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Hostel Name</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {hostel.name}
                </p>
              </div>
            </div>

            {/* City */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPinIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">City</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {hostel.city}
                </p>
              </div>
            </div>

            {/* Manager Name */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Manager</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {hostel.managerName}
                </p>
              </div>
            </div>

            {/* Manager Phone */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <PhoneIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Manager Phone
                </p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {hostel.managerPhone}
                </p>
              </div>
            </div>

            {/* Total Blocks */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Blocks</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {architectureData?.floors.length || hostel.totalFloors}
                </p>
              </div>
            </div>

            {/* Rooms per Block */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Rooms per Block
                </p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {hostel.roomsPerFloor}
                </p>
              </div>
            </div>

            {/* Category */}
            {hostel.category && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Category</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {hostel.category === 'home2' ? 'Second Home' : 
                     hostel.category === 'luxury' ? 'Hotel Botique' : 
                     hostel.category === 'back_pack' ? 'BackPacking' : 
                     hostel.category}
                  </p>
                </div>
              </div>
            )}

            {/* Type */}
            {hostel.type && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Type</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1 capitalize">
                    {hostel.type}
                  </p>
                </div>
              </div>
            )}

            {/* Mess Plan + Amenities (same row) */}
            <div className="md:col-span-2 flex flex-col md:flex-row items-start gap-18">
              {/* Mess Plan */}
              <div className="flex items-start gap-4 md:w-1/3">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Mess Plan</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {messMealPattern.label}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{messMealPattern.details}</p>
                </div>
              </div>

              {/* Amenities */}
              {hostel.amenities && hostel.amenities.length > 0 && (
                <div className="flex-1 flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <BuildingOfficeIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-600 font-medium">Amenities</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {hostel.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-600 font-medium">Total Rooms</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {architectureData.totalRooms}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-green-600 font-medium">
                  Available Seats
                </p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {architectureData.availableSeats}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-sm text-red-600 font-medium">
                  Occupied Seats
                </p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {architectureData.occupiedSeats}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-600 font-medium">Total Seats</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {architectureData.totalSeats}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Stats Cards */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Resources & Management
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Mess */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <BeakerIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-sm text-amber-600 font-medium">Total Mess</p>
                </div>
                <p className="text-2xl font-bold text-amber-900">
                  {messStats.totalMess}
                </p>
                <p className="text-xs text-amber-600 mt-1">Entries</p>
                {messStats.totalPrice > 0 && (
                  <p className="text-xs text-amber-600 mt-2">Total: ${messStats.totalPrice.toFixed(2)}</p>
                )}
              </div>

              {/* Total Vendors */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BuildingStorefrontIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-600 font-medium">Total Vendors</p>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {additionalStats.totalVendors}
                </p>
                <p className="text-xs text-purple-600 mt-1">Active</p>
              </div>

              {/* Total Employees */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <BriefcaseIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">Total Employees</p>
                </div>
                <p className="text-2xl font-bold text-emerald-900">
                  {additionalStats.totalEmployees}
                </p>
                <p className="text-xs text-emerald-600 mt-1">Staff</p>
              </div>

              {/* Total Tenants */}
              <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <UserGroupIcon className="w-5 h-5 text-cyan-600" />
                  </div>
                  <p className="text-sm text-cyan-600 font-medium">Total Tenants</p>
                </div>
                <p className="text-2xl font-bold text-cyan-900">
                  {additionalStats.totalTenants}
                </p>
                <p className="text-xs text-cyan-600 mt-1">Residents</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {hostel.notes && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Notes
              </h3>
              <p className="text-slate-700 leading-relaxed">{hostel.notes}</p>
            </div>
          )}
        </motion.div>
      )}


      {activeTab === 'arrangement' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Room & Bed Arrangement</h2>
            <p className="text-slate-600">View all rooms, beds, and tenant allocations in table format</p>
          </div>

          {bedsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading beds and tenant data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Block</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Bed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Tenant Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Lease Start</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Lease End</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Rent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {beds.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                        No beds found. Use the "Arrange" button to add blocks, rooms, and beds.
                      </td>
                    </tr>
                  ) : (
                    beds.map((bed: any) => {
                      const floor = floors.find((f: any) => f.id === bed.floorId);
                      const room = rooms.find((r: any) => r.id === bed.roomId);
                      const isOccupied = bed.status === 'occupied' && bed.currentTenant;
                      
                      return (
                        <tr key={bed.id} className={isOccupied ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {floor ? `Block ${floor.floorNumber}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {room ? `Room ${room.roomNumber}` : bed.roomNumber || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {bed.bedNumber || bed.number || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isOccupied 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {isOccupied ? 'Occupied' : 'Available'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {bed.currentTenant?.name || bed.tenantName || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {bed.leaseStartDate ? new Date(bed.leaseStartDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {bed.leaseEndDate ? new Date(bed.leaseEndDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            {bed.rent ? `$${bed.rent}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingBed({
                                    id: bed.id,
                                    floorId: bed.floorId,
                                    roomId: bed.roomId,
                                    bedNumber: bed.bedNumber || bed.number,
                                    tenantName: bed.currentTenant?.name || bed.tenantName,
                                  });
                                  setIsEditAllocationOpen(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit Allocation"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to delete this bed?')) {
                                    try {
                                      const response = await api.delete(bedRoutes.DELETE(bed.id));
                                      if (response.success) {
                                        setToast({
                                          open: true,
                                          type: 'success',
                                          message: 'Bed deleted successfully',
                                        });
                                        await loadBedsWithTenants(Number(id));
                                        await loadArchitectureData(Number(id));
                                      }
                                    } catch (error: any) {
                                      setToast({
                                        open: true,
                                        type: 'error',
                                        message: error.message || 'Failed to delete bed',
                                      });
                                    }
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete Bed"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'architecture' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tree Diagram - Vertical Layout */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Structure Tree Diagram</h2>
            
            {/* Tree Container - Vertical Layout */}
            <div className="relative py-6 overflow-y-auto max-h-[800px]">
              {/* Root Node - Hostel (Level 0) - Dark Gray */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-slate-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-3 border-white">
                    {hostel.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-slate-800 whitespace-nowrap">
                    {hostel.name}
                  </div>
                </div>
              </div>

              {/* Vertical Line from Root */}
              <div className="flex justify-center mb-2">
                <div className="w-0.5 h-6 bg-slate-400"></div>
              </div>

              {/* Level 1: Blocks (Teal) - Vertical Stack */}
              <div className="space-y-8">
                {architectureData.floors.map((floor) => (
                  <div key={floor.floorNumber} className="flex flex-col items-center">
                    {/* Block Node (Teal) */}
                    <div className="relative mb-3">
                      <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">
                        B{floor.floorNumber}
                      </div>
                      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-medium text-slate-700 whitespace-nowrap">
                        Block {floor.floorNumber}
                      </div>
                    </div>

                    {/* Vertical Line from Block */}
                    <div className="w-0.5 h-4 bg-slate-400 mb-2"></div>

                    {/* Level 2: Rooms (Purple) - Compact Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                      {floor.rooms.map((room) => (
                        <div key={room.id} className="flex flex-col items-center">
                          {/* Vertical Line from Block to Room */}
                          <div className="w-0.5 h-3 bg-slate-400 mb-1"></div>
                          
                          {/* Room Node (Purple) */}
                          <div className="relative mb-2">
                            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-[10px] shadow-sm border-2 border-white">
                              R{room.roomNumber}
                            </div>
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[9px] font-medium text-slate-700 whitespace-nowrap">
                              {room.totalSeats}
                            </div>
                          </div>

                          {/* Vertical Line from Room */}
                          <div className="w-0.5 h-2 bg-slate-400 mb-1"></div>

                          {/* Level 3: Seats (Light Green) - Show only count */}
                          <div className="flex items-center justify-center">
                            <div className={`px-2 py-1 rounded text-[10px] font-semibold ${
                              room.seats.filter(s => s.isOccupied).length > 0
                                ? 'bg-red-100 text-red-700 border border-red-300'
                                : 'bg-green-100 text-green-700 border border-green-300'
                            }`}>
                              {room.seats.filter(s => s.isOccupied).length}/{room.seats.length} Seats
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Separator between blocks */}
                    {floor.floorNumber < architectureData.floors.length && (
                      <div className="w-full h-0.5 bg-slate-200 my-4"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tree Summary */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{architectureData.floors.length}</p>
                  <p className="text-sm text-slate-600">Blocks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{architectureData.totalRooms}</p>
                  <p className="text-sm text-slate-600">Rooms</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{architectureData.availableSeats}</p>
                  <p className="text-sm text-slate-600">Available Seats</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{architectureData.occupiedSeats}</p>
                  <p className="text-sm text-slate-600">Occupied Seats</p>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Architecture Diagram */}
          <ArchitectureDiagram 
            data={architectureData} 
            onAddSeat={handleAddSeat}
            onRoomClick={handleRoomClick}
          />
        </motion.div>
      )}

      {/* Mess Tab */}
      {activeTab === 'mess' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessManagement hostelId={Number(hostel.id)} />
        </motion.div>
      )}

      {/* Arrange Form Modal */}
      <ArrangeForm
        isOpen={isArrangeOpen}
        onClose={() => setIsArrangeOpen(false)}
        hostelId={Number(id || hostel.id)}
        onSuccess={() => {
          loadArchitectureData(Number(id || hostel.id));
          loadBedsWithTenants(Number(id || hostel.id));
        }}
      />

      {/* Add Block Modal */}
      <AddBlockForm
        isOpen={isAddBlockOpen}
        onClose={() => setIsAddBlockOpen(false)}
        hostelId={Number(id || hostel.id)}
        onSubmit={handleAddBlock}
      />

      {/* Add Room Modal */}
      <AddRoomForm
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        hostelId={Number(id || hostel.id)}
        maxFloors={architectureData?.floors.length || hostel.totalFloors}
        floors={floors}
        onSubmit={handleAddRoom}
      />

      {/* Edit Allocation Modal */}
      {editingBed && (
        <EditAllocationModal
          isOpen={isEditAllocationOpen}
          onClose={() => {
            setIsEditAllocationOpen(false);
            setEditingBed(null);
          }}
          bedId={editingBed.id}
          currentAllocation={{
            floorId: editingBed.floorId,
            roomId: editingBed.roomId,
            bedNumber: editingBed.bedNumber,
            tenantName: editingBed.tenantName,
          }}
          hostelId={Number(id || hostel.id)}
          onSuccess={async () => {
            setToast({
              open: true,
              type: 'success',
              message: 'Bed allocation updated successfully',
            });
            await loadBedsWithTenants(Number(id));
            await loadArchitectureData(Number(id));
          }}
        />
      )}

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default HostelView;

