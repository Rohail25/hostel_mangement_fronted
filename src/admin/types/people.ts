/**
 * Type definitions for people management (Tenants & Employees)
 */

import type { Id } from './common';

/** Tenant status types */
export type TenantStatus = 'Active' | 'Inactive' | 'Pending';

/**
 * Tenant entity
 * Represents a person staying at the hostel
 */
export interface Tenant {
  id: Id;
  name: string;
  email: string;
  phone: string;
  room: string;
  bed: string;
  leaseStart: string; // ISO date string
  leaseEnd: string; // ISO date string
  status: TenantStatus;
}

/** Employee status types */
export type EmployeeStatus = 'Active' | 'Inactive';

/**
 * Employee entity
 * Represents a staff member working at the hostel
 */
export interface Employee {
  id: Id;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedAt: string; // ISO date string
  status: EmployeeStatus;
}

/** Form data for creating/editing tenants */
export interface TenantFormData {
  name: string;
  email: string;
  phone: string;
  room: string;
  bed: string;
  leaseStart: string;
  leaseEnd: string;
  status: TenantStatus;
}

/** Form data for creating/editing employees */
export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedAt: string;
  status: EmployeeStatus;
}

