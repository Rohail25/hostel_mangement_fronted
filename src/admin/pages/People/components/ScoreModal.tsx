/**
 * ScoreModal Component
 * Modal for updating tenant/employee scores
 */

import React from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/outline';

interface ScoreFormData {
  behavior: number;
  punctuality: number;
  cleanliness: number;
  remarks: string;
}

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  scoreForm: ScoreFormData;
  onScoreFormChange: (updates: Partial<ScoreFormData>) => void;
  currentScoreEntity: { type: 'Tenant' | 'Employee'; id: number; name: string } | null;
  calculateAverage: () => string;
}

const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  scoreForm,
  onScoreFormChange,
  currentScoreEntity,
  calculateAverage,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${currentScoreEntity ? `Update Score - ${currentScoreEntity.name}` : 'Update Score'}`}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
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
              onChange={(e) => onScoreFormChange({ behavior: Number(e.target.value) })}
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
              onChange={(e) => onScoreFormChange({ punctuality: Number(e.target.value) })}
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
              onChange={(e) => onScoreFormChange({ cleanliness: Number(e.target.value) })}
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
            onChange={(e) => onScoreFormChange({ remarks: e.target.value })}
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
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={TrophyIcon}>
            Save Score
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScoreModal;




















