import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { AdminLayout } from '../layout/AdminLayout'

// Reuse existing admin panel pages
const Overview = React.lazy(() => import('../pages/Overview'))
const PeopleHub = React.lazy(() => import('../pages/People/PeopleHub'))
const HostelList = React.lazy(() => import('../pages/Hostel/HostelList'))
const HostelView = React.lazy(() => import('../pages/Hostel/HostelView'))
const SettingsForm = React.lazy(() => import('../pages/Settings/SettingsForm'))

export const EmployeeRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={['employee']}>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-slate-600">Loading...</p>
            </div>
          </div>
        }
      >
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/employee/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="people" element={<PeopleHub />} />
            <Route path="hostel" element={<HostelList />} />
            <Route path="hostel/:id" element={<HostelView />} />
            <Route path="settings" element={<SettingsForm />} />
            <Route path="*" element={<Navigate to="/employee/overview" replace />} />
          </Route>
        </Routes>
      </React.Suspense>
    </ProtectedRoute>
  )
}
