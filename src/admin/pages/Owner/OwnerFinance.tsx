import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export const OwnerFinance = () => {
  const { user } = useAuth()

  useEffect(() => {
    // Fetch financial data
    const fetchFinance = async () => {
      try {
        // TODO: Implement API call to fetch owner's financial data
      } catch (error) {
        console.error('Failed to fetch finance data:', error)
      }
    }

    fetchFinance()
  }, [user?.ownerProfile?.id])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900">Finance</h1>
        <p className="text-gray-600 mt-2">View your revenue and financial reports</p>
      </motion.div>

      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-600 text-lg">No financial data available yet.</p>
      </div>
    </div>
  )
}

export default OwnerFinance
