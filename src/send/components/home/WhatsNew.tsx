import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface HotelCard {
    id: number;
    image: string;
    badge: string;
    title: string;
    description: string;
}

interface WhatsNewProps {
    hotelCards: HotelCard[];
}

const WhatsNew = ({ hotelCards }: WhatsNewProps) => {
    const [currentCardSlide, setCurrentCardSlide] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setCardsPerView(4);
            } else if (window.innerWidth >= 1024) {
                setCardsPerView(3);
            } else if (window.innerWidth >= 768) {
                setCardsPerView(2);
            } else {
                setCardsPerView(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const effectivePerView = Math.min(cardsPerView, Math.max(1, hotelCards.length));
        const maxSlides = Math.max(0, hotelCards.length - effectivePerView);
        const interval = setInterval(() => {
            setCurrentCardSlide((prev) => {
                if (maxSlides === 0) return 0;
                return (prev + 1) % (maxSlides + 1);
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [hotelCards.length, cardsPerView]);

    useEffect(() => {
        const effectivePerView = Math.min(cardsPerView, Math.max(1, hotelCards.length));
        const maxSlides = Math.max(0, hotelCards.length - effectivePerView);
        if (currentCardSlide > maxSlides) {
            setCurrentCardSlide(0);
        }
    }, [cardsPerView, hotelCards.length, currentCardSlide]);

    const effectiveCardsPerView = Math.min(cardsPerView, Math.max(1, hotelCards.length));

    return (
        <section className="py-8 bg-white">
            <div className="w-full lg:w-[90%] mx-auto px-3 sm:px-8 lg:px-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What's New</h2>
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            gap: '1.5rem',
                            transform: `translateX(calc(-${currentCardSlide * (100 / effectiveCardsPerView)}% - ${currentCardSlide * 1.5}rem))`,
                        }}
                    >
                        {hotelCards.map((card) => {
                            const itemWidth = `calc((100% - ${(effectiveCardsPerView - 1) * 1.5}rem) / ${effectiveCardsPerView})`;
                            return (
                                <div
                                    key={card.id}
                                    className="flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border flex flex-col"
                                    style={{
                                        minHeight: '420px',
                                        width: itemWidth,
                                    }}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-green-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <span>✨</span>
                                            {card.badge}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                                            {card.description}
                                        </p>
                                        <div className="mt-auto">
                                            <Link
                                                to="/hostels"
                                                className="inline-flex items-center bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                            >
                                                Book Now →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatsNew;

