/**
 * EmptyState component
 * Displays when no data is available
 */

import React from 'react';

interface EmptyStateProps {
  /** Icon to display (emoji or component) */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Call-to-action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Empty state component for no data scenarios
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 text-center max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

