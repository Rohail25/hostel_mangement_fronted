/**
 * Employee Service
 * API calls for employee management
 */

import { api } from '../../services/apiClient';

// Types based on API response
export interface EmployeeListResponse {
  success: boolean;
  data: {
    items: Array<{
      id: number;
      userId: number;
      employeeCode: string | null;
      role: string;
      department: string | null;
      designation: string | null;
      salary: number | null;
      salaryType: string | null;
      joinDate: string;
      terminationDate: string | null;
      status: string;
      workingHours: string | null;
      hostelAssigned: number | null;
      bankDetails: any | null;
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      } | null;
      documents: any | null;
      profilePhoto: string | null;
      emergencyContact: {
        name: string;
        relation: string;
        phone: string;
      } | null;
      qualifications: string[] | null;
      notes: string | null;
      createdAt: string;
      updatedAt: string;
      user: {
        id: number;
        username: string;
        email: string;
        phone: string | null;
        userRole: string | null;
        status: string;
      };
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  statusCode: number;
}

// Employee list item interface (simplified for list view)
export interface EmployeeListItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  profilePhoto: string | null;
  joinDate: string;
  terminationDate: string | null;
  department: string | null;
  designation: string | null;
  [key: string]: any;
}

/**
 * Get all employees
 */
export const getAllEmployees = async (): Promise<EmployeeListItem[]> => {
  try {
    const response = await api.get<any>('/admin/employees');
    // API returns { success: true, data: { items: [...], total, page, limit, totalPages } }
    if (response && response.success && response.data && response.data.items) {
      // Map to list item format
      return response.data.items.map((emp: any) => ({
        id: emp.id,
        name: emp.user?.username || emp.user?.email || 'Unknown',
        email: emp.user?.email || '',
        phone: emp.user?.phone || null,
        role: emp.role || '',
        status: emp.status || 'active',
        profilePhoto: emp.profilePhoto,
        joinDate: emp.joinDate,
        terminationDate: emp.terminationDate,
        department: emp.department,
        designation: emp.designation,
        employeeCode: emp.employeeCode,
        salary: emp.salary,
        salaryType: emp.salaryType,
        workingHours: emp.workingHours,
        hostelAssigned: emp.hostelAssigned,
        address: emp.address,
        bankDetails: emp.bankDetails,
        documents: emp.documents,
        emergencyContact: emp.emergencyContact,
        qualifications: emp.qualifications,
        notes: emp.notes,
        userId: emp.userId,
        user: emp.user,
        hostelId: (emp as any).hostelId || emp.hostelAssigned,
      }));
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Get employees by hostel ID
 */
export const getEmployeesByHostel = async (hostelId: number): Promise<EmployeeListItem[]> => {
  try {
    const response = await api.get<any>(`/admin/employees/hostel/${hostelId}`);
    // API returns { success: true, data: { items: [...], total, page, limit, totalPages, hostelId } }
    if (response && response.success && response.data && response.data.items) {
      // Map to list item format
      return response.data.items.map((emp: any) => ({
        id: emp.id,
        name: emp.user?.username || emp.user?.email || 'Unknown',
        email: emp.user?.email || '',
        phone: emp.user?.phone || null,
        role: emp.role || '',
        status: emp.status || 'active',
        profilePhoto: emp.profilePhoto,
        joinDate: emp.joinDate,
        terminationDate: emp.terminationDate,
        department: emp.department,
        designation: emp.designation,
        employeeCode: emp.employeeCode,
        salary: emp.salary,
        salaryType: emp.salaryType,
        workingHours: emp.workingHours,
        hostelAssigned: emp.hostelAssigned,
        hostelId: (emp as any).hostelId || emp.hostelAssigned,
        address: emp.address,
        bankDetails: emp.bankDetails,
        documents: emp.documents,
        emergencyContact: emp.emergencyContact,
        qualifications: emp.qualifications,
        notes: emp.notes,
        userId: emp.userId,
        user: emp.user,
      }));
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching employees by hostel:', error);
    throw error;
  }
};

/**
 * Get employee by ID (for view)
 */
export const getEmployeeById = async (id: number): Promise<any> => {
  try {
    const response = await api.get<{
      success: boolean;
      data: {
        id: number;
        userId: number;
        employeeCode: string | null;
        role: string;
        department: string | null;
        designation: string | null;
        salary: number | null;
        salaryType: string | null;
        joinDate: string;
        terminationDate: string | null;
        status: string;
        workingHours: string | null;
        hostelId: number | null;
        bankDetails: any | null;
        address: {
          street: string;
          city: string;
          country: string;
        } | null;
        documents: Array<{
          url: string;
          filename: string;
          originalName: string;
          mimetype: string;
          size: number;
          uploadedAt: string;
        }> | null;
        profilePhoto: string | null;
        emergencyContact: any | null;
        qualifications: string[] | null;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
        user: {
          id: number;
          username: string;
          email: string;
          phone: string | null;
          userRole: string | null;
          status: string;
          createdAt: string;
        };
        hostel?: {
          id: number;
          name: string;
          address: any;
        };
      };
      message: string;
      statusCode: number;
    }>(`/admin/employee/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching employee:', error);
    throw error;
  }
};

/**
 * Get employee by ID (for edit - different response structure)
 */
export const getEmployeeForEdit = async (id: number): Promise<any> => {
  try {
    const response = await api.get<any>(`/admin/employee/${id}`);
    
    // The API returns: { success: true, data: { ...employee fields..., user: {...}, hostel: {...} } }
    // So response.data IS the employee object, and response.data.user contains the user
    if (response && response.success && response.data) {
      const employeeData = response.data;
      const userData = employeeData.user;
      
      // Extract employee data (all fields except user and hostel)
      const { user, hostel, ...employeeFields } = employeeData;
      
      // Return in the expected format: { user: {...}, employee: {...} }
      return {
        user: userData,
        employee: employeeFields
      };
    }
    
    throw new Error('Invalid response structure from API');
  } catch (error: any) {
    console.error('Error fetching employee for edit:', error);
    throw error;
  }
};

/**
 * Create a new employee
 */
export const createEmployee = async (formData: FormData): Promise<any> => {
  try {
    const response = await api.post<{
      success: boolean;
      data: {
        user: {
          id: number;
          username: string;
          email: string;
          phone: string;
          userRoleId: number | null;
        };
        employee: {
          id: number;
          userId: number;
          employeeCode: string;
          role: string;
          department: string | null;
          designation: string | null;
          salary: number;
          salaryType: string;
          joinDate: string;
          terminationDate: string | null;
          status: string;
          workingHours: string;
          hostelId: number | null;
          bankDetails: any | null;
          address: any | null;
          documents: Array<{
            url: string;
            filename: string;
            originalName: string;
            mimetype: string;
            size: number;
            uploadedAt: string;
          }> | null;
          profilePhoto: string | null;
          emergencyContact: any | null;
          qualifications: string[] | null;
          notes: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      message: string;
      statusCode: number;
    }>('/admin/employee', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error: any) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

/**
 * Update an employee
 */
export const updateEmployee = async (id: number, formData: FormData): Promise<any> => {
  try {
    const response = await api.put<{
      success: boolean;
      data: {
        user: {
          id: number;
          username: string;
          email: string;
          phone: string;
          userRoleId: number | null;
        };
        employee: {
          id: number;
          userId: number;
          employeeCode: string;
          role: string;
          department: string | null;
          designation: string | null;
          salary: number | null;
          salaryType: string | null;
          joinDate: string;
          terminationDate: string | null;
          status: string;
          workingHours: string | null;
          hostelId: number | null;
          bankDetails: any | null;
          address: any | null;
          documents: Array<{
            url: string;
            filename: string;
            originalName: string;
            mimetype: string;
            size: number;
            uploadedAt: string;
          }> | null;
          profilePhoto: string | null;
          emergencyContact: any | null;
          qualifications: string[] | null;
          notes: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      message: string;
      statusCode: number;
    }>(`/admin/employee/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error: any) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (id: number): Promise<any> => {
  try {
    const response = await api.delete<{
      success: boolean;
      data: null;
      message: string;
      statusCode: number;
    }>(`/admin/employee/${id}`);
    return response;
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};


