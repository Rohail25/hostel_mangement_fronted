import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export const OwnerBookings = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [user?.ownerProfile?.id])

  const fetchBookings = async () => {
    try {
      if (!user?.ownerProfile?.id) {
        console.error('No owner profile found')
        setLoading(false)
        return
      }

      // TODO: Implement API call to fetch owner's bookings
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
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
        <p className="text-gray-600 mt-2">View and manage all bookings for your hostels</p>
      </motion.div>

      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-600 text-lg">No bookings at this moment.</p>
      </div>
    </div>
  )
}

export default OwnerBookings
