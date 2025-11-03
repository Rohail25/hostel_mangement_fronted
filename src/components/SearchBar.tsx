import { useState } from 'react';

const SearchBar = () => {
  const [checkIn, setCheckIn] = useState('25 Oct');
  const [checkOut, setCheckOut] = useState('26 Oct');
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    console.log('Searching...', { destination, checkIn, checkOut });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Search Container */}
      <div className="bg-linear-to-br from-primary-50 to-secondary-50 rounded-3xl shadow-blue-xl p-8 border border-primary-100">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          {/* Destination Input */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Where to?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search Destination, Stay, or Trip"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-16 w-px bg-gray-300"></div>

          {/* Check-in */}
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full md:w-32 pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800 font-medium"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-8">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>

          {/* Check-out */}
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full md:w-32 pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800 font-medium"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto pt-8">
            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-12 py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-full font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-blue-lg"
            >
              Search
            </button>
          </div>
        </div>

        {/* Benefits Text */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
          <span className="text-primary-500 font-bold text-lg">✦</span>
          <p className="font-medium">
            Book directly and get best prices + enjoy early check-in, late check-out & exclusive deals*
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

