/**
 * Hostel service - Business logic for hostel management
 */

import type { Hostel, HostelFormData } from '../types/hostel';
import type { Id } from '../types/common';
import * as db from './db';
import hostelData from '../mock/hostels.json';

const ENTITY_KEY = 'hostels';

/** Initialize hostel store with seed data */
function init(): void {
  db.seedFromJson(ENTITY_KEY, hostelData);
}

/**
 * Get all hostels
 * @returns Array of hostels
 */
export function getAllHostels(): Hostel[] {
  init();
  return db.list<Hostel>(ENTITY_KEY);
}

/**
 * Get a hostel by ID
 * @param id - Hostel ID
 * @returns Hostel or undefined
 */
export function getHostelById(id: Id): Hostel | undefined {
  init();
  return db.getById<Hostel>(ENTITY_KEY, id);
}

/**
 * Create a new hostel
 * @param data - Hostel form data
 * @returns Created hostel
 */
export function createHostel(data: HostelFormData): Hostel {
  init();
  const newId = db.getNextId(ENTITY_KEY);
  const hostel: Hostel = {
    id: newId,
    ...data,
  };
  return db.create(ENTITY_KEY, hostel);
}

/**
 * Update an existing hostel
 * @param id - Hostel ID
 * @param data - Partial hostel data to update
 * @returns Updated hostel or undefined if not found
 */
export function updateHostel(
  id: Id,
  data: Partial<HostelFormData>
): Hostel | undefined {
  init();
  return db.update<Hostel>(ENTITY_KEY, id, data);
}

/**
 * Delete a hostel
 * @param id - Hostel ID
 * @returns true if deleted, false if not found
 */
export function deleteHostel(id: Id): boolean {
  init();
  return db.remove(ENTITY_KEY, id);
}

/**
 * Search hostels by name or city
 * @param query - Search query
 * @returns Filtered hostels
 */
export function searchHostels(query: string): Hostel[] {
  const hostels = getAllHostels();
  if (!query.trim()) return hostels;

  const lowerQuery = query.toLowerCase();
  return hostels.filter(
    (h) =>
      h.name.toLowerCase().includes(lowerQuery) ||
      h.city.toLowerCase().includes(lowerQuery) ||
      h.managerName.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get hostels by city
 * @param city - City name
 * @returns Hostels in the specified city
 */
export function getHostelsByCity(city: string): Hostel[] {
  const hostels = getAllHostels();
  return hostels.filter(
    (h) => h.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Calculate total capacity across all hostels
 * @returns Total room capacity
 */
export function getTotalCapacity(): number {
  const hostels = getAllHostels();
  return hostels.reduce(
    (total, h) => total + h.totalFloors * h.roomsPerFloor,
    0
  );
}

