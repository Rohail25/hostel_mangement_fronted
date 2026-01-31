import { useState, useRef, useEffect } from 'react';

interface Destination {
    id: number;
    name: string;
    image: string;
}

interface MainOffer {
    id: number;
    title: string;
    location: string;
    originalPrice: number;
    discountedPrice: number;
    discount: number;
    image: string;
}

interface LimitedTimeOffersProps {
    mainOffer: MainOffer;
    destinations: Destination[];
}

const LimitedTimeOffers = ({ mainOffer, destinations }: LimitedTimeOffersProps) => {
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const [activeOffer, setActiveOffer] = useState(mainOffer);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActiveOffer(mainOffer);
        setCurrentDestinationIndex(0);
    }, [mainOffer]);

    const applyDestination = (index: number) => {
        const destination = destinations[index];
        if (!destination) return;

        setActiveOffer({
            ...mainOffer,
            title: `The City Hotling ${destination.name}`,
            location: destination.name,
            image: destination.image,
        });
        setCurrentDestinationIndex(index);
    };

    const scrollDestinations = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = 200; // Approximate card width with gap
            const scrollAmount = cardWidth;
            let newIndex = currentDestinationIndex;

            if (direction === 'right') {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                newIndex = Math.min(currentDestinationIndex + 1, destinations.length - 1);
            } else {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                newIndex = Math.max(currentDestinationIndex - 1, 0);
            }

            if (newIndex !== currentDestinationIndex) {
                applyDestination(newIndex);
            }
        }
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Limited Time Offers
                    </h2>
                    <p className="text-lg text-gray-500">
                        Grab these deals before they're gone!
                    </p>
                </div>

                {/* Main Offer Card */}
                <div className="relative mb-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl h-[500px] md:h-[600px]">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={activeOffer.image}
                                alt={activeOffer.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex flex-col justify-between p-8 md:p-12">
                            {/* Title */}
                            <div>
                                <h3
                                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                                    style={{ fontFamily: 'cursive, serif' }}
                                >
                                    {activeOffer.title}
                                </h3>
                            </div>

                            {/* Offer Details */}
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                                <div className="flex items-start gap-4">
                                    {/* Icon Badge */}
                                    <div className="bg-pink-300 rounded-full p-2.5 flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">✱</span>
                                    </div>

                                    {/* Price Details */}
                                    <div className="text-white">
                                        <p className="text-lg md:text-xl mb-2">{activeOffer.location}</p>
                                        <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
                                            <span className="text-sm md:text-base">Offers from</span>
                                            <span className="text-lg md:text-xl line-through opacity-75">
                                                ₹{activeOffer.originalPrice}
                                            </span>
                                            <span className="text-3xl md:text-4xl font-bold">
                                                ₹{activeOffer.discountedPrice}
                                            </span>
                                            <span className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm md:text-base font-bold">
                                                {activeOffer.discount}% OFF
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Explore Button */}
                                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg">
                                    Explore
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                            <button
                                onClick={() => scrollDestinations('left')}
                                disabled={currentDestinationIndex === 0}
                                className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Scroll left"
                            >
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scrollDestinations('right')}
                                disabled={currentDestinationIndex >= destinations.length - 1}
                                className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Scroll right"
                            >
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Small Destination Cards Overlay */}
                        <div className="absolute bottom-6 right-6 md:right-24 w-auto max-w-[calc(100%-3rem)] md:max-w-md">
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-4 overflow-x-auto scrollbar-hide"
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                {destinations.map((destination, index) => (
                                    <div
                                        key={destination.id}
                                        className={`flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform ${index === currentDestinationIndex ? 'ring-2 ring-offset-2 ring-white scale-105' : 'hover:scale-105'}`}
                                        onClick={() => {
                                            applyDestination(index);
                                            if (scrollContainerRef.current) {
                                                const cards = scrollContainerRef.current.children;
                                                const card = cards[index] as HTMLElement | undefined;
                                                card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                applyDestination(index);
                                            }
                                        }}
                                    >
                                        <div className="relative h-full">
                                            <img
                                                src={destination.image}
                                                alt={destination.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <p className="text-white font-semibold text-base md:text-lg">{destination.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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

export default LimitedTimeOffers;

