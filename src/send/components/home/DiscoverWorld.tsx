import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Property {
    id: number;
    name: string;
    location: string;
    price: string;
    image: string;
}

interface PropertyType {
    id: number;
    name: string;
    icon: string;
}

interface DiscoverWorldProps {
    properties: Array<Property & { type?: string }>;
    propertyTypes: PropertyType[];
}

const DiscoverWorld = ({ properties, propertyTypes }: DiscoverWorldProps) => {
    const [activeType, setActiveType] = useState<string>(
        propertyTypes.length > 0 ? propertyTypes[0].name : ''
    );
    const navigate = useNavigate();

    const handleTypeClick = (typeName: string) => {
        setActiveType(typeName);
        if (typeName === 'All Hotels') {
            navigate('/hostels');
        }
    };

    const filteredProperties =
        activeType && activeType !== 'All Hotels'
            ? properties.filter((property) => {
                const propertyType = property.type
                    ? property.type.replace(/\s+/g, '').toLowerCase()
                    : '';
                const targetType = activeType.replace(/\s+/g, '').toLowerCase();
                return propertyType === targetType;
            })
            : properties;

    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-6">
                {/* Title with Icon */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: 'cursive, serif' }}>
                        Discover The City Hotling
                    </h2>
                    <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 mb-5 justify-center">
                    {propertyTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleTypeClick(type.name)}
                            className={`px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors border flex items-center gap-3 min-w-[160px] sm:min-w-[200px] justify-center ${activeType === type.name
                                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 shadow-sm'
                                }`}
                        >
                            <span
                                className={`${activeType === type.name
                                    ? 'bg-white text-gray-900'
                                    : 'bg-gray-100 text-gray-500'
                                    } inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px]`}
                            >
                                {type.icon}
                            </span>
                            <span className="whitespace-nowrap">{type.name}</span>
                        </button>
                    ))}
                </div>

                {/* Subtitle */}
                <p className="text-gray-600 mb-6 text-center">
                    Vibrant stays for solo travellers and groups of friends in awe-inspiring locations
                </p>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {filteredProperties.map((property) => (
                        <Link
                            to="/hostels"
                            key={property.id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all block"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Bookmark Icon */}
                                <button
                                    className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full p-1.5 shadow-md hover:bg-opacity-100 transition-colors"
                                    aria-label="Save property"
                                >
                                    <span className="text-pink-400 text-lg">✱</span>
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{property.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                                <p className="text-sm text-gray-500">{property.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-6">
                    <Link
                        to="/hostels"
                        className="inline-flex items-center gap-2 bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md"
                    >
                        Explore The City Hotling
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DiscoverWorld;

