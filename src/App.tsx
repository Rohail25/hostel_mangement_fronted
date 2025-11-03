import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { AdminRoutes } from './admin/routes/AdminRoutes'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </div>
  )
}

export default App
