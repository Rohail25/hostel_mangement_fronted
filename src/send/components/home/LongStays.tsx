import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Property {
    id: number;
    name: string;
    location: string;
    price: string;
    image: string;
}

interface LongStaysProps {
    properties: Property[];
}

const LongStays = ({ properties }: LongStaysProps) => {
    const [currentLongStaySlide, setCurrentLongStaySlide] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);

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

    const effectivePerView = Math.min(itemsPerView, Math.max(1, properties.length));

    useEffect(() => {
        setCurrentLongStaySlide(0);
        if (properties.length > 0) {
            const maxSlides = Math.max(0, properties.length - effectivePerView);
            if (maxSlides > 0) {
                const interval = setInterval(() => {
                    setCurrentLongStaySlide((prev) => (prev + 1) % (maxSlides + 1));
                }, 5000);

                return () => clearInterval(interval);
            }
        }
    }, [properties.length, effectivePerView]);

    return (
        <section className="py-10 bg-white">
            <div className="w-full lg:w-[90%] mx-auto px-3 sm:px-8 lg:px-12">
                <div className="mb-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                        The City Hotling Long Stays for Digital Nomads
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        Our long-stay plans include high-speed internet, social experiences, and access to all
                        hostel amenities, making it easy to balance work and wanderlust.
                    </p>
                </div>

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            gap: '1.5rem',
                            transform: `translateX(calc(-${currentLongStaySlide * (100 / effectivePerView)}% - ${currentLongStaySlide * 1.5}rem))`,
                        }}
                    >
                        {properties.map((property) => {
                            const itemWidth = `calc((100% - ${(effectivePerView - 1) * 1.5}rem) / ${effectivePerView})`;
                            return (
                                <Link
                                    to="/hostels"
                                    key={property.id}
                                    className="flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                                    style={{
                                        width: itemWidth,
                                    }}
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={property.image}
                                            alt={property.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Icon Badge */}
                                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                                            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{property.name}</h3>
                                        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                                        <p className="text-lg font-semibold text-primary-600">{property.price}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LongStays;

