import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotelFilters from '../components/hotel/HotelFilters';
import HotelList from '../components/hotel/HotelList';
import HotelDetailView from '../components/hotel/HotelDetailView';
import type {
    Floor,
    Hostel,
    HostelFilters as HostelFilterState,
    HostelPriceRange,
    HostelSortOption,
    HostelStarRating,
    RoomFiltersState,
    Seat,
    SeatStatus,
} from '../components/hotel/types';

type DetailTab = 'overview' | 'rooms' | 'gallery' | 'location';

const createSeat = (
    id: string,
    number: string,
    status: SeatStatus,
    occupantName?: string,
): Seat => ({
    id,
    number,
    status,
    ...(occupantName ? { occupantName } : {}),
});

const mockFloors: Floor[] = [
    {
        id: 'floor-1',
        number: '1',
        rooms: [
            {
                id: 'room-101',
                number: '101',
                seats: [
                    createSeat('s1', '1', 'available'),
                    createSeat('s2', '2', 'occupied', 'John Doe'),
                    createSeat('s3', '3', 'available'),
                    createSeat('s4', '4', 'occupied', 'Jane Smith'),
                ],
            },
            {
                id: 'room-102',
                number: '102',
                seats: [
                    createSeat('s5', '1', 'available'),
                    createSeat('s6', '2', 'available'),
                    createSeat('s7', '3', 'occupied', 'Bob Wilson'),
                    createSeat('s8', '4', 'available'),
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
                    createSeat('s9', '1', 'occupied', 'Alice Brown'),
                    createSeat('s10', '2', 'available'),
                    createSeat('s11', '3', 'available'),
                    createSeat('s12', '4', 'occupied', 'Charlie Green'),
                ],
            },
        ],
    },
];

