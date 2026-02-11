import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../../services/apiClient'

export const EmployeeBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [user?.employeeProfile?.hostelId])

  const fetchBookings = async () => {
    try {
      if (!user?.employeeProfile?.hostelId) {
        console.error('No hostel assignment found')
        setLoading(false)
        return
      }

      // Fetch bookings for assigned hostel only
      const response = await api.get(`/booking/hostel/${user.employeeProfile.hostelId}`)
      setBookings(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">Manage bookings for your assigned hostel</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : bookings.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guest</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-in</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{booking.guestName || 'N/A'}</td>
                  <td className="px-6 py-4">{booking.roomNumber || 'N/A'}</td>
                  <td className="px-6 py-4">{booking.checkInDate || 'N/A'}</td>
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
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No bookings for your assigned hostel.</p>
        </div>
      )}
    </div>
  )
}

export default EmployeeBookings
