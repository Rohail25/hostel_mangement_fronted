/**
 * Currency API Service - Backend integration
 */

import { api } from '../../services/apiClient';

export interface Currency {
  id: number;
  userId: number;
  symbol: string;
  code?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyFormData {
  symbol: string;
  code?: string;
  name?: string;
}

/**
 * Get user's currency
 */
export async function getUserCurrencyAPI(): Promise<Currency | null> {
  try {
    const response = await api.get(`/admin/currency`);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching currency:', error);
    throw error;
  }
}

/**
 * Create or update user's currency
 */
export async function createOrUpdateCurrencyAPI(
  data: CurrencyFormData
): Promise<Currency> {
  try {
    const response = await api.post(`/admin/currency`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to save currency');
  } catch (error: any) {
    console.error('Error saving currency:', error);
    throw error;
  }
}

/**
 * Delete user's currency
 */
export async function deleteCurrencyAPI(): Promise<void> {
  try {
    const response = await api.delete(`/admin/currency`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete currency');
    }
  } catch (error: any) {
    console.error('Error deleting currency:', error);
    throw error;
  }
}
