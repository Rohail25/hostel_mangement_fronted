import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Select } from './Select';
import { api } from '../../services/apiClient';
import { API_ROUTES } from '../../services/api.config';
import { useAuth } from '../context/AuthContext';

interface AddBlockFormProps {
  isOpen: boolean;
  onClose: () => void;
  hostelId: number;
  onSubmit: () => void; // Callback to refresh data
}

interface Floor {
  id: number;
  floorNumber: number;
  floorName: string;
}

export const AddBlockForm: React.FC<AddBlockFormProps> = ({
  isOpen,
  onClose,
  hostelId,
  onSubmit,
}) => {
  const { user } = useAuth();
  const isOwner = user?.roleType === 'owner';
  const floorRoutes = isOwner ? API_ROUTES.OWNER.FLOOR : API_ROUTES.FLOOR;
  const [formData, setFormData] = useState({
    floorNumber: '',
    floorName: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFloors, setExistingFloors] = useState<Floor[]>([]);
  const [loadingFloors, setLoadingFloors] = useState(false);

  // Load existing floors to determine next floor number
  useEffect(() => {
    if (isOpen && hostelId) {
      loadExistingFloors();
    }
  }, [isOpen, hostelId]);

  const loadExistingFloors = async () => {
    try {
      setLoadingFloors(true);
      const response = await api.get(floorRoutes.BY_HOSTEL(hostelId));
      if (response.success && response.data) {
        const floors = Array.isArray(response.data) ? response.data : response.data.items || [];
        setExistingFloors(floors);
        
        // Auto-suggest next floor number
        if (floors.length > 0) {
          const maxFloorNumber = Math.max(...floors.map((f: Floor) => f.floorNumber));
          setFormData(prev => ({
            ...prev,
            floorNumber: String(maxFloorNumber + 1),
            floorName: `Block ${maxFloorNumber + 1}`,
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            floorNumber: '1',
            floorName: 'Block 1',
          }));
        }
      }
    } catch (error) {
      console.error('Error loading floors:', error);
    } finally {
      setLoadingFloors(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.floorNumber || formData.floorNumber.trim() === '') {
      newErrors.floorNumber = 'Block number is required';
    } else {
      const floorNum = parseInt(formData.floorNumber);
      if (isNaN(floorNum) || floorNum < 1) {
        newErrors.floorNumber = 'Block number must be a positive number';
      } else if (existingFloors.some(f => f.floorNumber === floorNum)) {
        newErrors.floorNumber = 'Block number already exists';
      }
    }

    if (!formData.floorName || formData.floorName.trim() === '') {
      newErrors.floorName = 'Block name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        hostel: hostelId,
        hostelId,
        floorNumber: parseInt(formData.floorNumber),
        floorName: formData.floorName.trim(),
        description: formData.description.trim() || undefined,
      };

      console.log('📡 Creating block (floor):', payload);

      const response = await api.post(floorRoutes.CREATE, payload);

      if (response.success) {
        console.log('✅ Block created successfully:', response);
        // Reset form
        setFormData({
          floorNumber: '',
          floorName: '',
          description: '',
        });
        setErrors({});
        onSubmit(); // Refresh parent data
        onClose();
      } else {
        throw new Error(response.message || 'Failed to create block');
      }
    } catch (error: any) {
      console.error('❌ Error creating block:', error);
      setErrors({
        submit: error.message || 'Failed to create block. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      floorNumber: '',
      floorName: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Block"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Block Number * <span className="text-xs text-slate-500">(Displayed as "Block" in UI, stored as "Floor" in backend)</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.floorNumber}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({ 
                ...formData, 
                floorNumber: value,
                floorName: value ? `Block ${value}` : '',
              });
            }}
            className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
            placeholder="1"
            disabled={loadingFloors}
          />
          {errors.floorNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.floorNumber}</p>
          )}
          {loadingFloors && (
            <p className="mt-1 text-xs text-slate-500">Loading existing blocks...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Block Name *
          </label>
          <input
            type="text"
            value={formData.floorName}
            onChange={(e) =>
              setFormData({ ...formData, floorName: e.target.value })
            }
            placeholder="Block 1"
            className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
          />
          {errors.floorName && (
            <p className="mt-1 text-sm text-red-600">{errors.floorName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            placeholder="Add description for this block..."
            className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSubmitting || loadingFloors}
          >
            {isSubmitting ? 'Creating...' : 'Add Block'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};





