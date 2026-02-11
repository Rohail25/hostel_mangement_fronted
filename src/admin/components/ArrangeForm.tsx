import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOfficeIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Toast } from './Toast';
import { api } from '../../services/apiClient';
import { API_ROUTES } from '../../services/api.config';
import { useAuth } from '../context/AuthContext';

interface ArrangeFormProps {
  isOpen: boolean;
  onClose: () => void;
  hostelId: number;
  onSuccess?: () => void;
}

interface Block {
  id: number;
  floorNumber: number;
}

interface Room {
  id: number;
  roomNumber: string;
  floorId: number;
  totalBeds: number;
}

interface Bed {
  id: number;
  bedNumber: string;
  roomId: number;
  status: string;
}

export const ArrangeForm: React.FC<ArrangeFormProps> = ({
  isOpen,
  onClose,
  hostelId,
  onSuccess,
}) => {
  const { user } = useAuth();
  const isOwner = user?.roleType === 'owner';
  const floorRoutes = isOwner ? API_ROUTES.OWNER.FLOOR : API_ROUTES.FLOOR;
  const roomRoutes = isOwner ? API_ROUTES.OWNER.ROOM : API_ROUTES.ROOM;
  const bedRoutes = isOwner ? API_ROUTES.OWNER.BED : API_ROUTES.BED;
  const [activeTab, setActiveTab] = useState<'block' | 'room' | 'seats'>('block');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ open: false, type: 'success', message: '' });

  // Form states
  const [blockForm, setBlockForm] = useState({ floorNumber: '' });
  const [roomForm, setRoomForm] = useState({ floorId: '', roomNumber: '', totalBeds: '' });
  const [bedForm, setBedForm] = useState({ roomId: '', bedNumber: '' });

  // Editing states
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);

  useEffect(() => {
    if (isOpen && hostelId) {
      loadData();
    }
  }, [isOpen, hostelId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load blocks (floors)
      const floorsResponse = await api.get(floorRoutes.BY_HOSTEL(hostelId));
      const floorsData = floorsResponse.success && floorsResponse.data
        ? (Array.isArray(floorsResponse.data) ? floorsResponse.data : floorsResponse.data.items || [])
        : [];
      setBlocks(floorsData);

      // Load rooms
      const roomsResponse = await api.get(roomRoutes.BY_HOSTEL(hostelId));
      const roomsData = roomsResponse.success && roomsResponse.data
        ? (Array.isArray(roomsResponse.data) ? roomsResponse.data : roomsResponse.data.items || [])
        : [];
      setRooms(roomsData);

      // Load beds for all rooms
      const allBeds: Bed[] = [];
      for (const room of roomsData) {
        try {
          const bedsResponse = await api.get(bedRoutes.BEDS_BY_ROOM(room.id));
          if (bedsResponse.success && bedsResponse.data) {
            const roomBeds = Array.isArray(bedsResponse.data) ? bedsResponse.data : bedsResponse.data.items || [];
            allBeds.push(...roomBeds);
          }
        } catch (err) {
          console.error(`Error loading beds for room ${room.id}:`, err);
        }
      }
      setBeds(allBeds);
    } catch (error: any) {
      console.error('Error loading data:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to load data',
      });
    } finally {
      setLoading(false);
    }
  };

  // Block handlers
  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!blockForm.floorNumber.trim()) {
        setToast({
          open: true,
          type: 'warning',
          message: 'Please enter a block number',
        });
        return;
      }

      const floorNumberValue = parseInt(blockForm.floorNumber, 10);
      if (!Number.isFinite(floorNumberValue) || floorNumberValue < 1) {
        setToast({
          open: true,
          type: 'warning',
          message: 'Block number must be a positive number',
        });
        return;
      }

      const response = await api.post(floorRoutes.CREATE, {
        hostel: hostelId,
        hostelId,
        floorNumber: floorNumberValue,
        floorName: `Block ${floorNumberValue}`,
      });

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Block added successfully',
        });
        setBlockForm({ floorNumber: '' });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to add block',
      });
    }
  };

  const handleEditBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;

    try {
      if (!blockForm.floorNumber.trim()) {
        setToast({
          open: true,
          type: 'warning',
          message: 'Please enter a block number',
        });
        return;
      }

      const floorNumberValue = parseInt(blockForm.floorNumber, 10);
      if (!Number.isFinite(floorNumberValue) || floorNumberValue < 1) {
        setToast({
          open: true,
          type: 'warning',
          message: 'Block number must be a positive number',
        });
        return;
      }

      const response = await api.put(floorRoutes.UPDATE(editingBlock.id), {
        floorNumber: floorNumberValue,
        floorName: `Block ${floorNumberValue}`,
      });

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Block updated successfully',
        });
        setEditingBlock(null);
        setBlockForm({ floorNumber: '' });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to update block',
      });
    }
  };

  const handleDeleteBlock = async (blockId: number) => {
    if (!window.confirm('Are you sure you want to delete this block? This will also delete all rooms and beds in this block.')) {
      return;
    }

    try {
      const response = await api.delete(floorRoutes.DELETE(blockId));
      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Block deleted successfully',
        });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete block',
      });
    }
  };

  // Room handlers
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!roomForm.floorId || !roomForm.roomNumber) {
        setToast({
          open: true,
          type: 'warning',
          message: 'Please fill all required fields',
        });
        return;
      }

      const response = await api.post(roomRoutes.CREATE, {
        hostel: hostelId,
        hostelId,
        floor: parseInt(roomForm.floorId),
        floorId: parseInt(roomForm.floorId),
        roomNumber: roomForm.roomNumber.trim(),
        roomType: 'single',
        totalBeds: parseInt(roomForm.totalBeds) || 1,
        pricePerBed: 0,
      });

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Room added successfully',
        });
        setRoomForm({ floorId: '', roomNumber: '', totalBeds: '' });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to add room',
      });
    }
  };

  const handleEditRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      const response = await api.put(roomRoutes.UPDATE(editingRoom.id), {
        roomNumber: roomForm.roomNumber.trim(),
        totalBeds: parseInt(roomForm.totalBeds) || editingRoom.totalBeds,
      });

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Room updated successfully',
        });
        setEditingRoom(null);
        setRoomForm({ floorId: '', roomNumber: '', totalBeds: '' });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to update room',
      });
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!window.confirm('Are you sure you want to delete this room? This will also delete all beds in this room.')) {
      return;
    }

    try {
      const response = await api.delete(roomRoutes.DELETE(roomId));
      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Room deleted successfully',
        });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete room',
      });
    }
  };

  // Bed handlers
  const handleAddBed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!bedForm.roomId || !bedForm.bedNumber) {
        setToast({
          open: true,
          type: 'warning',
          message: 'Please fill all required fields',
        });
        return;
      }

      const response = await api.post(bedRoutes.CREATE, {
        room: parseInt(bedForm.roomId),
        bedNumber: bedForm.bedNumber.trim(),
        bedType: 'single',
        status: 'available',
      });

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Bed added successfully',
        });
        setBedForm({ roomId: '', bedNumber: '' });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to add bed',
      });
    }
  };

  const handleEditBed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBed) return;

    try {
      const response = await api.put(bedRoutes.UPDATE(editingBed.id), {
        bedNumber: bedForm.bedNumber.trim(),
      });

      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Bed updated successfully',
        });
        setEditingBed(null);
        setBedForm({ roomId: '', bedNumber: '' });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to update bed',
      });
    }
  };

  const handleDeleteBed = async (bedId: number) => {
    if (!window.confirm('Are you sure you want to delete this bed?')) {
      return;
    }

    try {
      const response = await api.delete(bedRoutes.DELETE(bedId));
      if (response.success) {
        setToast({
          open: true,
          type: 'success',
          message: 'Bed deleted successfully',
        });
        await loadData();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to delete bed',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-64 bg-slate-800 flex flex-col">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  <h2 className="text-lg font-semibold text-white">Arrange</h2>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('block')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'block'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span className="font-medium">Block</span>
                </button>
                <button
                  onClick={() => setActiveTab('room')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'room'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span className="font-medium">Room</span>
                </button>
                <button
                  onClick={() => setActiveTab('seats')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'seats'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span className="font-medium">Seats</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {activeTab === 'block' && 'BLOCK MANAGEMENT'}
                    {activeTab === 'room' && 'ROOM MANAGEMENT'}
                    {activeTab === 'seats' && 'SEATS (BEDS) MANAGEMENT'}
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

              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading...</p>
                  </div>
                ) : (
                  <>
                    {/* Block Tab */}
                    {activeTab === 'block' && (
                      <div className="space-y-6">
                        <form onSubmit={editingBlock ? handleEditBlock : handleAddBlock} className="bg-white p-6 rounded-lg border border-slate-200">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">
                            {editingBlock ? 'Edit Block' : 'Add New Block'}
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Block Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={blockForm.floorNumber}
                                onChange={(e) => setBlockForm({ floorNumber: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter block number (e.g., 1)"
                                required
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button type="submit" variant="primary">
                                {editingBlock ? 'Update Block' : 'Add Block'}
                              </Button>
                              {editingBlock && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => {
                                    setEditingBlock(null);
                                    setBlockForm({ floorNumber: '' });
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </form>

                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <div className="p-4 border-b border-slate-200">
                            <h4 className="text-lg font-semibold text-slate-900">Existing Blocks</h4>
                          </div>
                          <div className="divide-y divide-slate-200">
                            {blocks.length === 0 ? (
                              <div className="p-8 text-center text-slate-500">No blocks found</div>
                            ) : (
                              blocks.map((block) => (
                                <div key={block.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                  <span className="font-medium text-slate-900">Block {block.floorNumber}</span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingBlock(block);
                                        setBlockForm({ floorNumber: String(block.floorNumber) });
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteBlock(block.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Room Tab */}
                    {activeTab === 'room' && (
                      <div className="space-y-6">
                        <form onSubmit={editingRoom ? handleEditRoom : handleAddRoom} className="bg-white p-6 rounded-lg border border-slate-200">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">
                            {editingRoom ? 'Edit Room' : 'Add New Room'}
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Block (Floor) <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={roomForm.floorId}
                                onChange={(e) => setRoomForm({ ...roomForm, floorId: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={!!editingRoom}
                              >
                                <option value="">Select Block</option>
                                {blocks.map((block) => (
                                  <option key={block.id} value={block.id}>
                                    Block {block.floorNumber}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Room Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={roomForm.roomNumber}
                                onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Total Beds
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={roomForm.totalBeds}
                                onChange={(e) => setRoomForm({ ...roomForm, totalBeds: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button type="submit" variant="primary">
                                {editingRoom ? 'Update Room' : 'Add Room'}
                              </Button>
                              {editingRoom && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => {
                                    setEditingRoom(null);
                                    setRoomForm({ floorId: '', roomNumber: '', totalBeds: '' });
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </form>

                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <div className="p-4 border-b border-slate-200">
                            <h4 className="text-lg font-semibold text-slate-900">Existing Rooms</h4>
                          </div>
                          <div className="divide-y divide-slate-200">
                            {rooms.length === 0 ? (
                              <div className="p-8 text-center text-slate-500">No rooms found</div>
                            ) : (
                              rooms.map((room) => {
                                const block = blocks.find((b) => b.id === room.floorId);
                                return (
                                  <div key={room.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div>
                                      <span className="font-medium text-slate-900">Room {room.roomNumber}</span>
                                      <span className="text-sm text-slate-500 ml-2">
                                        (Block {block?.floorNumber || 'N/A'}, {room.totalBeds} beds)
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingRoom(room);
                                          setRoomForm({
                                            floorId: String(room.floorId),
                                            roomNumber: room.roomNumber,
                                            totalBeds: String(room.totalBeds),
                                          });
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                      >
                                        <PencilIcon className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Seats (Beds) Tab */}
                    {activeTab === 'seats' && (
                      <div className="space-y-6">
                        <form onSubmit={editingBed ? handleEditBed : handleAddBed} className="bg-white p-6 rounded-lg border border-slate-200">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">
                            {editingBed ? 'Edit Bed' : 'Add New Bed (Seat)'}
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Room <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={bedForm.roomId}
                                onChange={(e) => setBedForm({ ...bedForm, roomId: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={!!editingBed}
                              >
                                <option value="">Select Room</option>
                                {rooms.map((room) => {
                                  const block = blocks.find((b) => b.id === room.floorId);
                                  return (
                                    <option key={room.id} value={room.id}>
                                      Block {block?.floorNumber || 'N/A'} - Room {room.roomNumber}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Bed Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={bedForm.bedNumber}
                                onChange={(e) => setBedForm({ ...bedForm, bedNumber: e.target.value })}
                                placeholder="A, B, C, 1, 2, 3, etc."
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button type="submit" variant="primary">
                                {editingBed ? 'Update Bed' : 'Add Bed'}
                              </Button>
                              {editingBed && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => {
                                    setEditingBed(null);
                                    setBedForm({ roomId: '', bedNumber: '' });
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </form>

                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <div className="p-4 border-b border-slate-200">
                            <h4 className="text-lg font-semibold text-slate-900">Existing Beds (Seats)</h4>
                          </div>
                          <div className="divide-y divide-slate-200">
                            {beds.length === 0 ? (
                              <div className="p-8 text-center text-slate-500">No beds found</div>
                            ) : (
                              beds.map((bed) => {
                                const room = rooms.find((r) => r.id === bed.roomId);
                                const block = room ? blocks.find((b) => b.id === room.floorId) : null;
                                return (
                                  <div key={bed.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div>
                                      <span className="font-medium text-slate-900">Bed {bed.bedNumber}</span>
                                      <span className="text-sm text-slate-500 ml-2">
                                        (Block {block?.floorNumber || 'N/A'} - Room {room?.roomNumber || 'N/A'})
                                      </span>
                                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                        bed.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                      }`}>
                                        {bed.status}
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingBed(bed);
                                          setBedForm({
                                            roomId: String(bed.roomId),
                                            bedNumber: bed.bedNumber,
                                          });
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                      >
                                        <PencilIcon className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteBed(bed.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </>

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </AnimatePresence>
  );
};
