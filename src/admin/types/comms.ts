/**
 * Type definitions for communications management
 */

import type { Id } from './common';

/** Message target types */
export type MessageTarget = 'Tenant' | 'Employee' | 'Vendor';

/**
 * Message entity
 * Represents a communication message in the system
 */
export interface Message {
  id: Id;
  target: MessageTarget;
  subject: string;
  body: string;
  createdAt: string; // ISO date string
  from: string;
  read?: boolean;
}

/** Vendor status */
export type VendorStatus = 'Active' | 'Inactive' | 'Pending';

/**
 * Vendor entity
 * Represents a service provider or supplier
 */
export interface Vendor {
  id: Id;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  rating: number;
  lastInvoice: string; // ISO date string
  status: VendorStatus;
  hostelId?: Id; // Optional hostel ID to associate vendor with specific hostel
  hostelName?: string; // Hostel name for display
}

/** Alert severity levels */
export type AlertSeverity = 'info' | 'warn' | 'danger';

/** Alert status */
export type AlertStatus = 'open' | 'closed' | 'pending' | 'in_progress' | 'resolved' | 'dismissed';

/**
 * Alert entity
 * Represents a system alert or notification
 */
export interface Alert {
  id: Id;
  title: string;
  severity: AlertSeverity;
  createdAt: string; // ISO date string
  status: AlertStatus;
  rawStatus?: string; // Backend status value (pending, in_progress, resolved, dismissed)
  description?: string;
  assignedTo?: string;
  // Additional fields from API
  type?: string;
  priority?: string;
  hostel?: string;
  room?: string | null;
  tenant?: string | null;
  amount?: number | null;
  dueDate?: string | null;
}

