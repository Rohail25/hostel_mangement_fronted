/**
 * Edit Allocation Modal
 * Allows changing room and bed assignment for a tenant
 */

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { api } from '../../services/apiClient';
import { API_ROUTES } from '../../services/api.config';

interface EditAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bedId: number;
  currentAllocation: {
    floorId: number;
    roomId: number;
    bedNumber: string;
    tenantName?: string;
  };
  hostelId: number;
  onSuccess: () => void;
}

export const EditAllocationModal: React.FC<EditAllocationModalProps> = ({
  isOpen,
  onClose,
  bedId,
  currentAllocation,
  hostelId,
  onSuccess,
}) => {
  const [floors, setFloors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<number>(currentAllocation.floorId);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(currentAllocation.roomId);
  const [selectedBedId, setSelectedBedId] = useState<number>(bedId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && hostelId) {
      loadFloors();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update bed assignment via allocation API
      const response = await api.put(API_ROUTES.ALLOCATION.UPDATE_BED(bedId), {
        newBedId: selectedBedId,
      });

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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Floor
          </label>
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Room
          </label>
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Bed
          </label>
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

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !selectedBedId}>
            {loading ? 'Updating...' : 'Update Allocation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
