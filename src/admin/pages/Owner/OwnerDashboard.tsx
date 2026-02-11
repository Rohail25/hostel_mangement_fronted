import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../../services/apiClient'

export const OwnerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalHostels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [user?.ownerProfile?.id])

  const fetchDashboardData = async () => {
    try {
      if (!user?.ownerProfile?.id) {
        console.error('No owner profile found')
        return
      }

      // Fetch owner's hostels and related data
      const response = await api.get(`/hostel/owner/${user.ownerProfile.id}`)
      const hostels = response.data.data || []

      setStats({
        totalHostels: hostels.length,
        totalBookings: hostels.reduce((sum: number, h: any) => sum + (h._count?.bookings || 0), 0),
        totalRevenue: hostels.reduce((sum: number, h: any) => sum + (h.revenue || 0), 0),
        occupancyRate: hostels.length > 0 ? Math.random() * 100 : 0, // Placeholder
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.username}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Hostels',
            value: stats.totalHostels,
            icon: '🏨',
            color: 'from-blue-500 to-blue-600',
          },
          {
            label: 'Total Bookings',
            value: stats.totalBookings,
            icon: '📅',
            color: 'from-purple-500 to-purple-600',
          },
          {
            label: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: '💰',
            color: 'from-green-500 to-green-600',
          },
          {
            label: 'Occupancy Rate',
            value: `${stats.occupancyRate.toFixed(1)}%`,
            icon: '📊',
            color: 'from-orange-500 to-orange-600',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="text-center py-12 text-gray-500">
          <p>No recent bookings to display</p>
        </div>
      </motion.div>
    </div>
  )
}

export default OwnerDashboard
