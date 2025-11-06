import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { RoomFormData } from '../types/hostel';

interface AddRoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  hostelId: number;
  maxFloors: number;
  onSubmit: (data: RoomFormData) => void;
}

export const AddRoomForm: React.FC<AddRoomFormProps> = ({
  isOpen,
  onClose,
  hostelId: _hostelId,
  maxFloors,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<RoomFormData>({
    floorNumber: 1,
    roomNumber: '',
    totalSeats: 4,
    pricePerSeat: undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RoomFormData, string>> = {};

    if (!formData.roomNumber || formData.roomNumber.trim() === '') {
      newErrors.roomNumber = 'Room number is required';
    }

    if (formData.floorNumber < 1 || formData.floorNumber > maxFloors) {
      newErrors.floorNumber = `Floor must be between 1 and ${maxFloors}`;
    }

    if (formData.totalSeats < 1 || formData.totalSeats > 8) {
      newErrors.totalSeats = 'Total seats must be between 1 and 8';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        floorNumber: 1,
        roomNumber: '',
        totalSeats: 4,
        pricePerSeat: undefined,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Room"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Floor Number *
            </label>
            <input
              type="number"
              min="1"
              max={maxFloors}
              value={formData.floorNumber}
              onChange={(e) =>
                setFormData({ ...formData, floorNumber: parseInt(e.target.value) || 1 })
              }
              className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
            />
            {errors.floorNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.floorNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Room Number *
            </label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) =>
                setFormData({ ...formData, roomNumber: e.target.value })
              }
              placeholder="01, 02, 03..."
              className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
            />
            {errors.roomNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total Seats *
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 1 })
              }
              className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
            />
            {errors.totalSeats && (
              <p className="mt-1 text-sm text-red-600">{errors.totalSeats}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price per Seat (Optional)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerSeat || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricePerSeat: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="0.00"
              className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            Add Room
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

