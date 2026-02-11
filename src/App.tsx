import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Hostels from './pages/Hostels'
import Login from './pages/Login'
import Register from './pages/Register'
import { AdminRoutes } from './admin/routes/AdminRoutes'
import { OwnerRoutes } from './admin/routes/OwnerRoutes'
import { EmployeeRoutes } from './admin/routes/EmployeeRoutes'
import { UserRoutes } from './admin/routes/UserRoutes'
import { AuthProvider } from './admin/context/AuthContext'
import Contact from './pages/Contact.tsx'
import Destinations from './pages/Destinations.tsx'
import Franchises from './pages/Franchises.tsx'
import Career from './pages/Career.tsx'
import Merchandise from './pages/Merchandise.tsx'
import ZoHouses from './pages/ZoHouses.tsx'
import ZoTrips from './pages/ZoTrips.tsx'
import Zostel from './pages/Zostel.tsx'
import ZostelPlus from './pages/ZostelPlus.tsx'
import ZostelHomes from './pages/ZostelHomes.tsx'
import Privacy from './pages/Privacy.tsx'
import Cookies from './pages/Cookies.tsx'
import Terms from './pages/Terms.tsx'
import Jobs from './pages/Jobs'
import Blogs from './pages/Blogs'
import About from './pages/About'
import Onboarding from './pages/Onboarding'
import CustomerService from './pages/CustomerService'
import OwnerHotel from './pages/OwnerHotel'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/owner-hotel" element={<OwnerHotel />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/franchises" element={<Franchises />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/career" element={<Career />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/zo-houses" element={<ZoHouses />} />
          <Route path="/zo-trips" element={<ZoTrips />} />
          <Route path="/zostel" element={<Zostel />} />
          <Route path="/zostel-plus" element={<ZostelPlus />} />
          <Route path="/zostel-homes" element={<ZostelHomes />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/owner/*" element={<OwnerRoutes />} />
          <Route path="/employee/*" element={<EmployeeRoutes />} />
          <Route path="/user/*" element={<UserRoutes />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
