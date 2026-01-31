import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import PromoBanner from './PromoBanner';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      {/* First Row: Logo and Search Bar */}
      <div className="w-full px-3 sm:px-8 lg:px-12 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-blue">
            </div>
            <span className="text-3xl font-semibold image.png text-primary-700 tracking-wide">The City Hotling</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-3xl">
              <input
                type="text"
                placeholder="Search your next stay"
                className="w-full rounded-full border border-gray-200 pl-12 pr-16 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 shadow-soft"
              />
              <button
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white rounded-full w-11 h-11 grid place-items-center hover:bg-black transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />
                  <path d="M20 20l-3.5-3.5" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              aria-label="Toggle theme"
              className="hidden sm:inline-flex w-12 h-12 rounded-full border border-gray-200 items-center justify-center text-gray-700 hover:text-primary-600 hover:border-primary-300 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M17 7l1.4-1.4M5.6 18.4L7 17" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <Link
              to="/blogs"
              className="hidden md:inline-flex items-center rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Read Blogs
            </Link>
            <Link
              to="/login"
              className="hidden md:inline-flex items-center rounded-full bg-black text-white px-6 py-3 text-sm font-semibold shadow-soft hover:bg-gray-900 transition-colors"
            >
              Login Owners
            </Link>
            <button
              className="inline-flex md:hidden items-center justify-center rounded-full border border-gray-200 w-12 h-12 text-gray-700 hover:text-primary-600 hover:border-primary-300 transition-colors"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tablet & Desktop Navigation */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 h-16">
          <ul className="flex items-center gap-6 pl-8 md:pl-12 lg:pl-16">
            <li>
              <Link
                to="/"
                className={`font-medium transition-colors ${location.pathname === '/'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700  hover:text-primary-600'
                  }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/hostels"
                className={`font-medium transition-colors ${location.pathname === '/hostels'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                Hotels
              </Link>
            </li>
            <li>
              <Link
                to="/onboarding"
                className={`font-medium transition-colors ${location.pathname === '/onboarding'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                Onboarding
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`font-medium transition-colors ${location.pathname === '/products'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className={`font-medium transition-colors ${location.pathname === '/blogs'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/blogs/blog-1"
                className={`font-medium transition-colors ${location.pathname.startsWith('/blogs/') && location.pathname !== '/blogs'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                Blog Detail
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className={`font-medium transition-colors ${location.pathname === '/jobs'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link
                to="/merchandise"
                className={`font-medium transition-colors ${location.pathname === '/merchandise'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                Merchandise
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`font-medium transition-colors ${location.pathname === '/contact'
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-4 text-sm font-semibold">
            <Link
              to="/hostels"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Looking for Hostel
            </Link>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-5 py-2.5 hover:bg-black transition-colors"
            >
              Onboarding
            </Link>
          </div>
        </div>
      </nav>
      <PromoBanner />
      {/* Menu Drawer */}
      {mobileMenuOpen && (
        <div className="pb-4 border-t border-gray-200 mt-2 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto w-full">
          <ul className="flex flex-col gap-4 pt-4">
            <li>
              <Link
                to="/"
                className={`block font-medium transition-colors ${location.pathname === '/'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/hostels"
                className={`block font-medium transition-colors ${location.pathname === '/hostels'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Hotels
              </Link>
            </li>
            <li>
              <Link
                to="/onboarding"
                className={`block font-medium transition-colors ${location.pathname === '/onboarding'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Onboarding
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`block font-medium transition-colors ${location.pathname === '/products'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className={`block font-medium transition-colors ${location.pathname === '/blogs'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/blogs/blog-1"
                className={`block font-medium transition-colors ${location.pathname.startsWith('/blogs/') && location.pathname !== '/blogs'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog Detail
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className={`block font-medium transition-colors ${location.pathname === '/jobs'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link
                to="/merchandise"
                className={`block font-medium transition-colors ${location.pathname === '/merchandise'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Merchandise
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`block font-medium transition-colors ${location.pathname === '/contact'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200 items-center">
            <Link
              to="/login"
              className="inline-flex w-full max-w-[160px] justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center mx-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/hostels"
              className="inline-flex w-full max-w-[160px] justify-center px-4 py-2 bg-primary-600 text-black border border-black rounded-lg font-medium hover:bg-primary-700 transition-colors text-center mx-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              Looking for Hostel
            </Link>
            <Link
              to="/onboarding"
              className="inline-flex w-full max-w-[160px] justify-center px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors text-center mx-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              Onboarding
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

