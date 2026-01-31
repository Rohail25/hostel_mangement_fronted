import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface Trip {
    id: number;
    title: string;
    dates: string;
    price: string;
    nights: number;
    image: string;
}

interface TripsSellingOutFastProps {
    trips: Trip[];
}

const TripsSellingOutFast = ({ trips }: TripsSellingOutFastProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.querySelector('.trip-card')?.clientWidth || 320;
            const gap = 24; // gap-6 = 24px
            const scrollAmount = cardWidth + gap;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Trips Selling Out Fast
                    </h2>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Scrollable Cards */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {trips.map((trip) => (
                            <Link
                                to="/hostels"
                                key={trip.id}
                                className="trip-card flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                            >
                                {/* Image Container */}
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={trip.image}
                                        alt={trip.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Nights Badge - Dark Grey */}
                                    <div className="absolute bottom-3 left-3 bg-gray-800 text-white px-3 py-1.5 rounded text-sm font-medium">
                                        {trip.nights} Nights
                                    </div>
                                    {/* Lightning Bolt Icon */}
                                    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                                        <svg
                                            className="w-5 h-5 text-gray-900"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{trip.dates}</p>
                                    <p className="text-lg font-semibold text-gray-700">{trip.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Navigation Button - Large Circular Button */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white rounded-full p-5 md:p-6 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-10 border-2 border-gray-100"
                        aria-label="Scroll right"
                    >
                        <svg
                            className="w-7 h-7 md:w-8 md:h-8 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default TripsSellingOutFast;

