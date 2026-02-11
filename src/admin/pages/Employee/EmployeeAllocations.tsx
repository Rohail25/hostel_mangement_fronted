import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../../services/apiClient'

export const EmployeeAllocations = () => {
  const { user } = useAuth()
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllocations()
  }, [user?.employeeProfile?.hostelId])

  const fetchAllocations = async () => {
    try {
      if (!user?.employeeProfile?.hostelId) {
        console.error('No hostel assignment found')
        setLoading(false)
        return
      }

      // Fetch bed allocations for assigned hostel
      const response = await api.get(`/allocation/hostel/${user.employeeProfile.hostelId}`)
      setAllocations(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch allocations:', error)
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
        <h1 className="text-4xl font-bold text-gray-900">Bed Allocations</h1>
        <p className="text-gray-600 mt-2">View bed allocations in your hostel</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : allocations.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bed</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guest</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation: any, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{allocation.roomNumber || 'N/A'}</td>
                  <td className="px-6 py-4">{allocation.bedNumber || 'N/A'}</td>
                  <td className="px-6 py-4">{allocation.guestName || 'Unassigned'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {allocation.status || 'Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No bed allocations found.</p>
        </div>
      )}
    </div>
  )
}

export default EmployeeAllocations
