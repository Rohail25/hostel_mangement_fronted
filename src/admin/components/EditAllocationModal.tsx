/**
 * Edit Allocation Modal
 * Allows changing room and bed assignment for a tenant
 */

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { api } from '../../services/apiClient';
import { API_ROUTES } from '../../services/api.config';
import * as hostelService from '../services/hostel.service';
import { useAuth } from '../context/AuthContext';

interface EditAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocationId: number;
  bedId: number;
  currentAllocation: {
    hostelId: number;
    floorId: number;
    roomId: number;
    bedNumber: string;
    tenantId?: number;
    tenantName?: string;
    rent?: number;
  };
  hostelId: number;
  onSuccess: () => void;
}

export const EditAllocationModal: React.FC<EditAllocationModalProps> = ({
  isOpen,
  onClose,
  allocationId,
  bedId,
  currentAllocation,
  hostelId,
  onSuccess,
}) => {
  const { user } = useAuth();
  const isOwner = user?.roleType === 'owner';
  const allocationRoutes = isOwner
    ? API_ROUTES.OWNER.ALLOCATION
    : {
        CREATE: '/admin/allocation',
        UPDATE_BED: (id: string | number) => `/admin/allocation/bed/${id}`,
        CHECKOUT: (id: string | number) => `/admin/allocations/${id}/checkout`,
        TRANSFER: (id: string | number) => `/admin/allocations/${id}/transfer`,
      };
  const [floors, setFloors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [hostels, setHostels] = useState<any[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<number>(currentAllocation.floorId);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(currentAllocation.roomId);
  const [selectedBedId, setSelectedBedId] = useState<number>(bedId);
  const [selectedAction, setSelectedAction] = useState<'move' | 'vacate' | 'transfer'>('move');
  const [targetHostelId, setTargetHostelId] = useState<number | ''>('');
  const [transferFloors, setTransferFloors] = useState<any[]>([]);
  const [transferRooms, setTransferRooms] = useState<any[]>([]);
  const [transferBeds, setTransferBeds] = useState<any[]>([]);
  const [targetFloorId, setTargetFloorId] = useState<number | ''>('');
  const [targetRoomId, setTargetRoomId] = useState<number | ''>('');
  const [targetBedId, setTargetBedId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && hostelId) {
      loadFloors();
      loadHostels();
    }
  }, [isOpen, hostelId]);

  useEffect(() => {
    if (selectedFloorId) {
      loadRooms(selectedFloorId);
    }
  }, [selectedFloorId]);

  useEffect(() => {
    if (selectedRoomId) {
      loadBeds(selectedRoomId);
    }
  }, [selectedRoomId]);

  useEffect(() => {
    if (selectedAction === 'transfer' && targetHostelId) {
      loadTransferHostelData(Number(targetHostelId));
    }
  }, [selectedAction, targetHostelId]);

  useEffect(() => {
    if (targetFloorId) {
      loadTransferRooms(Number(targetFloorId));
    }
  }, [targetFloorId]);

  useEffect(() => {
    if (targetRoomId) {
      loadTransferBeds(Number(targetRoomId));
    }
  }, [targetRoomId]);

  const loadFloors = async () => {
    try {
      const response = await api.get(API_ROUTES.FLOOR.BY_HOSTEL(hostelId));
      if (response.success && response.data) {
        setFloors(response.data);
      }
    } catch (err) {
      console.error('Error loading floors:', err);
    }
  };

  const loadHostels = async () => {
    try {
      const items = await hostelService.getAllHostelsFromAPI();
      setHostels(items.filter((item) => Number(item.id) !== Number(hostelId)));
    } catch (err) {
      console.error('Error loading hostels:', err);
      setHostels([]);
    }
  };

  const loadRooms = async (floorId: number) => {
    try {
      const response = await api.get(API_ROUTES.ROOM.BY_FLOOR(floorId));
      if (response.success && response.data) {
        setRooms(response.data);
      }
    } catch (err) {
      console.error('Error loading rooms:', err);
      setRooms([]);
    }
  };

  const loadBeds = async (roomId: number) => {
    try {
      const response = await api.get(API_ROUTES.BED.BEDS_BY_ROOM(roomId));
      if (response.success && response.data) {
        // Filter to show only available beds or the current bed
        const availableBeds = response.data.filter(
          (bed: any) => bed.status === 'available' || bed.id === bedId
        );
        setBeds(availableBeds);
      }
    } catch (err) {
      console.error('Error loading beds:', err);
      setBeds([]);
    }
  };

  const loadTransferHostelData = async (nextHostelId: number) => {
    try {
      const floorsResponse = await api.get(API_ROUTES.FLOOR.BY_HOSTEL(nextHostelId));
      setTransferFloors(
        floorsResponse.success && floorsResponse.data
          ? (Array.isArray(floorsResponse.data) ? floorsResponse.data : floorsResponse.data.items || [])
          : []
      );
      setTargetFloorId('');
      setTargetRoomId('');
      setTargetBedId('');
      setTransferRooms([]);
      setTransferBeds([]);
    } catch (err) {
      console.error('Error loading transfer hostel floors:', err);
      setTransferFloors([]);
    }
  };

  const loadTransferRooms = async (floorId: number) => {
    try {
      const response = await api.get(API_ROUTES.ROOM.BY_FLOOR(floorId));
      setTransferRooms(
        response.success && response.data
          ? (Array.isArray(response.data) ? response.data : response.data.items || [])
          : []
      );
      setTargetRoomId('');
      setTargetBedId('');
      setTransferBeds([]);
    } catch (err) {
      console.error('Error loading transfer rooms:', err);
      setTransferRooms([]);
    }
  };

  const loadTransferBeds = async (roomId: number) => {
    try {
      const response = await api.get(API_ROUTES.BED.BEDS_BY_ROOM(roomId));
      if (response.success && response.data) {
        const availableBeds = (Array.isArray(response.data) ? response.data : response.data.items || []).filter(
          (bed: any) => bed.status === 'available'
        );
        setTransferBeds(availableBeds);
      } else {
        setTransferBeds([]);
      }
    } catch (err) {
      console.error('Error loading transfer beds:', err);
      setTransferBeds([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (selectedAction === 'vacate') {
        response = await api.post(allocationRoutes.CHECKOUT(allocationId), {
          notes: 'Marked inactive from arrangement management',
        });
      } else if (selectedAction === 'transfer') {
        if (!targetHostelId || !targetFloorId || !targetRoomId || !targetBedId) {
          throw new Error('Please select target hostel, floor, room, and bed');
        }
        if (!currentAllocation.tenantId) {
          throw new Error('Tenant information is missing for this allocation');
        }

        response = await api.post(allocationRoutes.CHECKOUT(allocationId), {
          notes: 'Transfer initiated before cross-hostel move',
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to vacate current allocation');
        }

        const allocateResponse = await api.post(allocationRoutes.CREATE, {
          hostel: Number(targetHostelId),
          floor: Number(targetFloorId),
          room: Number(targetRoomId),
          bed: Number(targetBedId),
          tenant: currentAllocation.tenantId,
          checkInDate: new Date().toISOString(),
          rentAmount: currentAllocation.rent || 1,
          depositAmount: 0,
          notes: `Transferred from hostel ${hostelId}`,
        });

        if (!allocateResponse.success) {
          throw new Error(allocateResponse.message || 'Failed to create allocation in target hostel');
        }

        onSuccess();
        onClose();
        return;
      } else {
        response = await api.put(allocationRoutes.UPDATE_BED(bedId), {
          newBedId: selectedBedId,
        });
      }

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to update allocation');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update allocation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Bed Allocation">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Current Assignment:</strong> Floor {currentAllocation.floorId}, Room{' '}
            {currentAllocation.roomId}, Bed {currentAllocation.bedNumber}
            {currentAllocation.tenantName && (
              <> - Tenant: {currentAllocation.tenantName}</>
            )}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Action</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value as 'move' | 'vacate' | 'transfer')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="move">Change room / seat allocation</option>
            <option value="vacate">Make tenant inactive</option>
            <option value="transfer">Transfer to other hostel</option>
          </select>
        </div>

        {selectedAction === 'vacate' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
            This will mark the tenant inactive and free the seat.
          </div>
        )}

        {selectedAction === 'move' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Floor</label>
              <select
                value={selectedFloorId}
                onChange={(e) => {
                  setSelectedFloorId(Number(e.target.value));
                  setSelectedRoomId(0);
                  setSelectedBedId(0);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a floor</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    Floor {floor.floorNumber} - {floor.floorName || `Block ${floor.floorNumber}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Room</label>
              <select
                value={selectedRoomId}
                onChange={(e) => {
                  setSelectedRoomId(Number(e.target.value));
                  setSelectedBedId(0);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!selectedFloorId}
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber} ({room.totalSeats} seats, {room.availableSeats} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Bed</label>
              <select
                value={selectedBedId}
                onChange={(e) => setSelectedBedId(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!selectedRoomId}
              >
                <option value="">Select a bed</option>
                {beds.map((bed) => (
                  <option key={bed.id} value={bed.id}>
                    Bed {bed.bedNumber} {bed.id === bedId && '(Current)'}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {selectedAction === 'transfer' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Hostel</label>
              <select
                value={targetHostelId}
                onChange={(e) => setTargetHostelId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a hostel</option>
                {hostels.map((hostelItem) => (
                  <option key={hostelItem.id} value={hostelItem.id}>
                    {hostelItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Floor</label>
              <select
                value={targetFloorId}
                onChange={(e) => setTargetFloorId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!targetHostelId}
                required
              >
                <option value="">Select a floor</option>
                {transferFloors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    Floor {floor.floorNumber} - {floor.floorName || `Block ${floor.floorNumber}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Room</label>
              <select
                value={targetRoomId}
                onChange={(e) => setTargetRoomId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!targetFloorId}
                required
              >
                <option value="">Select a room</option>
                {transferRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Bed</label>
              <select
                value={targetBedId}
                onChange={(e) => setTargetBedId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!targetRoomId}
                required
              >
                <option value="">Select a bed</option>
                {transferBeds.map((bed) => (
                  <option key={bed.id} value={bed.id}>
                    Bed {bed.bedNumber}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={
              loading ||
              (selectedAction === 'move' && !selectedBedId) ||
              (selectedAction === 'transfer' && (!targetHostelId || !targetFloorId || !targetRoomId || !targetBedId))
            }
          >
            {loading ? 'Updating...' : selectedAction === 'vacate' ? 'Mark Inactive' : selectedAction === 'transfer' ? 'Transfer Tenant' : 'Update Allocation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