const mockHostels: Hostel[] = [
    {
        id: 'pk-1',
        name: 'Karachi Seaview Hostel',
        city: 'Karachi',
        manager: 'Ahsan Raza',
        phone: '+92 21 3456 7890',
        address: '12 Clifton Block 5, Karachi',
        description:
            'Bright coastal hostel a few minutes from Clifton Beach with a rooftop chai lounge and shared co-working corner.',
        amenities: ['WiFi', 'AC', 'Laundry', 'Kitchen', 'Rooftop Café'],
        image: '/images/hotel-image1.avif',
        totalFloors: 4,
        totalRooms: 28,
        totalSeats: 112,
        availableSeats: 34,
        pricePerMonth: 24500,
        gender: 'coed',
        category: 'premium',
        starRating: 4,
    },
    {
        id: 'pk-2',
        name: 'Lahore Heritage Stay',
        city: 'Lahore',
        manager: 'Sadia Khan',
        phone: '+92 42 3895 4410',
        address: '73 Mall Road, Lahore',
        description:
            'Tastefully restored colonial residence near the Lahore Museum with leafy courtyards and serene study rooms.',
        amenities: ['WiFi', 'Study Lounge', 'Library', 'Breakfast Bar'],
        image: '/images/hotel-image2.avif',
        totalFloors: 3,
        totalRooms: 24,
        totalSeats: 96,
        availableSeats: 48,
        pricePerMonth: 21500,
        gender: 'girls',
        category: 'standard',
        starRating: 3,
    },
    {
        id: 'pk-3',
        name: 'Islamabad Margalla Residency',
        city: 'Islamabad',
        manager: 'Usman Dar',
        phone: '+92 51 2270 990',
        address: '8 F-7/4 Kohsar Road, Islamabad',
        description:
            'Calm, sunlit hostel tucked under the Margalla Hills with yoga decks, organic breakfasts, and high-speed connectivity.',
        amenities: ['WiFi', 'Yoga Deck', 'Gym', 'Organic Café', 'Laundry'],
        image: '/images/hotel-image3.avif',
        totalFloors: 5,
        totalRooms: 36,
        totalSeats: 144,
        availableSeats: 59,
        pricePerMonth: 28500,
        gender: 'coed',
        category: 'premium',
        starRating: 5,
    },
    {
        id: 'pk-4',
        name: 'Hunza Valley Retreat',
        city: 'Hunza',
        manager: 'Noorjehan Karim',
        phone: '+92 5813 740120',
        address: 'Altit Fort Road, Hunza',
        description:
            'Boutique alpine lodge with panoramic valley views, heated rooms, and guided treks for an unforgettable escape.',
        amenities: ['WiFi', 'Heated Rooms', 'Mountain Deck', 'Guided Treks', 'Bonfire Lounge'],
        image: '/images/hotel-image4.avif',
        totalFloors: 2,
        totalRooms: 18,
        totalSeats: 54,
        availableSeats: 12,
        pricePerMonth: 42000,
        gender: 'coed',
        category: 'luxury',
        starRating: 7,
    },
    {
        id: 'pk-5',
        name: 'Gwadar Marina Residence',
        city: 'Gwadar',
        manager: 'Rehan Baluch',
        phone: '+92 86 4501 223',
        address: '35 Marine Drive, Gwadar',
        description:
            'Seaside luxury hostel with private balconies, seafood dining, and a sunset infinity pool overlooking the Arabian Sea.',
        amenities: ['WiFi', 'Infinity Pool', 'Seafood Bistro', 'Concierge', 'Gym'],
        image: '/images/hotel-image5.avif',
        totalFloors: 6,
        totalRooms: 40,
        totalSeats: 160,
        availableSeats: 22,
        pricePerMonth: 45500,
        gender: 'boys',
        category: 'luxury',
        starRating: 7,
    },
    {
        id: 'pk-6',
        name: 'Multan Sufi Suites',
        city: 'Multan',
        manager: 'Hassan Gillani',
        phone: '+92 61 6200 145',
        address: '19 Ghanta Ghar Road, Multan',
        description:
            'Warm, art-filled hostel inspired by Multan’s Sufi heritage with community dinners and handicraft workshops.',
        amenities: ['WiFi', 'Community Kitchen', 'Prayer Room', 'Craft Studio'],
        image: '/images/hotel-image1.avif',
        totalFloors: 4,
        totalRooms: 26,
        totalSeats: 104,
        availableSeats: 31,
        pricePerMonth: 20500,
        gender: 'girls',
        category: 'standard',
        starRating: 3,
    },
    {
        id: 'pk-7',
        name: 'Peshawar Frontier Lodge',
        city: 'Peshawar',
        manager: 'Shahid Afridi',
        phone: '+92 91 2704 321',
        address: '4 University Town, Peshawar',
        description:
            'Characterful stay near Qissa Khwani Bazaar with secure bike parking, tea nooks, and Pashtun-style hospitality.',
        amenities: ['WiFi', 'Bike Storage', 'Tea Lounge', '24/7 Security'],
        image: '/images/hotel-image2.avif',
        totalFloors: 3,
        totalRooms: 22,
        totalSeats: 88,
        availableSeats: 40,
        pricePerMonth: 19000,
        gender: 'boys',
        category: 'standard',
        starRating: 3,
    },
    {
        id: 'pk-8',
        name: 'Faisalabad Textile Hub Hostel',
        city: 'Faisalabad',
        manager: 'Sehrish Tariq',
        phone: '+92 41 8712 887',
        address: '27 Susan Road, Faisalabad',
        description:
            'Modern co-living for young professionals with dedicated work pods, laundry valet, and artisanal chai every evening.',
        amenities: ['WiFi', 'Work Pods', 'Laundry Valet', 'Snack Bar'],
        image: '/images/hotel-image3.avif',
        totalFloors: 5,
        totalRooms: 35,
        totalSeats: 140,
        availableSeats: 76,
        pricePerMonth: 27500,
        gender: 'coed',
        category: 'premium',
        starRating: 4,
    },
    {
        id: 'pk-9',
        name: 'Quetta Juniper House',
        city: 'Quetta',
        manager: 'Mahnoor Yousafzai',
        phone: '+92 81 2840 567',
        address: '6 Zarghoon Road, Quetta',
        description:
            'Cozy hill-station hostel with geothermal heating, dry fruit café, and curated excursions to Hanna Lake.',
        amenities: ['WiFi', 'Geothermal Heating', 'Excursion Desk', 'Dry Fruit Café'],
        image: '/images/hotel-image4.avif',
        totalFloors: 3,
        totalRooms: 20,
        totalSeats: 80,
        availableSeats: 18,
        pricePerMonth: 26000,
        gender: 'girls',
        category: 'premium',
        starRating: 4,
    },
];

const initialFilters: HostelFilterState = {
    city: '',
    amenities: [],
    availability: false,
    priceRange: 'all',
    gender: 'all',
    starRating: 'all',
};

const initialRoomFilters: RoomFiltersState = {
    selectedFloor: '',
    searchQuery: '',
    showOnlyAvailable: false,
};

