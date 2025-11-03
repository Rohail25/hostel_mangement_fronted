/**
 * ConfirmDialog component - Modern Glassy Modal
 * Beautiful confirmation dialog with glass morphism
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  /** Whether dialog is open */
  open: boolean;
  /** Dialog title */
  title?: string;
  /** Confirmation message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm handler */
  onConfirm: () => void;
  /** Cancel handler */
  onCancel: () => void;
  /** Whether action is destructive (shows red button) */
  destructive?: boolean;
}

/**
 * Modern glassy confirmation dialog component
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onCancel();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      dialogRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="glass-strong rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-white/20"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {destructive && (
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg"
                    >
                      <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {title}
                    </h3>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onCancel}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-slate-500" />
                </motion.button>
              </div>

              {/* Message */}
              <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="px-5 py-2.5 glass border border-white/30 text-slate-700 rounded-xl hover:bg-white/50 transition-all font-semibold shadow-md"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className={`px-5 py-2.5 rounded-xl text-white transition-all font-semibold shadow-lg ${
                    destructive
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                      : 'bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700'
                  }`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
