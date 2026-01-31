import { Link } from 'react-router-dom';
import type { Hostel } from './types';
import HotelCard from './HotelCard';

interface HotelListProps {
    hostels: Hostel[];
    onSelectHostel: (hostel: Hostel) => void;
}

export const HotelList = ({ hostels, onSelectHostel }: HotelListProps) => {
    if (hostels.length === 0) {
        return (
            <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
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
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
                <HotelCard key={hostel.id} hostel={hostel} onSelect={onSelectHostel} />
            ))}
        </div>
    );
};

export default HotelList;

