/**
 * Type definitions for hostel management
 */

import type { Id } from './common';

/**
 * Hostel entity
 * Represents a hostel property in the system
 */
export interface Hostel {
  id: Id;
  name: string;
  city: string;
  totalFloors: number;
  roomsPerFloor: number;
  managerName: string;
  managerPhone: string;
  notes?: string;
}

/**
 * Form data for creating/editing hostels
 */
export interface HostelFormData {
  name: string;
  city: string;
  totalFloors: number;
  roomsPerFloor: number;
  managerName: string;
  managerPhone: string;
  notes?: string;
}

/**
 * Hostel statistics for dashboard
 */
export interface HostelStats {
  totalHostels: number;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

