import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface Destination {
    id: number;
    city: string;
    region: string;
    image: string;
}

interface DestinationCarouselProps {
    title: string;
    destinations: Destination[];
}

const DestinationCarousel = ({ title, destinations }: DestinationCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.querySelector('.destination-card')?.clientWidth || 150;
            const gap = 24; // gap-6 = 24px
            const scrollAmount = cardWidth + gap;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        {title}
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
                        {destinations.map((destination) => (
                            <Link
                                to={`/hostels?city=${encodeURIComponent(destination.city)}`}
                                key={destination.id}
                                className="destination-card flex-shrink-0 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-full"
                            >
                                {/* Circular Image */}
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg mb-3">
                                    <img
                                        src={destination.image}
                                        alt={destination.city}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* City Name */}
                                <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">
                                    {destination.city}
                                </h3>
                                {/* Region */}
                                <p className="text-sm text-gray-600 text-center">
                                    {destination.region}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* Navigation Button */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white rounded-full p-3 md:p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110 z-10 border-2 border-gray-100"
                        aria-label="Scroll right"
                    >
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-gray-900"
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

export default DestinationCarousel;

