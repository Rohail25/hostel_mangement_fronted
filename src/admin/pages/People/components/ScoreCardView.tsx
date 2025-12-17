/**
 * ScoreCardView Component
 * Displays current score and score history for tenants/employees
 */

import React from 'react';
import { Button } from '../../../components/Button';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/outline';

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
                key={`${record.date}-${index}`}
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

export default ScoreCardView;




















