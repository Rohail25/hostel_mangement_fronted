import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface TravelRead {
    id: number;
    title: string;
    author: string;
    readTime: string;
    image: string;
}

interface TravelReadsProps {
    reads: TravelRead[];
}

const TravelReads = ({ reads }: TravelReadsProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.querySelector('.read-card')?.clientWidth || 320;
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
                        Travel Reads
                    </h2>
                    <p className="text-lg text-gray-500">
                        Expert-curated, locally approved travel guides
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
                        {reads.map((read) => (
                            <Link
                                to="/hostels"
                                key={read.id}
                                className="read-card flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={read.image}
                                        alt={read.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Read Time Badge - Dark Green */}
                                    <div className="absolute bottom-3 left-3 bg-green-800 text-white px-3 py-1.5 rounded text-sm font-medium">
                                        {read.readTime}
                                    </div>
                                    {/* Navigation Arrow (on last card or overlay) */}
                                    {read.id === reads.length && (
                                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                                            <svg
                                                className="w-5 h-5 text-gray-900"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                        {read.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{read.author}</p>
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
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section>
    );
};

export default TravelReads;

