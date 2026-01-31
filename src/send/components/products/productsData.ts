export interface StayCategory {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
}

export interface RoomOption {
    id: string;
    title: string;
    description: string;
    details: string[];
}

export const stayCategories: StayCategory[] = [
    {
        id: 'second-home',
        title: 'Second Home',
        subtitle: 'Extended comfort for long stays',
        description:
            'Fully furnished rooms with dedicated workspaces, weekly housekeeping, and on-site support so you can settle in for weeks or even months.',
        highlights: [
            'Best for remote professionals, students, and relocations',
            'Flexible monthly billing with utilities included',
            'Kitchen access, storage solutions, and community events',
        ],
    },
    {
        id: 'bag-pack',
        title: 'Bag Pack',
        subtitle: 'Smart stays for short adventures',
        description:
            'Easy check-ins, shared amenities, and curated experiences for travellers who need a safe base while exploring the city.',
        highlights: [
            'Perfect for solo travellers, backpackers, and quick work trips',
            'Nightly pricing with free Wi-Fi and complimentary breakfast',
            'City guides, on-demand lockers, and 24/7 concierge',
        ],
    },
    {
        id: 'luxery-stays',
        title: 'Luxery Stays',
        subtitle: 'Premium suites for elevated getaways',
        description:
            'Designer suites, private balconies, and curated services for guests who want the finest hostelling experience in Pakistan.',
        highlights: [
            'Ideal for couples, executives, and celebratory retreats',
            'Concierge desk, airport transfers, and bespoke itineraries',
            'Access to spa partners, rooftop lounges, and fine dining',
        ],
    },
];

export const roomOptions: RoomOption[] = [
    {
        id: 'female',
        title: 'Women-Only Spaces',
        description:
            'Private or shared rooms with enhanced safety protocols, female staff support, and secure access.',
        details: ['Dedicated floors with CCTV coverage', 'Beauty and wellness add-ons', 'Group-friendly layouts'],
    },
    {
        id: 'male',
        title: 'Male Dorms & Studios',
        description:
            'Comfortable dormitories and studios designed for work and rest, with fitness tie-ups and community events.',
        details: ['Ergonomic beds & storage', 'Coworking zones nearby', 'Sports and gaming lounges'],
    },
    {
        id: 'family',
        title: 'Family Suites',
        description:
            'Flexible interconnecting rooms and spacious suites so families can stay together while enjoying privacy.',
        details: ['Baby-friendly amenities on request', 'Kitchenettes and laundry access', 'Concierge for local activities'],
    },
];

