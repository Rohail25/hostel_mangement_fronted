import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../../services/apiClient'

export const EmployeeDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    assignedBookings: 0,
    tasksToday: 0,
    hostelName: '',
    occupiedBeds: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [user?.employeeProfile?.hostelId])

  const fetchDashboardData = async () => {
    try {
      if (!user?.employeeProfile?.hostelId) {
        console.error('No employee hostel assignment found')
        setLoading(false)
        return
      }

      // Fetch hostel and booking data for assigned hostel only
      const response = await api.get(`/hostel/${user.employeeProfile.hostelId}`)
      const hostel = response.data.data

      setStats({
        assignedBookings: hostel?._count?.bookings || 0,
        tasksToday: 0, // TODO: Fetch from tasks API
        hostelName: hostel?.name || 'Assigned Hostel',
        occupiedBeds: 0, // TODO: Fetch from allocation API
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
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Assigned Hostel',
            value: stats.hostelName,
            icon: '🏨',
            color: 'from-blue-500 to-blue-600',
          },
          {
            label: 'Bookings Today',
            value: stats.assignedBookings,
            icon: '📅',
            color: 'from-purple-500 to-purple-600',
          },
          {
            label: 'Tasks',
            value: stats.tasksToday,
            icon: '✅',
            color: 'from-green-500 to-green-600',
          },
          {
            label: 'Occupied Beds',
            value: stats.occupiedBeds,
            icon: '🛏️',
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

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Tasks</h2>
        <div className="text-center py-12 text-gray-500">
          <p>No tasks assigned for today</p>
        </div>
      </motion.div>
    </div>
  )
}

export default EmployeeDashboard
