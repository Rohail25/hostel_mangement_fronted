import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../../services/apiClient'

export const UserDashboard = () => {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserBookings()
  }, [user?.id])

  const fetchUserBookings = async () => {
    try {
      if (!user?.id) {
        console.error('No user ID found')
        setLoading(false)
        return
      }

      // Fetch bookings for the logged-in user only
      const response = await api.get(`/booking/user/${user.id}`)
      setBookings(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
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
          <h1 className="text-4xl font-bold text-gray-900">My Dashboard</h1>
        </div>
      </motion.div>

      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Account Information</h2>
        <div className="space-y-2">
          <div>
            <p className="text-blue-200">Email</p>
            <p className="text-lg">{user?.email}</p>
          </div>
          <div>
            <p className="text-blue-200">Phone</p>
            <p className="text-lg">{user?.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-blue-200">Member Since</p>
            <p className="text-lg">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </motion.div>

      {/* My Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hostel</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-in</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-out</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: any, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{booking.hostelName || 'N/A'}</td>
                    <td className="px-6 py-4">{booking.checkInDate || 'N/A'}</td>
                    <td className="px-6 py-4">{booking.checkOutDate || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {booking.status || 'Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>You haven't made any bookings yet.</p>
          </div>
        )}
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <button
          onClick={logout}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Logout
        </button>
      </motion.div>
    </div>
  )
}

export default UserDashboard
