import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface PartyEscape {
    id: number;
    name: string;
    location: string;
    price: string;
    image: string;
    badgeType: 'snowflake' | 'shopping';
}

interface PartyEscapesProps {
    escapes: PartyEscape[];
}

const PartyEscapes = ({ escapes }: PartyEscapesProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.querySelector('.escape-card')?.clientWidth || 320;
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
                        Party Escapes
                    </h2>
                    <p className="text-lg text-gray-500">
                        Zostels with the best vibes
                    </p>
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
                        {escapes.map((escape) => (
                            <Link
                                to="/hostels"
                                key={escape.id}
                                className="escape-card flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={escape.image}
                                        alt={escape.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Badge Icon */}
                                    <div className={`absolute top-3 right-3 rounded-full p-2 shadow-md ${escape.badgeType === 'snowflake'
                                        ? 'bg-pink-500'
                                        : 'bg-gray-800'
                                        }`}>
                                        {escape.badgeType === 'snowflake' ? (
                                            <svg
                                                className="w-5 h-5 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.651a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.651a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{escape.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{escape.location}</p>
                                    <p className="text-lg font-semibold text-gray-900">{escape.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Navigation Button */}
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

export default PartyEscapes;

