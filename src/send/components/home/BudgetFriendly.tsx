import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface BudgetProperty {
    id: number;
    name: string;
    location: string;
    price: string;
    image: string;
}

interface BudgetFriendlyProps {
    properties: BudgetProperty[];
}

const BudgetFriendly = ({ properties }: BudgetFriendlyProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.querySelector('.budget-card')?.clientWidth || 320;
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
                        Budget Friendly
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
                        {properties.map((property) => (
                            <Link
                                to="/hostels"
                                key={property.id}
                                className="budget-card flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={property.image}
                                        alt={property.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Pink Asterisk Badge */}
                                    <div className="absolute top-3 right-3 bg-pink-500 rounded-full p-2 shadow-md">
                                        <span className="text-white text-lg font-bold">✱</span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{property.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                                    <p className="text-lg font-semibold text-gray-900">{property.price}</p>
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

export default BudgetFriendly;

