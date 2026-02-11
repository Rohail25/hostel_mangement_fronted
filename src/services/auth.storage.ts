/**
 * Auth Storage Utility
 * Manages authentication token and user data in localStorage
*/

export interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  role?: string | { id: number; name: string; description?: string } | null;
  roleType?: 'admin' | 'owner' | 'employee' | 'user' | string;
  status: string;
  createdAt: string;
  token: string;
}

const TOKEN_KEY = 'hm_auth_token';
const USER_KEY = 'hm_user_data';

/**
 * Store authentication token
 * @param token - JWT token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get authentication token
 * @returns Token string or null
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store user data
 * @param userData - User data object
 */
export const setUserData = (userData: UserData): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Get user data
 * @returns User data object or null
 */
export const getUserData = (): UserData | null => {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as UserData;
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const userData = getUserData();
  return !!(token && userData);
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get user role
 * @returns User role or null
 */
export const getUserRole = (): string | null => {
  const userData = getUserData();
  if (!userData) return null;
  if (userData.roleType) return userData.roleType;
  if (typeof userData.role === 'string') return userData.role;
  return userData.role?.name || null;
};

/**
 * Check if user has specific role
 * @param role - Role to check
 * @returns Boolean indicating if user has the role
 */
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

