import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Destination {
    id: number;
    city: string;
    region: string;
    category: string;
    image: string;
}

interface DestinationsProps {
    destinations: Destination[];
    filterCategories: string[];
}

const Destinations = ({ destinations, filterCategories }: DestinationsProps) => {
    const [destinationSearch, setDestinationSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);

    const filteredDestinations = destinations.filter((dest) => {
        const matchesSearch =
            dest.city.toLowerCase().includes(destinationSearch.toLowerCase()) ||
            dest.region.toLowerCase().includes(destinationSearch.toLowerCase());
        const matchesFilter = activeFilter === 'All' || dest.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setItemsPerView(4);
            } else if (window.innerWidth >= 1024) {
                setItemsPerView(3);
            } else if (window.innerWidth >= 640) {
                setItemsPerView(2);
            } else {
                setItemsPerView(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const effectiveItemsPerView = Math.min(itemsPerView, Math.max(1, filteredDestinations.length));

    useEffect(() => {
        setCurrentSlide(0);
        const maxSlides = Math.max(0, filteredDestinations.length - effectiveItemsPerView);
        if (maxSlides > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % (maxSlides + 1));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [filteredDestinations.length, destinationSearch, activeFilter, effectiveItemsPerView]);

    const handlePrev = () => {
        const maxSlides = Math.max(0, filteredDestinations.length - effectiveItemsPerView);
        setCurrentSlide((prev) => (prev === 0 ? maxSlides : prev - 1));
    };

    const handleNext = () => {
        const maxSlides = Math.max(0, filteredDestinations.length - effectiveItemsPerView);
        setCurrentSlide((prev) => (prev === maxSlides ? 0 : prev + 1));
    };

    const showNavigation = filteredDestinations.length > effectiveItemsPerView;

    return (
        <section className="py-8 bg-white">
            <div className="w-full lg:w-[90%] mx-auto px-3 sm:px-8 lg:px-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Destinations</h2>

                {/* Filters and Search - One Line */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    {/* Search Bar - First */}
                    <div className="relative w-full md:w-auto md:min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Search cities..."
                            value={destinationSearch}
                            onChange={(e) => setDestinationSearch(e.target.value)}
                            className="w-full rounded-full border border-gray-300 pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                            aria-label="Search"
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary-600 text-white rounded-full w-9 h-9 grid place-items-center hover:bg-primary-700 transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                <path d="M20 20l-3.5-3.5" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>

                    {/* Filter Buttons - After Search */}
                    <div className="flex flex-wrap gap-3 flex-1">
                        {filterCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${activeFilter === category
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Destination Slider - 4 columns */}
                {filteredDestinations.length > 0 ? (
                    <div className="relative">
                        <div className="relative overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{
                                    gap: '1.5rem',
                                    transform: `translateX(calc(-${currentSlide * (100 / effectiveItemsPerView)}% - ${currentSlide * 1.5}rem))`,
                                }}
                            >
                                {filteredDestinations.map((destination: Destination) => {
                                    const itemWidth = `calc((100% - ${(effectiveItemsPerView - 1) * 1.5}rem) / ${effectiveItemsPerView})`;
                                    return (
                                        <div
                                            key={destination.id}
                                            className="flex-shrink-0 text-center"
                                            style={{
                                                width: itemWidth,
                                            }}
                                        >
                                            <Link
                                                to={`/hostels?city=${encodeURIComponent(destination.city)}`}
                                                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[2.5rem]"
                                            >
                                                <div className="relative mb-4">
                                                    <div className="w-36 h-36 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto rounded-full overflow-hidden shadow-lg transition-all group-hover:shadow-xl">
                                                        <img
                                                            src={destination.image}
                                                            alt={destination.city}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1 transition-colors group-hover:text-primary-600">
                                                    {destination.city}
                                                </h3>
                                                <p className="text-gray-600 text-sm">{destination.region}</p>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        {showNavigation && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    aria-label="Previous"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    aria-label="Next"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No destinations found matching your search.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Destinations;

