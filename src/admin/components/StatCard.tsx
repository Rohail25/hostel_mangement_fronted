/**
 * StatCard component - Modern Glassy Stat Cards
 * Beautiful gradient cards with glass morphism and smooth animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface StatCardProps {
  /** Card title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Icon or emoji */
  icon?: React.ReactNode;
  /** Optional trend indicator */
  trend?: {
    value: string;
    isPositive: boolean;
  };
  /** Optional color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Animation delay */
  delay?: number;
}

/**
 * Modern glassy statistical card component for dashboard metrics
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  delay = 0,
}) => {
  const variantStyles = {
    default: {
      gradient: 'from-slate-400/20 to-slate-500/20',
      iconBg: 'from-slate-400 to-slate-600',
      ring: 'ring-slate-200/50',
    },
    primary: {
      gradient: 'from-brand-400/20 to-purple-500/20',
      iconBg: 'from-brand-500 to-purple-600',
      ring: 'ring-brand-200/50',
    },
    success: {
      gradient: 'from-green-400/20 to-emerald-500/20',
      iconBg: 'from-green-500 to-emerald-600',
      ring: 'ring-green-200/50',
    },
    warning: {
      gradient: 'from-amber-400/20 to-orange-500/20',
      iconBg: 'from-amber-500 to-orange-600',
      ring: 'ring-amber-200/50',
    },
    danger: {
      gradient: 'from-red-400/20 to-rose-500/20',
      iconBg: 'from-red-500 to-rose-600',
      ring: 'ring-red-200/50',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={clsx(
        'relative group overflow-hidden',
        'glass rounded-2xl p-6',
        'ring-1',
        styles.ring,
        'hover-lift cursor-pointer'
      )}
    >
      {/* Gradient overlay */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        styles.gradient
      )} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              {title}
            </p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="text-4xl font-bold text-slate-900"
            >
              {value}
            </motion.p>
          </div>

          {icon && (
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.1 }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              className={clsx(
                'w-14 h-14 rounded-2xl bg-gradient-to-br shadow-lg',
                'flex items-center justify-center text-2xl',
                styles.iconBg
              )}
            >
              <span className="drop-shadow-lg">{icon}</span>
            </motion.div>
          )}
        </div>

        {trend && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + 0.3 }}
            className="flex items-center gap-2"
          >
            <div className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
              trend.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            )}>
              {trend.isPositive ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              )}
              <span>{trend.value}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};
