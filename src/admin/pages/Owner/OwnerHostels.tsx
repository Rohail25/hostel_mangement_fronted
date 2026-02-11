import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../../services/apiClient'

export const OwnerHostels = () => {
  const { user } = useAuth()
  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOwnerHostels()
  }, [user?.ownerProfile?.id])

  const fetchOwnerHostels = async () => {
    try {
      if (!user?.ownerProfile?.id) {
        console.error('No owner profile found')
        setLoading(false)
        return
      }

      const response = await api.get(`/hostel/owner/${user.ownerProfile.id}`)
      setHostels(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch hostels:', error)
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
        <h1 className="text-4xl font-bold text-gray-900">My Hostels</h1>
        <p className="text-gray-600 mt-2">Manage all your hostels and properties</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : hostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel: any, index) => (
            <motion.div
              key={hostel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{hostel.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{hostel.city || 'City not specified'}</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Rooms</p>
                    <p className="text-lg font-semibold">{hostel._count?.rooms || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Beds</p>
                    <p className="text-lg font-semibold">{hostel._count?.beds || 0}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No hostels found. Create your first hostel to get started.</p>
        </div>
      )}
    </div>
  )
}

export default OwnerHostels
