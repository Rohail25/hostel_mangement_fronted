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
  amenities?: string[];
  mapLink?: string;
  category?: string;
  type?: string;
  totalBeds?: number;
  occupiedBeds?: number;
  availableBeds?: number;
  vacantRooms?: number;
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
  amenities?: string[];
  mapLink?: string;
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

/**
 * Seat entity - represents an individual bed/seat in a room
 */
export interface Seat {
  id: string; // Format: "{floorNumber}-{roomNumber}-{seatLetter}" e.g., "2-01-A"
  bedId?: number;
  seatNumber: string; // A, B, C, D, etc.
  isOccupied: boolean;
  tenantName?: string; // Name of tenant occupying this seat
  tenantId?: number; // ID of tenant occupying this seat
}

/**
 * Room entity - represents a room in a hostel
 */
export interface Room {
  id: string; // Format: "{floorNumber}-{roomNumber}" e.g., "2-01"
  floorNumber: number;
  roomNumber: string; // "01", "02", etc.
  totalSeats: number;
  seats: Seat[];
  pricePerSeat?: number;
}

/**
 * Floor entity - represents a floor in a hostel
 */
export interface Floor {
  floorNumber: number;
  rooms: Room[];
}

/**
 * Architecture data - complete structure of a hostel
 */
export interface ArchitectureData {
  hostelId: number;
  floors: Floor[];
  totalRooms: number;
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
}

/**
 * Room form data for adding rooms
 */
export interface RoomFormData {
  floorNumber: number;
  roomNumber: string;
  totalSeats: number;
  pricePerSeat?: number;
  roomType?: 'single' | 'double' | 'triple' | 'quad' | 'dormitory' | 'suite';
  furnishing?: 'furnished' | 'semi_furnished' | 'unfurnished';
}

/**
 * Meal type
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner';

/**
 * Mess item - represents an ingredient/item used in mess
 */
export interface MessItem {
  id: string;
  name: string;
  quantity: string; // e.g., "2 kg", "5 pieces", "1 liter" or numeric "5"
  unit?: string; // kg, pieces, liter, etc.
  cost?: number; // Cost of this item
  total?: number; // Total cost (quantity * cost)
  ingredients?: string | string[]; // Ingredients needed for this item
}

/**
 * Meal - represents a single meal (breakfast, lunch, or dinner)
 */
export interface Meal {
  type: MealType;
  items: MessItem[];
  notes?: string;
}

/**
 * Mess entry - represents mess for a specific day
 */
export interface MessEntry {
  id: Id;
  hostelId: Id;
  day: string; // Day of week (Monday, Tuesday, etc.)
  date: string; // ISO date string for the specific day
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  price?: number; // Optional price for the meal
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

/**
 * Mess form data for creating/editing mess entries
 */
export interface MessFormData {
  day: string; // Day of week (Monday, Tuesday, etc.)
  breakfast: {
    items: Array<{ 
      id?: string; 
      name: string; 
      quantity: string; 
      unit?: string;
      cost?: string; // Cost of this item (as string in form, converted to number on submit)
      total?: string; // Total cost (quantity * cost) - stored as string in form
      ingredients?: string; // Comma-separated ingredients
    }>;
    notes?: string;
  };
  lunch: {
    items: Array<{ 
      id?: string; 
      name: string; 
      quantity: string; 
      unit?: string;
      cost?: string; // Cost of this item (as string in form, converted to number on submit)
      total?: string; // Total cost (quantity * cost) - stored as string in form
      ingredients?: string; // Comma-separated ingredients
    }>;
    notes?: string;
  };
  dinner: {
    items: Array<{ 
      id?: string; 
      name: string; 
      quantity: string; 
      unit?: string;
      cost?: string; // Cost of this item (as string in form, converted to number on submit)
      total?: string; // Total cost (quantity * cost) - stored as string in form
      ingredients?: string; // Comma-separated ingredients
    }>;
    notes?: string;
  };
  price?: string; // Optional price for the meal
}

