/**
 * Mess API Service - Backend integration
 */

import { api } from '../../services/apiClient';
import { API_ROUTES } from '../../services/api.config';
import { getUserData } from '../../services/auth.storage';
import type { MessEntry, MessFormData } from '../types/hostel';
import type { Id } from '../types/common';

const isOwnerUser = (): boolean => {
  const userData = getUserData();
  if (!userData) return false;
  if (userData.roleType) return userData.roleType === 'owner';
  if (typeof userData.role === 'string') return userData.role === 'owner';
  return userData.role?.name === 'owner';
};

// Use owner routes for owners, admin routes for admins
const getMessRoutes = () => {
  return isOwnerUser() ? API_ROUTES.OWNER.MESS : API_ROUTES.MESS;
};

/**
 * Get all mess entries for a hostel
 */
export async function getMessEntriesByHostelAPI(hostelId: Id): Promise<MessEntry[]> {
  try {
    const routes = getMessRoutes();
    const response = await api.get(routes.LIST_BY_HOSTEL(hostelId));
    if (response.success && response.data) {
      return Array.isArray(response.data) ? response.data : [response.data];
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching mess entries:', error);
    throw error;
  }
}

/**
 * Get mess stats for a hostel
 */
export async function getMessStatsAPI(hostelId: Id): Promise<any> {
  try {
    const routes = getMessRoutes();
    const response = await api.get(routes.STATS_BY_HOSTEL(hostelId));
    if (response.success && response.data) {
      return response.data;
    }
    return { totalEntries: 0, totalPrice: 0, averagePrice: 0 };
  } catch (error: any) {
    console.error('Error fetching mess stats:', error);
    throw error;
  }
}

/**
 * Get a mess entry by ID
 */
export async function getMessEntryByIdAPI(messEntryId: number): Promise<MessEntry | null> {
  try {
    const routes = getMessRoutes();
    const response = await api.get(routes.BY_ID(messEntryId));
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching mess entry:', error);
    throw error;
  }
}

/**
 * Create a new mess entry
 */
export async function createMessEntryAPI(hostelId: Id, data: MessFormData): Promise<MessEntry> {
  try {
    const payload = {
      hostelId: typeof hostelId === 'string' ? parseInt(hostelId) : hostelId,
      day: data.day,
      breakfast: data.breakfast,
      lunch: data.lunch,
      dinner: data.dinner,
      price: data.price ? parseFloat(data.price as string) : 0
    };

    const routes = getMessRoutes();
    const response = await api.post(routes.CREATE, payload);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create mess entry');
  } catch (error: any) {
    console.error('Error creating mess entry:', error);
    throw error;
  }
}

/**
 * Update a mess entry
 */
export async function updateMessEntryAPI(messEntryId: number, data: Partial<MessFormData>): Promise<MessEntry> {
  try {
    const payload: any = {};
    if (data.day !== undefined) payload.day = data.day;
    if (data.breakfast !== undefined) payload.breakfast = data.breakfast;
    if (data.lunch !== undefined) payload.lunch = data.lunch;
    if (data.dinner !== undefined) payload.dinner = data.dinner;
    if (data.price !== undefined) payload.price = data.price ? parseFloat(data.price as string) : 0;

    const routes = getMessRoutes();
    const response = await api.put(routes.UPDATE(messEntryId), payload);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update mess entry');
  } catch (error: any) {
    console.error('Error updating mess entry:', error);
    throw error;
  }
}

/**
 * Delete a mess entry
 */
export async function deleteMessEntryAPI(messEntryId: number): Promise<boolean> {
  try {
    const routes = getMessRoutes();
    const response = await api.delete(routes.DELETE(messEntryId));
    if (response.success) {
      return true;
    }
    throw new Error(response.message || 'Failed to delete mess entry');
  } catch (error: any) {
    console.error('Error deleting mess entry:', error);
    throw error;
  }
}
