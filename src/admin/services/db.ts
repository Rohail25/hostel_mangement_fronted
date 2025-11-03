/**
 * In-memory database service with localStorage persistence
 * Provides CRUD operations for all entities
 */

import type { Id } from '../types/common';

/** Generic data store structure */
interface DataStore<T> {
  [key: string]: T;
}

/** Main database structure */
interface Database {
  [entityKey: string]: DataStore<any>;
}

/** In-memory database */
const db: Database = {};

/** Storage key prefix */
const STORAGE_PREFIX = 'hm_admin_';

/**
 * Initialize a data store for an entity
 * @param entityKey - Unique key for the entity type
 */
function initStore(entityKey: string): void {
  if (!db[entityKey]) {
    db[entityKey] = {};
    // Try to load from localStorage
    loadFromStorage(entityKey);
  }
}

/**
 * Load data from localStorage into memory
 * @param entityKey - Entity key to load
 */
function loadFromStorage(entityKey: string): void {
  try {
    const storageKey = STORAGE_PREFIX + entityKey;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      db[entityKey] = JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Failed to load ${entityKey} from storage:`, error);
  }
}

/**
 * Save data from memory to localStorage
 * @param entityKey - Entity key to save
 */
function saveToStorage(entityKey: string): void {
  try {
    const storageKey = STORAGE_PREFIX + entityKey;
    localStorage.setItem(storageKey, JSON.stringify(db[entityKey]));
  } catch (error) {
    console.error(`Failed to save ${entityKey} to storage:`, error);
  }
}

/**
 * Seed initial data from JSON
 * @param entityKey - Entity key
 * @param data - Array of entities to seed
 */
export function seedFromJson<T extends { id: Id }>(
  entityKey: string,
  data: T[]
): void {
  initStore(entityKey);
  // Only seed if store is empty
  if (Object.keys(db[entityKey]).length === 0) {
    data.forEach((item) => {
      db[entityKey][item.id] = item;
    });
    saveToStorage(entityKey);
  }
}

/**
 * Get all items for an entity
 * @param entityKey - Entity key
 * @returns Array of all items
 */
export function list<T>(entityKey: string): T[] {
  initStore(entityKey);
  return Object.values(db[entityKey]);
}

/**
 * Get a single item by ID
 * @param entityKey - Entity key
 * @param id - Item ID
 * @returns Item or undefined
 */
export function getById<T>(entityKey: string, id: Id): T | undefined {
  initStore(entityKey);
  return db[entityKey][id];
}

/**
 * Create a new item
 * @param entityKey - Entity key
 * @param item - Item to create (must have id)
 * @returns Created item
 */
export function create<T extends { id: Id }>(entityKey: string, item: T): T {
  initStore(entityKey);
  db[entityKey][item.id] = item;
  saveToStorage(entityKey);
  return item;
}

/**
 * Update an existing item
 * @param entityKey - Entity key
 * @param id - Item ID
 * @param updates - Partial updates to apply
 * @returns Updated item or undefined if not found
 */
export function update<T extends { id: Id }>(
  entityKey: string,
  id: Id,
  updates: Partial<T>
): T | undefined {
  initStore(entityKey);
  const existing = db[entityKey][id];
  if (!existing) return undefined;

  const updated = { ...existing, ...updates };
  db[entityKey][id] = updated;
  saveToStorage(entityKey);
  return updated;
}

/**
 * Remove an item
 * @param entityKey - Entity key
 * @param id - Item ID
 * @returns true if removed, false if not found
 */
export function remove(entityKey: string, id: Id): boolean {
  initStore(entityKey);
  if (!db[entityKey][id]) return false;

  delete db[entityKey][id];
  saveToStorage(entityKey);
  return true;
}

/**
 * Clear all data for an entity (use with caution)
 * @param entityKey - Entity key
 */
export function clear(entityKey: string): void {
  initStore(entityKey);
  db[entityKey] = {};
  saveToStorage(entityKey);
}

/**
 * Get next available ID for an entity
 * @param entityKey - Entity key
 * @returns Next ID
 */
export function getNextId(entityKey: string): number {
  initStore(entityKey);
  const items = Object.values(db[entityKey]);
  if (items.length === 0) return 1;

  const ids = items
    .map((item: any) => item.id)
    .filter((id) => typeof id === 'number') as number[];

  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

/**
 * Manually sync all stores to localStorage
 */
export function syncAll(): void {
  Object.keys(db).forEach(saveToStorage);
}

