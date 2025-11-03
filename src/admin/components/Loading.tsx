/**
 * Loading component
 * Displays loading states with skeleton or spinner
 */

import React from 'react';

interface LoadingProps {
  /** Loading variant */
  variant?: 'spinner' | 'skeleton';
  /** Size for spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Number of skeleton rows */
  rows?: number;
  /** Custom message */
  message?: string;
}

/**
 * Loading component for various loading states
 */
export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  rows = 5,
  message,
}) => {
  if (variant === 'skeleton') {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton h-12 rounded-lg bg-slate-200" />
        ))}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} border-brand-200 border-t-brand-600 rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-sm text-slate-600">{message}</p>
      )}
    </div>
  );
};