const Hostels = () => {
    const [hostels] = useState<Hostel[]>(mockHostels);
    const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
    const [activeTab, setActiveTab] = useState<DetailTab>('overview');
    const [filters, setFilters] = useState<HostelFilterState>(initialFilters);
    const [sortBy, setSortBy] = useState<HostelSortOption>('name');
    const [roomFilters, setRoomFilters] = useState<RoomFiltersState>(initialRoomFilters);

    const toggleAmenity = (amenity: string) => {
        setFilters((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((value) => value !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const filtersByPrice = (hostel: Hostel, priceRange: HostelPriceRange) => {
        switch (priceRange) {
            case 'low':
                return hostel.pricePerMonth <= 20000;
            case 'mid':
                return hostel.pricePerMonth > 20000 && hostel.pricePerMonth <= 26000;
            case 'high':
                return hostel.pricePerMonth > 26000 && hostel.pricePerMonth <= 32000;
            case 'premium':
                return hostel.pricePerMonth > 32000;
            default:
                return true;
        }
    };

    const filteredHostels = useMemo(() => {
        const result = hostels.filter((hostel) => {
            if (filters.city && hostel.city !== filters.city) {
                return false;
            }

            if (filters.starRating !== 'all' && hostel.starRating !== filters.starRating) {
                return false;
            }

            if (filters.amenities.length > 0) {
                const hasAllAmenities = filters.amenities.every((amenity) => hostel.amenities.includes(amenity));
                if (!hasAllAmenities) {
                    return false;
                }
            }

            if (filters.availability && hostel.availableSeats === 0) {
                return false;
            }

            if (filters.gender !== 'all' && hostel.gender !== filters.gender) {
                return false;
            }

            if (!filtersByPrice(hostel, filters.priceRange)) {
                return false;
            }

            return true;
        });

        return [...result].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rooms':
                    return b.totalRooms - a.totalRooms;
                case 'seats':
                    return b.totalSeats - a.totalSeats;
                case 'manager':
                    return a.manager.localeCompare(b.manager);
                case 'price':
                    return a.pricePerMonth - b.pricePerMonth;
                default:
                    return 0;
            }
        });
    }, [filters, hostels, sortBy]);

    const allAmenities = useMemo(
        () => Array.from(new Set(hostels.flatMap((hostel) => hostel.amenities))).sort(),
        [hostels],
    );

    const cities = useMemo(() => Array.from(new Set(hostels.map((hostel) => hostel.city))).sort(), [hostels]);

    const starRatings = useMemo(
        () => Array.from(new Set(hostels.map((hostel) => hostel.starRating))).sort((a, b) => a - b) as HostelStarRating[],
        [hostels],
    );

    const handleRoomFiltersChange = (next: RoomFiltersState) => {
        setRoomFilters(next);
    };

    const handleBackToList = () => {
        setSelectedHostel(null);
        setActiveTab('overview');
        setRoomFilters(initialRoomFilters);
    };

    if (selectedHostel) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <HotelDetailView
                    hostel={selectedHostel}
                    onBack={handleBackToList}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    floors={mockFloors}
                    roomFilters={roomFilters}
                    onRoomFiltersChange={handleRoomFiltersChange}
                />
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <div className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-6">
                    <nav className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Home</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">Hostels</span>
                    </nav>
                </div>
            </div>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Hostels</h1>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        Browse our carefully curated selection of hostels. Each property is managed with attention to detail and
                        commitment to quality.
                    </p>
                </div>
            </section>

            <HotelFilters
                filters={filters}
                amenities={allAmenities}
                sortBy={sortBy}
                cities={cities}
                starRatings={starRatings}
                onCityChange={(value) => setFilters((prev) => ({ ...prev, city: value }))}
                onToggleAmenity={toggleAmenity}
                onAvailabilityChange={(checked) => setFilters((prev) => ({ ...prev, availability: checked }))}
                onPriceRangeChange={(range) => setFilters((prev) => ({ ...prev, priceRange: range }))}
                onGenderChange={(gender) => setFilters((prev) => ({ ...prev, gender }))}
                onSortChange={setSortBy}
                onStarRatingChange={(rating) => setFilters((prev) => ({ ...prev, starRating: rating }))}
            />

            <section className="flex-1 py-12">
                <div className="container mx-auto px-6">
                    <HotelList
                        hostels={filteredHostels}
                        onSelectHostel={(hostel) => {
                            setSelectedHostel(hostel);
                            setActiveTab('overview');
                            setRoomFilters(initialRoomFilters);
                        }}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Hostels;

