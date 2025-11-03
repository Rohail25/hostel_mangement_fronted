/**
 * Toast notification component - Modern Glassy Toasts
 * Beautiful notifications with glass morphism
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { ToastType } from '../types/common';

interface ToastProps {
  /** Whether toast is visible */
  open: boolean;
  /** Toast type */
  type: ToastType;
  /** Message to display */
  message: string;
  /** Duration in milliseconds (0 = no auto-close) */
  duration?: number;
  /** Close handler */
  onClose: () => void;
}

/**
 * Modern glassy toast notification component
 */
export const Toast: React.FC<ToastProps> = ({
  open,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  const typeConfig = {
    success: {
      Icon: CheckCircleIcon,
      gradient: 'from-green-500 to-emerald-600',
      bgClass: 'bg-green-50/90',
      textClass: 'text-green-900',
      borderClass: 'border-green-200/50',
    },
    error: {
      Icon: XCircleIcon,
      gradient: 'from-red-500 to-rose-600',
      bgClass: 'bg-red-50/90',
      textClass: 'text-red-900',
      borderClass: 'border-red-200/50',
    },
    warning: {
      Icon: ExclamationTriangleIcon,
      gradient: 'from-amber-500 to-orange-600',
      bgClass: 'bg-amber-50/90',
      textClass: 'text-amber-900',
      borderClass: 'border-amber-200/50',
    },
    info: {
      Icon: InformationCircleIcon,
      gradient: 'from-brand-500 to-purple-600',
      bgClass: 'bg-brand-50/90',
      textClass: 'text-brand-900',
      borderClass: 'border-brand-200/50',
    },
  };

  const config = typeConfig[type];
  const Icon = config.Icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed top-4 right-4 z-50"
        >
          <div
            className={clsx(
              'flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-md',
              config.bgClass,
              config.borderClass
            )}
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={clsx(
                'flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-gradient-to-br shadow-lg',
                config.gradient
              )}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <p className={clsx('flex-1 text-sm font-semibold', config.textClass)}>
              {message}
            </p>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={clsx(
                'flex-shrink-0 p-1 rounded-lg hover:bg-white/50 transition-colors',
                config.textClass
              )}
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

