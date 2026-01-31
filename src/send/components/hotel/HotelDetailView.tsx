import { Link } from 'react-router-dom';
import RoomsSeatsVisualization from '../RoomsSeatsVisualization';
import type {
    Floor,
    Hostel,
    HostelGender,
    RoomFiltersState,
} from './types';

type DetailTab = 'overview' | 'rooms' | 'gallery' | 'location';

interface HotelDetailViewProps {
    hostel: Hostel;
    onBack: () => void;
    activeTab: DetailTab;
    onTabChange: (tab: DetailTab) => void;
    floors: Floor[];
    roomFilters: RoomFiltersState;
    onRoomFiltersChange: (next: RoomFiltersState) => void;
}

const tabConfig: { id: DetailTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Rooms & Seats' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'location', label: 'Location' },
];

const genderLabel = (gender: HostelGender) =>
    gender === 'coed' ? 'Co-ed' : gender === 'boys' ? 'Boys' : 'Girls';

interface GalleryImage {
    id: number;
    src: string;
}

const galleryImages: GalleryImage[] = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    src: `https://images.unsplash.com/photo-${1555854877 + index + 1}-bab0e564b8d5?w=400`,
}));

export const HotelDetailView = ({
    hostel,
    onBack,
    activeTab,
    onTabChange,
    floors,
    roomFilters,
    onRoomFiltersChange,
}: HotelDetailViewProps) => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 py-4">
            <div className="container mx-auto px-6">
                <nav className="flex items-center space-x-2 text-sm">
                    <Link to="/" className="text-gray-600 hover:text-primary-600">
                        Home
                    </Link>
                    <span className="text-gray-400">/</span>
                    <button type="button" onClick={onBack} className="text-gray-600 hover:text-primary-600">
                        Hostels
                    </button>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 font-medium">{hostel.name}</span>
                </nav>
            </div>
        </div>

        <div className="flex-1 py-8">
            <div className="container mx-auto px-6">
                <button
                    onClick={onBack}
                    className="mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Hostels
                </button>

                <div className="mb-8">
                    <img src={hostel.image} alt={hostel.name} className="w-full h-64 object-cover rounded-lg shadow-soft-lg" />
                </div>

                <div className="bg-white rounded-lg shadow-soft-lg overflow-hidden mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {tabConfig.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{hostel.name}</h2>
                                    <p className="text-gray-600 mb-6">{hostel.description}</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-primary-600">{hostel.totalFloors}</div>
                                        <div className="text-sm text-gray-600">Total Floors</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-primary-600">{hostel.totalRooms}</div>
                                        <div className="text-sm text-gray-600">Total Rooms</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-primary-600">{hostel.totalSeats}</div>
                                        <div className="text-sm text-gray-600">Total Seats</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-green-600">{hostel.availableSeats}</div>
                                        <div className="text-sm text-gray-600">Available Seats</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-xl font-bold text-primary-600">PKR {hostel.pricePerMonth.toLocaleString()}</div>
                                        <div className="text-sm text-gray-600">Per Month</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-xl font-bold text-gray-800">{genderLabel(hostel.gender)}</div>
                                        <div className="text-sm text-gray-600">Resident Type</div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <strong>Manager:</strong> {hostel.manager}
                                        </p>
                                        <p>
                                            <strong>Phone:</strong> {hostel.phone}
                                        </p>
                                        <p>
                                            <strong>Address:</strong> {hostel.address}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hostel.amenities.map((amenity) => (
                                            <span key={amenity} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rooms' && (
                            <RoomsSeatsVisualization
                                floors={floors}
                                selectedFloor={roomFilters.selectedFloor}
                                onFloorChange={(selectedFloor) => onRoomFiltersChange({ ...roomFilters, selectedFloor })}
                                showOnlyAvailable={roomFilters.showOnlyAvailable}
                                onShowOnlyAvailableChange={(showOnlyAvailable) =>
                                    onRoomFiltersChange({ ...roomFilters, showOnlyAvailable })
                                }
                                searchQuery={roomFilters.searchQuery}
                                onSearchQueryChange={(searchQuery) => onRoomFiltersChange({ ...roomFilters, searchQuery })}
                            />
                        )}

                        {activeTab === 'gallery' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {galleryImages.map((image) => (
                                    <div key={image.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                        <img src={image.src} alt={`Gallery ${image.id}`} className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div className="space-y-4">
                                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-gray-600 font-medium">Map Placeholder</p>
                                        <p className="text-gray-500 text-sm mt-2">{hostel.address}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default HotelDetailView;

