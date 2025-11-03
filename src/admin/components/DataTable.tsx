/**
 * DataTable component - Modern Glassy Data Table
 * Beautiful glass morphism table with smooth animations
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { SortDirection } from '../types/common';
import { EmptyState } from './EmptyState';
import { Loading } from './Loading';

/** Column definition */
export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Data rows */
  data: T[];
  /** Page size (items per page) */
  pageSize?: number;
  /** Sort change handler */
  onSortChange?: (key: string, direction: SortDirection) => void;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Actions render function */
  actionsRender?: (row: T) => React.ReactNode;
  /** Toolbar slot (search, filters, etc.) */
  toolbar?: React.ReactNode;
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  loading?: boolean;
}

/**
 * Modern glassy data table component
 */
export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  pageSize = 10,
  onSortChange,
  onRowClick,
  actionsRender,
  toolbar,
  emptyMessage = 'No data available',
  loading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Handle sort
  const handleSort = (key: string) => {
    const newDirection =
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSortChange?.(key, newDirection);
  };

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  // Loading state
  if (loading) {
    return (
      <div>
        {toolbar && <div className="mb-4">{toolbar}</div>}
        <Loading variant="skeleton" rows={pageSize} />
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div>
        {toolbar && <div className="mb-4">{toolbar}</div>}
        <EmptyState title="No Data" description={emptyMessage} icon="📊" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toolbar */}
      {toolbar && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          {toolbar}
        </motion.div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden shadow-lg border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-brand-50/50 to-purple-50/50 border-b border-white/20">
                {columns.map((column, idx) => (
                  <motion.th
                    key={String(column.key)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={clsx(
                      'px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider',
                      column.sortable && 'cursor-pointer hover:bg-white/50 select-none',
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUpIcon
                            className={clsx(
                              'w-3 h-3 -mb-1',
                              sortKey === column.key && sortDirection === 'asc'
                                ? 'text-brand-600'
                                : 'text-slate-400'
                            )}
                          />
                          <ChevronDownIcon
                            className={clsx(
                              'w-3 h-3',
                              sortKey === column.key && sortDirection === 'desc'
                                ? 'text-brand-600'
                                : 'text-slate-400'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </motion.th>
                ))}
                {actionsRender && (
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              <AnimatePresence mode="wait">
                {paginatedData.map((row, rowIdx) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: rowIdx * 0.03 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                    className={clsx(
                      'transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-6 py-4 text-sm text-slate-900 font-medium"
                      >
                        {column.render
                          ? column.render(row)
                          : String(row[column.key as keyof T] ?? '')}
                      </td>
                    ))}
                    {actionsRender && (
                      <td
                        className="px-6 py-4 text-right text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actionsRender(row)}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50/50 to-purple-50/50 border-t border-white/20"
          >
            <p className="text-sm text-slate-600 font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, data.length)} of {data.length}{' '}
              results
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 glass rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/50 transition-all font-medium text-sm flex items-center gap-2"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Previous
              </motion.button>
              <div className="flex items-center px-4 py-2 glass rounded-xl text-sm font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 glass rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/50 transition-all font-medium text-sm flex items-center gap-2"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
