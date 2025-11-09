import type { ChangeEvent } from 'react';
import type {
    HostelFilters,
    HostelPriceRange,
    HostelSortOption,
    HostelGender,
} from './types';

interface HotelFiltersProps {
    filters: HostelFilters;
    amenities: string[];
    sortBy: HostelSortOption;
    onCityChange: (value: string) => void;
    onToggleAmenity: (amenity: string) => void;
    onAvailabilityChange: (checked: boolean) => void;
    onPriceRangeChange: (range: HostelPriceRange) => void;
    onGenderChange: (gender: 'all' | HostelGender) => void;
    onSortChange: (sort: HostelSortOption) => void;
}

const priceRangeOptions: { value: HostelPriceRange; label: string }[] = [
    { value: 'all', label: 'Any' },
    { value: 'low', label: 'Below PKR 20k' },
    { value: 'mid', label: 'PKR 20k - 26k' },
    { value: 'high', label: 'PKR 26k - 32k' },
    { value: 'premium', label: 'Above PKR 32k' },
];

const genderOptions: { value: 'all' | HostelGender; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'girls', label: 'Girls' },
    { value: 'boys', label: 'Boys' },
    { value: 'coed', label: 'Co-ed' },
];

const sortOptions: { value: HostelSortOption; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'rooms', label: 'Rooms' },
    { value: 'seats', label: 'Seats' },
    { value: 'manager', label: 'Manager' },
    { value: 'price', label: 'Price' },
];

export const HotelFilters = ({
    filters,
    amenities,
    sortBy,
    onCityChange,
    onToggleAmenity,
    onAvailabilityChange,
    onPriceRangeChange,
    onGenderChange,
    onSortChange,
}: HotelFiltersProps) => {
    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        onCityChange(event.target.value);
    };

    const handleAmenitiesChange = (amenity: string) => {
        onToggleAmenity(amenity);
    };

    const handleAvailabilityChange = (event: ChangeEvent<HTMLInputElement>) => {
        onAvailabilityChange(event.target.checked);
    };

    return (
        <section className="py-6 bg-white border-b border-gray-200">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-4 flex-1">
                        <input
                            type="text"
                            placeholder="Search by city/area..."
                            value={filters.city}
                            onChange={handleCityChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />

                        <div className="flex flex-wrap gap-2">
                            {amenities.map((amenity) => {
                                const checked = filters.amenities.includes(amenity);
                                return (
                                    <label
                                        key={amenity}
                                        className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${checked ? 'bg-primary-50 border border-primary-200' : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => handleAmenitiesChange(amenity)}
                                            className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{amenity}</span>
                                    </label>
                                );
                            })}
                        </div>

                        <label className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={filters.availability}
                                onChange={handleAvailabilityChange}
                                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Available Only</span>
                        </label>

                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Price</span>
                            <select
                                value={filters.priceRange}
                                onChange={(event) => onPriceRangeChange(event.target.value as HostelPriceRange)}
                                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
                            >
                                {priceRangeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">For</span>
                            <select
                                value={filters.gender}
                                onChange={(event) => onGenderChange(event.target.value as 'all' | HostelGender)}
                                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
                            >
                                {genderOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(event) => onSortChange(event.target.value as HostelSortOption)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HotelFilters;

