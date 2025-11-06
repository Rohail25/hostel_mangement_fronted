/**
 * Hostel service - Business logic for hostel management
 */

import type { Hostel, HostelFormData } from '../types/hostel';
import type { Id } from '../types/common';
import * as db from './db';
import hostelData from '../mock/hostels.json';
import tenantsData from '../mock/tenants.json';

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

/**
 * Get architecture data for a hostel
 * This generates dummy data based on hostel structure and tenant assignments
 * In production, this would fetch from the API
 */
export function getArchitectureData(hostelId: number): import('../types/hostel').ArchitectureData {
  const hostel = getHostelById(hostelId);
  if (!hostel) {
    throw new Error('Hostel not found');
  }

  // Generate architecture structure
  const floors: import('../types/hostel').Floor[] = [];
  let totalRooms = 0;
  let totalSeats = 0;
  let occupiedSeats = 0;

  // Create floors
  for (let floorNum = 1; floorNum <= hostel.totalFloors; floorNum++) {
    const rooms: import('../types/hostel').Room[] = [];

    // Create rooms for this floor
    for (let roomIndex = 1; roomIndex <= hostel.roomsPerFloor; roomIndex++) {
      const roomNumber = `${floorNum}${String(roomIndex).padStart(2, '0')}`;
      const totalSeatsPerRoom = 4; // Default 4 seats per room
      const seats: import('../types/hostel').Seat[] = [];

      // Create seats (A, B, C, D)
      const seatLetters = ['A', 'B', 'C', 'D'];
      for (let i = 0; i < totalSeatsPerRoom; i++) {
        const seatId = `${floorNum}-${String(roomIndex).padStart(2, '0')}-${seatLetters[i]}`;
        
        // Find tenant assigned to this room and seat
        const tenant = tenantsData.find(
          (t: any) => t.room === roomNumber && t.bed === seatLetters[i]
        );

        seats.push({
          id: seatId,
          seatNumber: seatLetters[i],
          isOccupied: !!tenant && tenant.status === 'Active',
          tenantName: tenant?.name,
          tenantId: tenant?.id,
        });

        if (tenant && tenant.status === 'Active') {
          occupiedSeats++;
        }
        totalSeats++;
      }

      rooms.push({
        id: `${floorNum}-${String(roomIndex).padStart(2, '0')}`,
        floorNumber: floorNum,
        roomNumber: String(roomIndex).padStart(2, '0'),
        totalSeats: totalSeatsPerRoom,
        seats,
      });
      totalRooms++;
    }

    floors.push({
      floorNumber: floorNum,
      rooms,
    });
  }

  return {
    hostelId,
    floors,
    totalRooms,
    totalSeats,
    occupiedSeats,
    availableSeats: totalSeats - occupiedSeats,
  };
}

/**
 * Add a room to a hostel
 * In production, this would make an API call
 */
export function addRoom(
  hostelId: number,
  roomData: import('../types/hostel').RoomFormData
): boolean {
  // In production, this would call: POST /api/rooms
  // For now, we just return success
  // The architecture data is generated dynamically, so adding a room
  // would require updating the backend database
  console.log('Adding room:', { hostelId, ...roomData });
  return true;
}

