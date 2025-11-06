import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RoomsSeatsVisualization from '../components/RoomsSeatsVisualization';

interface Hostel {
  id: string;
  name: string;
  manager: string;
  phone: string;
  address: string;
  description: string;
  amenities: string[];
  image: string;
  totalFloors: number;
  totalRooms: number;
  totalSeats: number;
  availableSeats: number;
}

// Mock data
const mockHostels: Hostel[] = [
  {
    id: '1',
    name: 'City Center Hostel',
    manager: 'John Smith',
    phone: '+1 234-567-8900',
    address: '123 Main Street, Downtown',
    description: 'Modern hostel in the heart of the city with excellent amenities and easy access to public transport.',
    amenities: ['WiFi', 'AC', 'Laundry', 'Kitchen'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    totalFloors: 3,
    totalRooms: 24,
    totalSeats: 96,
    availableSeats: 42,
  },
  {
    id: '2',
    name: 'University Hostel',
    manager: 'Sarah Johnson',
    phone: '+1 234-567-8901',
    address: '456 College Ave, University District',
    description: 'Student-friendly hostel near the university campus with study areas and quiet zones.',
    amenities: ['WiFi', 'Study Room', 'Gym', 'Cafeteria'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    totalFloors: 4,
    totalRooms: 32,
    totalSeats: 128,
    availableSeats: 67,
  },
  {
    id: '3',
    name: 'Green Valley Hostel',
    manager: 'Mike Davis',
    phone: '+1 234-567-8902',
    address: '789 Park Road, Green Valley',
    description: 'Eco-friendly hostel with garden spaces and sustainable practices.',
    amenities: ['WiFi', 'Garden', 'Recycling', 'Bike Storage'],
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800',
    totalFloors: 2,
    totalRooms: 16,
    totalSeats: 64,
    availableSeats: 28,
  },
];

// Mock floors data for visualization
const mockFloors = [
  {
    id: 'floor-1',
    number: '1',
    rooms: [
      {
        id: 'room-101',
        number: '101',
        seats: [
          { id: 's1', number: '1', status: 'available' as const },
          { id: 's2', number: '2', status: 'occupied' as const, occupantName: 'John Doe' },
          { id: 's3', number: '3', status: 'available' as const },
          { id: 's4', number: '4', status: 'occupied' as const, occupantName: 'Jane Smith' },
        ],
      },
      {
        id: 'room-102',
        number: '102',
        seats: [
          { id: 's5', number: '1', status: 'available' as const },
          { id: 's6', number: '2', status: 'available' as const },
          { id: 's7', number: '3', status: 'occupied' as const, occupantName: 'Bob Wilson' },
          { id: 's8', number: '4', status: 'available' as const },
        ],
      },
    ],
  },
  {
    id: 'floor-2',
    number: '2',
    rooms: [
      {
        id: 'room-201',
        number: '201',
        seats: [
          { id: 's9', number: '1', status: 'occupied' as const, occupantName: 'Alice Brown' },
          { id: 's10', number: '2', status: 'available' as const },
          { id: 's11', number: '3', status: 'available' as const },
          { id: 's12', number: '4', status: 'occupied' as const, occupantName: 'Charlie Green' },
        ],
      },
    ],
  },
];

const Hostels = () => {
  const [hostels] = useState<Hostel[]>(mockHostels);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'gallery' | 'location'>('overview');
  const [filters, setFilters] = useState({
    city: '',
    amenities: [] as string[],
    availability: false,
  });
  const [sortBy, setSortBy] = useState<'name' | 'rooms' | 'seats' | 'manager'>('name');
  
  // Rooms & Seats visualization filters
  const [roomFilters, setRoomFilters] = useState({
    selectedFloor: '',
    searchQuery: '',
    showOnlyAvailable: false,
  });

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const filteredHostels = hostels
    .filter((hostel) => {
      if (filters.city && !hostel.address.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity) =>
          hostel.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      if (filters.availability && hostel.availableSeats === 0) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rooms':
          return b.totalRooms - a.totalRooms;
        case 'seats':
          return b.totalSeats - a.totalSeats;
        case 'manager':
          return a.manager.localeCompare(b.manager);
        default:
          return 0;
      }
    });

  const allAmenities = Array.from(new Set(hostels.flatMap((h) => h.amenities)));

  if (selectedHostel) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
              <span className="text-gray-400">/</span>
              <Link to="/hostels" className="text-gray-600 hover:text-primary-600">Hostels</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{selectedHostel.name}</span>
            </nav>
          </div>
        </div>

        {/* Detail View */}
        <div className="flex-1 py-8">
          <div className="container mx-auto px-6">
            <button
              onClick={() => setSelectedHostel(null)}
              className="mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Hostels
            </button>

            {/* Hero Banner */}
            <div className="mb-8">
              <img
                src={selectedHostel.image}
                alt={selectedHostel.name}
                className="w-full h-64 object-cover rounded-lg shadow-soft-lg"
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-soft-lg overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'rooms', label: 'Rooms & Seats' },
                    { id: 'gallery', label: 'Gallery' },
                    { id: 'location', label: 'Location' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedHostel.name}</h2>
                      <p className="text-gray-600 mb-6">{selectedHostel.description}</p>
                    </div>

                    {/* Quick Facts */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary-600">{selectedHostel.totalFloors}</div>
                        <div className="text-sm text-gray-600">Total Floors</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary-600">{selectedHostel.totalRooms}</div>
                        <div className="text-sm text-gray-600">Total Rooms</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary-600">{selectedHostel.totalSeats}</div>
                        <div className="text-sm text-gray-600">Total Seats</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{selectedHostel.availableSeats}</div>
                        <div className="text-sm text-gray-600">Available Seats</div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-2 text-gray-600">
                        <p><strong>Manager:</strong> {selectedHostel.manager}</p>
                        <p><strong>Phone:</strong> {selectedHostel.phone}</p>
                        <p><strong>Address:</strong> {selectedHostel.address}</p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHostel.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rooms & Seats Tab */}
                {activeTab === 'rooms' && (
                  <RoomsSeatsVisualization
                    floors={mockFloors}
                    selectedFloor={roomFilters.selectedFloor}
                    onFloorChange={(floorId) => setRoomFilters({ ...roomFilters, selectedFloor: floorId })}
                    showOnlyAvailable={roomFilters.showOnlyAvailable}
                    onShowOnlyAvailableChange={(value) => setRoomFilters({ ...roomFilters, showOnlyAvailable: value })}
                    searchQuery={roomFilters.searchQuery}
                    onSearchQueryChange={(query) => setRoomFilters({ ...roomFilters, searchQuery: query })}
                  />
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-${1555854877 + i}-bab0e564b8d5?w=400`}
                          alt={`Gallery ${i}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-4">
                    <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-600 font-medium">Map Placeholder</p>
                        <p className="text-gray-500 text-sm mt-2">{selectedHostel.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Hostels</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Hostels</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse our carefully curated selection of hostels. Each property is managed with attention to detail and commitment to quality.
          </p>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 flex-1">
              {/* City/Area Filter */}
              <input
                type="text"
                placeholder="Search by city/area..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />

              {/* Amenities Checkboxes */}
              <div className="flex flex-wrap gap-2">
                {allAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>

              {/* Availability Toggle */}
              <label className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
                  className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Available Only</span>
              </label>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="name">Name</option>
                <option value="rooms">Rooms</option>
                <option value="seats">Seats</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Hostels Listing */}
      <section className="flex-1 py-12">
        <div className="container mx-auto px-6">
          {filteredHostels.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hostels found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or check back later.</p>
              <Link
                to="/"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHostels.map((hostel) => (
                <div
                  key={hostel.id}
                  className="bg-white rounded-lg shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-1 overflow-hidden"
                >
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{hostel.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{hostel.description}</p>
                    
                    {/* Quick Info */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {hostel.manager}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {hostel.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hostel.address}
                    </div>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hostel.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hostel.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          +{hostel.amenities.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedHostel(hostel)}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hostels;

