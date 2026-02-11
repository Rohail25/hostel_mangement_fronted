/**
 * Tenant Service
 * API calls for tenant management
 */

import { api } from '../../services/apiClient';

// Types based on API response
export interface TenantResponse {
  success: boolean;
  data: {
    tenant: {
      id: number;
      firstName: string;
      lastName: string;
      name: string;
      email: string;
      phone: string;
      alternatePhone: string | null;
      gender: string;
      dateOfBirth: string;
      status: string;
      leaseStartDate: string;
      leaseEndDate: string;
      monthlyRent: number;
      securityDeposit: number;
      notes: string | null;
      rating: number;
      profilePhoto: string | null;
      documents: Array<{
        field: string;
        url: string;
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        uploadedAt: string;
      }>;
      counts: {
        payments: number;
        allocations: number;
      };
      activeAllocation: {
        id: number;
        status: string;
        checkInDate: string;
        expectedCheckOutDate: string;
        checkOutDate: string | null;
        rentAmount: number;
        depositAmount: number;
        notes: string | null;
        documents: any[];
        hostel: {
          id: number;
          name: string;
        };
        floor: {
          id: number;
          number: number;
          name: string;
        };
        room: {
          id: number;
          number: string;
        };
        bed: {
          id: number;
          number: string;
        };
      } | null;
      allocations: Array<any>;
    };
    allocation: {
      id: number;
      status: string;
      checkInDate: string;
      expectedCheckOutDate: string;
      checkOutDate: string | null;
      rentAmount: number;
      depositAmount: number;
      notes: string | null;
      documents: any[];
      hostel: {
        id: number;
        name: string;
      };
      floor: {
        id: number;
        number: number;
        name: string;
      };
      room: {
        id: number;
        number: string;
      };
      bed: {
        id: number;
        number: string;
      };
    };
  };
  message: string;
  statusCode: number;
}

export interface Floor {
  id: number;
  number: number;
  floorName: string;
  hostelId?: number;
}

export interface Room {
  id: number;
  roomNumber: string;
  floorId?: number;
}

export interface Bed {
  id: number;
  bedNumber: string;
  roomId?: number;
  status?: 'available' | 'occupied' | 'reserved';
  currentTenantId?: number | null;
  currentTenant?: {
    username?: string;
    email?: string;
    phone?: string;
  } | null;
  // Keep isOccupied for backward compatibility, but prefer status
  isOccupied?: boolean;
}

// Tenant list item interface (simplified for list view)
export interface TenantListItem {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: string;
  profilePhoto: string | null;
  hostelId?: number;
  room?: string;
  bed?: string;
  leaseStart?: string;
  leaseEnd?: string;
  rent?: number;
  deposit?: number;
  rating?: number;
  [key: string]: any; // Allow additional properties
}

/**
 * Create a new tenant
 */
export const createTenant = async (formData: FormData): Promise<TenantResponse> => {
  try {
    const response = await api.post<TenantResponse['data']>('/admin/tenant', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      data: response.data as TenantResponse['data'],
      message: 'Tenant created successfully',
      statusCode: 201,
    };
  } catch (error: any) {
    console.error('Error creating tenant:', error);
    throw error;
  }
};

/**
 * Update an existing tenant
 */
export const updateTenant = async (tenantId: number, formData: FormData): Promise<TenantResponse> => {
  try {
    const response = await api.put<TenantResponse['data']>(`/admin/tenant/${tenantId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      data: response.data as TenantResponse['data'],
      message: 'Tenant updated successfully',
      statusCode: 200,
    };
  } catch (error: any) {
    console.error('Error updating tenant:', error);
    throw error;
  }
};

/**
 * Delete a tenant
 */
export const deleteTenant = async (tenantId: number): Promise<{ success: boolean; message: string; statusCode: number }> => {
  try {
    await api.delete<null>(`/admin/tenant/${tenantId}`);
    return {
      success: true,
      message: 'Tenant deleted successfully',
      statusCode: 200,
    };
  } catch (error: any) {
    console.error('Error deleting tenant:', error);
    throw error;
  }
};

/**
 * Get all floors
 */
export const getFloors = async (): Promise<Floor[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Floor[] }>('/floors');
    // Extract data from response - API returns { success: true, data: [...] }
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    // If response.data is the array directly
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching floors:', error);
    throw error;
  }
};

/**
 * Get floors by hostel ID
 */
export const getFloorsByHostel = async (hostelId: number): Promise<Floor[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Floor[] }>(`/admin/floors/hostel/${hostelId}`);
    // Extract data from response - API returns { success: true, data: [...] }
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    // If response.data is the array directly
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching floors by hostel:', error);
    throw error;
  }
};

/**
 * Get rooms by floor ID
 */
export const getRoomsByFloor = async (floorId: number): Promise<Room[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Room[] }>(`/room/floor/${floorId}`);
    // Extract data from response - API returns { success: true, data: [...] }
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    // If response.data is the array directly
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

/**
 * Get beds by room ID
 */
export const getBedsByRoom = async (roomId: number): Promise<Bed[]> => {
  try {
    const response = await api.get<Bed[]>(`/admin/beds/room/${roomId}`);
    // api.get returns ApiResponse<T>, so response is { success: true, data: T }
    // API returns { success: true, data: Bed[] }
    // So response.data is Bed[]
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching beds:', error);
    // Return empty array on error instead of throwing to prevent form breaking
    return [];
  }
};

/**
 * Get tenants by hostel ID
 */
export const getTenantsByHostel = async (hostelId: number): Promise<TenantListItem[]> => {
  try {
    const response = await api.get<{ 
      hostel: { id: number; name: string };
      tenants: TenantListItem[];
      count: number;
    }>(`/admin/tenants/hostel/${hostelId}`);
    // api.get returns ApiResponse<T>, so response.data is the nested data object
    // API returns { success: true, data: { hostel: {...}, tenants: [...], count: 1 } }
    // So response.data is { hostel: {...}, tenants: [...], count: 1 }
    if (response && response.data && (response.data as any).tenants && Array.isArray((response.data as any).tenants)) {
      return (response.data as any).tenants;
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching tenants by hostel:', error);
    throw error;
  }
};

/**
 * Get all tenants
 */
export const getAllTenants = async (): Promise<TenantListItem[]> => {
  try {
    const response = await api.get<{
      tenants: TenantListItem[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    }>('/admin/tenant');
    // API returns { success: true, data: { tenants: [...], pagination: {...} } }
    if (response && response.success && response.data && response.data.tenants) {
      return response.data.tenants;
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching all tenants:', error);
    throw error;
  }
};

/**
 * Get tenant by ID (full details)
 */
export const getTenantById = async (tenantId: number): Promise<any> => {
  try {
    const response = await api.get<{ 
      success: boolean; 
      data: any;
      message: string;
      statusCode: number;
    }>(`/admin/tenant/${tenantId}`);
    // Extract tenant data from response
    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching tenant by ID:', error);
    throw error;
  }
};

