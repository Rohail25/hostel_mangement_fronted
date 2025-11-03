/**
 * Common type definitions and utilities for the admin panel
 */

/** Generic ID type that can be number or string */
export type Id = number | string;

/** Standard API response structure */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Pagination metadata */
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sort configuration */
export interface SortConfig {
  key: string;
  direction: SortDirection;
}

/** Generic filter configuration */
export interface FilterConfig {
  [key: string]: string | number | boolean | undefined;
}

/** Toast notification types */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/** Toast notification structure */
export interface ToastNotification {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Format a number as currency (USD)
 * @param amount - The numeric amount
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string or Date object to readable format
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format a date string to ISO date (YYYY-MM-DD)
 * @param date - Date string or Date object
 * @returns ISO date string
 */
export function formatISODate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Debounce function for search inputs
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a unique ID
 * @returns Unique string ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate percentage
 * @param value - Numerator
 * @param total - Denominator
 * @returns Percentage value
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

