import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/apiClient'
import { getToken, getUserData, setToken, setUserData, clearAuthData } from '../../services/auth.storage'

export interface Permission {
  resource: string
  action: string
  permission: string
}

interface User {
  id: number
  username: string
  email: string
  phone: string
  isAdmin: boolean
  role: {
    id: number
    name: string
    description: string
  } | null
  roleType: 'admin' | 'owner' | 'employee' | 'user'
  permissions?: Permission[] // Permissions for employees
  ownerProfile?: {
    id: number
    ownerCode: string
    name: string
  }
  employeeProfile?: {
    id: number
    employeeCode: string
    designation: string
    hostelId: number
  }
  status: string
  createdAt: string
  token: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  hasPermission: (resource: string, action: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = getToken()
    const storedUser = getUserData()

    if (storedUser && storedToken) {
      setUser(storedUser as User)
    } else {
      // Legacy key migration
      const legacyUser = localStorage.getItem('user')
      const legacyToken = localStorage.getItem('token')

      if (legacyUser && legacyToken) {
        try {
          const parsedUser = JSON.parse(legacyUser) as User
          setUser(parsedUser)
          setUserData(parsedUser)
          setToken(legacyToken)
        } catch (error) {
          console.error('Error parsing legacy user:', error)
          clearAuthData()
        } finally {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      } else if (storedUser || storedToken || legacyUser || legacyToken) {
        clearAuthData()
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password })
      
      if (response.success && response.data) {
        const userData = response.data
        
        // Store in state and localStorage
        setUser(userData)
        setUserData(userData)
        setToken(userData.token)
        
        // Redirect based on role
        const roleType = userData.roleType || 'user'
        switch (roleType) {
          case 'admin':
            navigate('/admin/overview')
            break
          case 'owner':
            navigate('/owner/overview')
            break
          case 'employee':
            navigate('/employee/overview')
            break
          default:
            navigate('/user/overview')
        }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Login failed')
    }
  }

  const logout = () => {
    setUser(null)
    clearAuthData()
    navigate('/login')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      setUserData(updatedUser)
    }
  }

  // Check if user has a specific permission
  const hasPermission = (resource: string, action: string): boolean => {
    // Admin has all permissions
    if (user?.isAdmin || user?.roleType === 'admin') {
      return true
    }
    
    // Owner has all permissions (data is filtered by backend, but UI shows all)
    if (user?.roleType === 'owner') {
      return true
    }
    
    // Check if user has the specific permission
    if (user?.permissions && user.permissions.length > 0) {
      return user.permissions.some(
        perm => perm.resource === resource && perm.action === action
      )
    }
    
    return false
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    hasPermission
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
