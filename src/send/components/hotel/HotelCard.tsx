import { Link } from 'react-router-dom';
import type { Hostel } from './types';

interface HotelCardProps {
    hostel: Hostel;
    onSelect: (hostel: Hostel) => void;
}

export const HotelCard = ({ hostel, onSelect }: HotelCardProps) => {
    const genderLabel =
        hostel.gender === 'coed' ? 'Co-ed' : hostel.gender === 'boys' ? 'Boys' : 'Girls';
    const genderClass =
        hostel.gender === 'girls'
            ? 'bg-pink-50 text-pink-600'
            : hostel.gender === 'boys'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-gray-100 text-gray-700';
    const isLuxury = hostel.category === 'luxury';
    const starLabel = `${hostel.starRating}-Star`;

    return (
        <div className="bg-white rounded-lg shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
            <img src={hostel.image} alt={hostel.name} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{hostel.name}</h3>
                <div className="flex items-center justify-between mb-3 gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-semibold whitespace-nowrap">
                        PKR {hostel.pricePerMonth.toLocaleString()}/month
                    </span>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-semibold whitespace-nowrap">
                            <span aria-hidden="true">★</span>
                            {starLabel}
                        </span>
                        {isLuxury && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                                Luxury
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${genderClass}`}>
                            {genderLabel}
                        </span>
                    </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{hostel.description}</p>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    {hostel.manager}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                    </svg>
                    {hostel.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span>
                        <span className="font-medium text-gray-700">{hostel.city}</span>
                        <span className="block text-gray-500">{hostel.address}</span>
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {hostel.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                            {amenity}
                        </span>
                    ))}
                    {hostel.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            +{hostel.amenities.length - 3}
                        </span>
                    )}
                </div>

                <div className="flex gap-3 mt-auto">
                    <button
                        onClick={() => onSelect(hostel)}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                        View Details
                    </button>
                    <Link
                        to="/contact"
                        className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold transition-colors text-sm text-center inline-flex items-center justify-center"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;

