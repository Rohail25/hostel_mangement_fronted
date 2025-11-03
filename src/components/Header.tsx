// import { useState } from 'react';

const Header = () => {
  // const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // const toggleTheme = () => {
  //   setTheme(theme === 'light' ? 'dark' : 'light');
  // };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      {/* <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-wider">ZOSTEL</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search your next Zostel Homes"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle theme"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {theme === 'light' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                )}
              </svg>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span className="font-medium">Get the App</span>
            </button>

            <button className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
              Login
            </button>
          </div>
        </div>
      </div> */}

      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
           {/* Logo */}
           <a href="/" className="flex items-center space-x-2">
             <div className="w-10 h-10 bg-linear-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-blue">
               <span className="text-white font-bold text-xl">H</span>
             </div>
             <span className="text-2xl font-bold text-primary-600">HostelHub</span>
           </a>

           {/* Menu Items */}
           <ul className="hidden md:flex items-center gap-8">
             <li>
               <a
                 href="/"
                 className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
               >
                 Home
               </a>
             </li>
             <li>
               <a
                 href="/about"
                 className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
               >
                 About
               </a>
             </li>
             <li>
               <a
                 href="/rooms"
                 className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
               >
                 Rooms
               </a>
             </li>
             <li>
               <a
                 href="/facilities"
                 className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
               >
                 Facilities
               </a>
             </li>
             <li>
               <a
                 href="/gallery"
                 className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
               >
                 Gallery
               </a>
             </li>
             <li>
               <a
                 href="/contact"
                 className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
               >
                 Contact
               </a>
             </li>
           </ul>

           {/* Buttons */}
           <div className="flex items-center space-x-4">
             <a
               href="/book"
               className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-blue hover:shadow-blue-md transform hover:scale-105"
             >
               Book Now
             </a>
             <a
               href="/login"
               className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
             >
               Login
             </a>
           </div>

           {/* Mobile Menu Button */}
           <button
             className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
             aria-label="Toggle menu"
           >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>

    </header>
  );
};

export default Header;

