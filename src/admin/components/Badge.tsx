/**
 * Badge component - Modern Glassy Badges
 * Beautiful status indicators with glass morphism
 */

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface BadgeProps {
  /** Badge text */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modern glassy badge component for status indicators
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  const variantClasses = {
    default: 'bg-slate-100/80 text-slate-700 border-slate-200/50',
    success: 'bg-green-100/80 text-green-700 border-green-200/50',
    warning: 'bg-amber-100/80 text-amber-700 border-amber-200/50',
    danger: 'bg-red-100/80 text-red-700 border-red-200/50',
    info: 'bg-brand-100/80 text-brand-700 border-brand-200/50',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        'backdrop-filter backdrop-blur-sm border',
        'shadow-sm transition-all',
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {children}
    </motion.span>
  );
};
