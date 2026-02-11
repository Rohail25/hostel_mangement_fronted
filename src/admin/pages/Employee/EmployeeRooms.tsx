import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../../services/apiClient'

export const EmployeeRooms = () => {
  const { user } = useAuth()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [user?.employeeProfile?.hostelId])

  const fetchRooms = async () => {
    try {
      if (!user?.employeeProfile?.hostelId) {
        console.error('No hostel assignment found')
        setLoading(false)
        return
      }

      // Fetch rooms for assigned hostel only
      const response = await api.get(`/room/hostel/${user.employeeProfile.hostelId}`)
      setRooms(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
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
        <h1 className="text-4xl font-bold text-gray-900">Rooms</h1>
        <p className="text-gray-600 mt-2">View rooms in your assigned hostel</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room: any, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900">{room.roomNumber || 'Room'}</h3>
              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-gray-600 text-sm">Capacity</p>
                  <p className="font-semibold">{room.capacity || 0} beds</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-semibold">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {room.status || 'Available'}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No rooms found in your assigned hostel.</p>
        </div>
      )}
    </div>
  )
}

export default EmployeeRooms
