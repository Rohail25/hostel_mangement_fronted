import { Link } from 'react-router-dom'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100 text-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-16 space-y-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_45px_90px_-70px_rgba(15,23,42,0.35)] px-6 sm:px-8 py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:w-[56rem]">
            <div className="space-y-5 max-w-xl">
              <h3 className="text-3xl font-semibold">Download Hotling App</h3>
              <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-xl">😀</span>
                  <span>Get a seamless booking experience during your trips.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">🗺️</span>
                  <span>Explore nearby hotspots with curated local maps.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">🤝</span>
                  <span>Receive event updates and connect with Hotling travellers.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">🏅</span>
                  <span>Complete quests, earn Zo credit, and unlock loyalty perks.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-4">
              <a
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <p className="text-xs text-gray-500 max-w-xs text-right">
                Join thousands of travelers and hostel owners using Hotling to make travel easier.
              </p>
            </div>
          </div>

          <div className="flex-1 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Explore Hotling</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/hostels" className="hover:text-primary-600 transition-colors">Hostels</Link></li>
                <li><Link to="/destinations" className="hover:text-primary-600 transition-colors">Destinations</Link></li>
                <li><Link to="/blogs" className="hover:text-primary-600 transition-colors">Blogs</Link></li>
                <li><Link to="/blogs/blog-1" className="hover:text-primary-600 transition-colors">Blog Detail</Link></li>
                <li><Link to="/merchandise" className="hover:text-primary-600 transition-colors">Merchandise</Link></li>
                <li><Link to="/jobs" className="hover:text-primary-600 transition-colors">Jobs</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Partner &amp; Support</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/onboarding" className="hover:text-primary-600 transition-colors">Onboarding</Link></li>
                <li><Link to="/owner-hotel" className="hover:text-primary-600 transition-colors">Owner Hotel</Link></li>
                <li><Link to="/customer-service" className="hover:text-primary-600 transition-colors">Customer Service</Link></li>
                <li><Link to="/contact" className="hover:text-primary-600 transition-colors">Contact us</Link></li>
                <li><a href="mailto:care@hotling.com" className="hover:text-primary-600 transition-colors">care@hotling.com</a></li>
                <li><a href="tel:+922111234567" className="hover:text-primary-600 transition-colors">+92 21 112 345 67</a></li>
              </ul>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Follow us</p>
                <div className="flex items-center gap-3 text-gray-500">
                  <a href="https://instagram.com" aria-label="Instagram" className="hover:text-primary-600 transition-colors">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm5.5-3c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z" />
                    </svg>
                  </a>
                  <a href="https://youtube.com" aria-label="YouTube" className="hover:text-primary-600 transition-colors">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 15l5.19-3L10 9z" />
                      <path d="M21.8 8.001s-.195-1.377-.795-1.984C20.28 5.2 19.5 5.2 19.14 5.154 16.081 5 12 5 12 5s-4.081 0-7.14.154C4.5 5.2 3.72 5.2 3 6.017 2.4 6.624 2.2 8.001 2.2 8.001S2 9.748 2 11.496v1.007c0 1.748.2 3.495.2 3.495s.195 1.377.795 1.984c.72.817 1.665.792 2.085.878C6.919 19 12 19 12 19s4.081 0 7.14-.154c.36-.046 1.14-.046 1.86-.863.6-.607.8-1.984.8-1.984s.2-1.748.2-3.495v-1.007c0-1.748-.2-3.495-.2-3.495z" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-primary-600 transition-colors">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.984 3.5c0 1.381-1.11 2.5-2.484 2.5C1.107 6 0 4.881 0 3.5 0 2.12 1.105 1 2.516 1c1.373 0 2.468 1.12 2.468 2.5zM.533 22V7.5h3.867V22H.533zM8.067 7.5H11.8v1.975h.055C12.6 8.63 14.13 7 16.733 7 21.267 7 22 9.515 22 13.13V22h-3.867v-7.52c0-1.793-.033-4.096-2.5-4.096-2.5 0-2.883 1.953-2.883 3.97V22H8.067V7.5z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com" aria-label="X" className="hover:text-primary-600 transition-colors">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.98 2.01h-2.78L13.4 9.31 8.83 2.01H1l8.96 13.53L1.32 21.99h2.78l5.22-7.7 4.94 7.7H23l-9.17-13.82 7.15-11.16z" />
                    </svg>
                  </a>
                  <a href="https://facebook.com" aria-label="Facebook" className="hover:text-primary-600 transition-colors">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.97h-2.34V22c4.78-.8 8.44-4.94 8.44-9.93z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-primary-600 transition-colors">Cookie Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary-600 transition-colors">Terms &amp; Conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-gray-600 border-t border-gray-100 pt-6">
          <p>© {year} Hotling. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold">PKR • Urdu / English</span>
          </div>
          <div className="flex items-center gap-5 font-medium">
            <Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-primary-600 transition-colors">Cookies</Link>
            <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

