/**
 * Mess service - Business logic for mess management
 */

import type { MessEntry, MessFormData } from '../types/hostel';
import type { Id } from '../types/common';
import * as db from './db';

const ENTITY_KEY = 'mess';

/** Initialize mess store */
function init(): void {
  const existing = db.list<MessEntry>(ENTITY_KEY);
  if (existing.length === 0) {
    // Add sample mess data for hostel ID 1 if no data exists
    const sampleDays = ['Monday', 'Tuesday', 'Wednesday'];
    sampleDays.forEach((day, index) => {
      const sampleEntry: MessEntry = {
        id: `mess-${index + 1}`,
        hostelId: '1',
        day: day,
        breakfast: {
          type: 'breakfast',
          items: [
            { id: `b1-${index}`, name: 'Bread', quantity: '10', unit: 'slices' },
            { id: `b2-${index}`, name: 'Butter', quantity: '200', unit: 'grams' },
            { id: `b3-${index}`, name: 'Tea', quantity: '5', unit: 'cups' },
          ],
          notes: 'Light breakfast',
        },
        lunch: {
          type: 'lunch',
          items: [
            { id: `l1-${index}`, name: 'Rice', quantity: '2', unit: 'kg' },
            { id: `l2-${index}`, name: 'Dal', quantity: '1', unit: 'kg' },
            { id: `l3-${index}`, name: 'Vegetables', quantity: '500', unit: 'grams' },
          ],
          notes: 'Vegetarian lunch',
        },
        dinner: {
          type: 'dinner',
          items: [
            { id: `d1-${index}`, name: 'Roti', quantity: '20', unit: 'pieces' },
            { id: `d2-${index}`, name: 'Curry', quantity: '1', unit: 'kg' },
            { id: `d3-${index}`, name: 'Salad', quantity: '500', unit: 'grams' },
          ],
          notes: 'Healthy dinner',
        },
        price: 150 + (index * 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.create(ENTITY_KEY, sampleEntry);
    });
  }
}

/**
 * Get all mess entries for a hostel
 * @param hostelId - Hostel ID
 * @returns Array of mess entries
 */
export function getMessEntriesByHostel(hostelId: Id): MessEntry[] {
  init();
  const allEntries = db.list<MessEntry>(ENTITY_KEY);
  return allEntries.filter((entry) => entry.hostelId === hostelId);
}

/**
 * Get a mess entry by ID
 * @param id - Mess entry ID
 * @returns Mess entry or undefined
 */
export function getMessEntryById(id: Id): MessEntry | undefined {
  init();
  return db.getById<MessEntry>(ENTITY_KEY, id);
}

/**
 * Get mess entry by day and hostel
 * @param hostelId - Hostel ID
 * @param day - Day of week (Monday, Tuesday, etc.)
 * @returns Mess entry or undefined
 */
export function getMessEntryByDay(hostelId: Id, day: string): MessEntry | undefined {
  init();
  const entries = getMessEntriesByHostel(hostelId);
  return entries.find((entry) => entry.day === day);
}

/**
 * Create a new mess entry
 * @param hostelId - Hostel ID
 * @param data - Mess form data
 * @returns Created mess entry
 */
export function createMessEntry(hostelId: Id, data: MessFormData): MessEntry {
  init();
  
  // Check if entry already exists for this day
  const existing = getMessEntryByDay(hostelId, data.day);
  if (existing) {
    throw new Error(`Mess entry already exists for ${data.day}`);
  }

  const newId = db.getNextId(ENTITY_KEY);
  const now = new Date().toISOString();
  
  // Convert form data to MessEntry format
  const messEntry: MessEntry = {
    id: newId,
    hostelId,
    day: data.day,
    breakfast: {
      type: 'breakfast',
      items: data.breakfast.items.map((item, index) => ({
        id: `${newId}-breakfast-${index}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
      notes: data.breakfast.notes,
    },
    lunch: {
      type: 'lunch',
      items: data.lunch.items.map((item, index) => ({
        id: `${newId}-lunch-${index}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
      notes: data.lunch.notes,
    },
    dinner: {
      type: 'dinner',
      items: data.dinner.items.map((item, index) => ({
        id: `${newId}-dinner-${index}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
      notes: data.dinner.notes,
    },
    price: data.price ? parseFloat(data.price) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  return db.create(ENTITY_KEY, messEntry);
}

/**
 * Update an existing mess entry
 * @param id - Mess entry ID
 * @param data - Partial mess form data to update
 * @returns Updated mess entry or undefined if not found
 */
export function updateMessEntry(
  id: Id,
  data: Partial<MessFormData>
): MessEntry | undefined {
  init();
  const existing = getMessEntryById(id);
  if (!existing) {
    return undefined;
  }

  const updatedData: Partial<MessEntry> = {
    updatedAt: new Date().toISOString(),
  };

  // Update day if provided
  if (data.day !== undefined) {
    updatedData.day = data.day;
  }

  // Update price if provided
  if (data.price !== undefined) {
    updatedData.price = data.price ? parseFloat(data.price) : undefined;
  }

  // Update breakfast if provided
  if (data.breakfast) {
    updatedData.breakfast = {
      type: 'breakfast',
      items: data.breakfast.items.map((item, index) => ({
        id: `${id}-breakfast-${index}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
      notes: data.breakfast.notes,
    };
  }

  // Update lunch if provided
  if (data.lunch) {
    updatedData.lunch = {
      type: 'lunch',
      items: data.lunch.items.map((item, index) => ({
        id: `${id}-lunch-${index}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
      notes: data.lunch.notes,
    };
  }

  // Update dinner if provided
  if (data.dinner) {
    updatedData.dinner = {
      type: 'dinner',
      items: data.dinner.items.map((item, index) => ({
        id: `${id}-dinner-${index}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
      notes: data.dinner.notes,
    };
  }

  return db.update<MessEntry>(ENTITY_KEY, id, updatedData);
}

/**
 * Delete a mess entry
 * @param id - Mess entry ID
 * @returns true if deleted, false if not found
 */
export function deleteMessEntry(id: Id): boolean {
  init();
  return db.remove(ENTITY_KEY, id);
}

