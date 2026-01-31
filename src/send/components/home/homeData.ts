import hotelImage1 from '../../assets/images/hotel-image1.png';
import hotelImage2 from '../../assets/images/hotel-image2.png';
import hotelImage3 from '../../assets/images/hotel-image3.png';
import hotelImage4 from '../../assets/images/hotel-image4.png';
import hotelImage5 from '../../assets/images/hotel-image5.png';

export const hotelImages = [
    hotelImage1,
    hotelImage2,
    hotelImage3,
    hotelImage4,
    hotelImage5,
];

export const hotelCards = [
    {
        id: 1,
        image: hotelImage1,
        badge: 'Launch',
        title: 'Welcome to The City Hotling Karachi!',
        description: 'Experience luxury in the heart of Pakistan\'s largest city. Modern amenities with traditional hospitality.',
    },
    {
        id: 2,
        image: hotelImage2,
        badge: 'Launch',
        title: 'Discover The City Hotling Lahore!',
        description: 'Your gateway to the cultural capital of Pakistan. Perfect blend of history and modern comfort.',
    },
    {
        id: 3,
        image: hotelImage3,
        badge: 'New',
        title: 'The City Hotling Islamabad is here!',
        description: 'Nestled in the beautiful capital city. Enjoy scenic views and premium accommodations.',
    },
    {
        id: 4,
        image: hotelImage4,
        badge: 'Launch',
        title: 'Escape to The City Hotling Murree!',
        description: 'Your mountain retreat in the hills. Perfect for a peaceful getaway with breathtaking views.',
    },
    {
        id: 5,
        image: hotelImage5,
        badge: 'New',
        title: 'Adventure at The City Hotling Swat!',
        description: 'Your base for exploring the beautiful Swat Valley. Nature, adventure, and comfort combined.',
    },
];

export const pakistanDestinations = [
    { id: 1, city: 'Karachi', region: 'Sindh', category: 'Beach', image: hotelImage1 },
    { id: 2, city: 'Lahore', region: 'Punjab', category: 'City', image: hotelImage2 },
    { id: 3, city: 'Islamabad', region: 'Capital', category: 'Mountain', image: hotelImage3 },
    { id: 4, city: 'Murree', region: 'Punjab', category: 'Mountain', image: hotelImage4 },
    { id: 5, city: 'Swat', region: 'KPK', category: 'Mountain', image: hotelImage5 },
    { id: 6, city: 'Hunza', region: 'Gilgit-Baltistan', category: 'Mountain', image: hotelImage1 },
    { id: 7, city: 'Gwadar', region: 'Balochistan', category: 'Beach', image: hotelImage2 },
    { id: 8, city: 'Quetta', region: 'Balochistan', category: 'Desert', image: hotelImage3 },
    { id: 9, city: 'Peshawar', region: 'KPK', category: 'City', image: hotelImage4 },
    { id: 10, city: 'Multan', region: 'Punjab', category: 'City', image: hotelImage5 },
    { id: 11, city: 'Faisalabad', region: 'Punjab', category: 'City', image: hotelImage1 },
    { id: 12, city: 'Naran', region: 'KPK', category: 'Mountain', image: hotelImage2 },
    { id: 13, city: 'Rawalpindi', region: 'Punjab', category: 'City', image: hotelImage3 },
    { id: 14, city: 'Gujranwala', region: 'Punjab', category: 'City', image: hotelImage4 },
    { id: 15, city: 'Sialkot', region: 'Punjab', category: 'City', image: hotelImage5 },
    { id: 16, city: 'Sargodha', region: 'Punjab', category: 'City', image: hotelImage1 },
    { id: 17, city: 'Bahawalpur', region: 'Punjab', category: 'City', image: hotelImage2 },
    { id: 18, city: 'Sukkur', region: 'Sindh', category: 'City', image: hotelImage3 },
    { id: 19, city: 'Larkana', region: 'Sindh', category: 'City', image: hotelImage4 },
    { id: 20, city: 'Sheikhupura', region: 'Punjab', category: 'City', image: hotelImage5 },
    { id: 21, city: 'Kalam', region: 'KPK', category: 'Mountain', image: hotelImage1 },
    { id: 22, city: 'Nathiagali', region: 'KPK', category: 'Mountain', image: hotelImage2 },
    { id: 23, city: 'Shogran', region: 'KPK', category: 'Mountain', image: hotelImage3 },
    { id: 24, city: 'Malam Jabba', region: 'KPK', category: 'Mountain', image: hotelImage4 },
];

export const filterCategories = ['All', 'Mountain', 'Beach', 'City', 'Desert', 'Workation'];

export const mountainExperiences = [
    {
        id: 1,
        title: 'Experience Hunza Valley',
        dates: '15 Nov, 22 Nov & 3 more',
        price: 'From PKR 25,000/person',
        nights: 7,
        image: hotelImage1,
    },
    {
        id: 2,
        title: 'Experience Swat Valley',
        dates: '20 Nov, 27 Nov & 2 more',
        price: 'From PKR 18,500/person',
        nights: 5,
        image: hotelImage2,
    },
    {
        id: 3,
        title: 'Experience Naran Kaghan',
        dates: '10 Nov, 17 Nov & 4 more',
        price: 'From PKR 22,000/person',
        nights: 6,
        image: hotelImage3,
    },
    {
        id: 4,
        title: 'Experience Murree Hills',
        dates: '12 Nov, 19 Nov & 1 more',
        price: 'From PKR 15,000/person',
        nights: 4,
        image: hotelImage4,
    },
    {
        id: 5,
        title: 'Experience Skardu',
        dates: '18 Nov, 25 Nov & 2 more',
        price: 'From PKR 28,000/person',
        nights: 7,
        image: hotelImage5,
    },
    {
        id: 6,
        title: 'Experience Kalam Valley',
        dates: '14 Nov, 21 Nov & 3 more',
        price: 'From PKR 20,000/person',
        nights: 5,
        image: hotelImage1,
    },
    {
        id: 7,
        title: 'Experience Shogran',
        dates: '16 Nov, 23 Nov & 2 more',
        price: 'From PKR 17,500/person',
        nights: 4,
        image: hotelImage2,
    },
];

export const longStayProperties = [
    {
        id: 1,
        name: 'The City Hotling Murree',
        location: 'Murree',
        price: 'From PKR 2,500/night',
        image: hotelImage1,
    },
    {
        id: 2,
        name: 'The City Hotling Swat',
        location: 'Swat',
        price: 'From PKR 2,200/night',
        image: hotelImage2,
    },
    {
        id: 3,
        name: 'The City Hotling Hunza',
        location: 'Hunza',
        price: 'From PKR 3,000/night',
        image: hotelImage3,
    },
    {
        id: 4,
        name: 'The City Hotling Islamabad',
        location: 'Islamabad',
        price: 'From PKR 2,800/night',
        image: hotelImage4,
    },
    {
        id: 5,
        name: 'The City Hotling Naran',
        location: 'Naran',
        price: 'From PKR 2,400/night',
        image: hotelImage5,
    },
    {
        id: 6,
        name: 'The City Hotling Lahore',
        location: 'Lahore',
        price: 'From PKR 2,100/night',
        image: hotelImage1,
    },
    {
        id: 7,
        name: 'The City Hotling Karachi',
        location: 'Karachi',
        price: 'From PKR 2,300/night',
        image: hotelImage2,
    },
];

export const discoverProperties = [
    {
        id: 1,
        name: 'The City Hotling Karachi',
        location: 'Karachi',
        price: 'From PKR 2,500/night',
        image: hotelImage1,
        type: 'Second Home',
    },
    {
        id: 2,
        name: 'The City Hotling Lahore',
        location: 'Lahore',
        price: 'From PKR 2,200/night',
        image: hotelImage2,
        type: 'Bag Pack',
    },
    {
        id: 3,
        name: 'The City Hotling Islamabad',
        location: 'Islamabad',
        price: 'From PKR 2,800/night',
        image: hotelImage3,
        type: 'Luxery Stays',
    },
    {
        id: 4,
        name: 'The City Hotling Murree',
        location: 'Murree',
        price: 'From PKR 2,400/night',
        image: hotelImage4,
        type: 'Second Home',
    },
    {
        id: 5,
        name: 'The City Hotling Swat',
        location: 'Swat',
        price: 'From PKR 2,100/night',
        image: hotelImage5,
        type: 'Bag Pack',
    },
    {
        id: 6,
        name: 'The City Hotling Hunza',
        location: 'Hunza',
        price: 'From PKR 3,000/night',
        image: hotelImage1,
        type: 'Luxery Stays',
    },
    {
        id: 7,
        name: 'The City Hotling Naran',
        location: 'Naran',
        price: 'From PKR 2,300/night',
        image: hotelImage2,
        type: 'Second Home',
    },
    {
        id: 8,
        name: 'The City Hotling Peshawar',
        location: 'Peshawar',
        price: 'From PKR 2,000/night',
        image: hotelImage3,
        type: 'Bag Pack',
    },
];

export const propertyTypes = [
    { id: 4, name: 'All Hotels', icon: '#' },
    { id: 1, name: 'Second Home', icon: '✱' },
    { id: 2, name: 'Bag Pack', icon: '✈' },
    { id: 3, name: 'Luxery Stays', icon: '★' },
];

export const limitedTimeOffers = {
    mainOffer: {
        id: 1,
        title: 'The City Hotling Alleppey',
        location: 'Alleppey',
        originalPrice: 799,
        discountedPrice: 599,
        discount: 25,
        image: hotelImage1,
    },
    destinations: [
        { id: 1, name: 'Alleppey', image: hotelImage1 },
        { id: 2, name: 'Cheog', image: hotelImage2 },
        { id: 3, name: 'Vagamon', image: hotelImage3 },
        { id: 4, name: 'Manali', image: hotelImage4 },
    ],
};

export const zostelHomes = [
    {
        id: 1,
        name: 'The City Hotling Homes Murree',
        location: 'Murree',
        price: 'From ₹3,999/night',
        image: hotelImage1,
    },
    {
        id: 2,
        name: 'The City Hotling Homes Swat',
        location: 'Swat',
        price: 'From ₹2,999/night',
        image: hotelImage2,
    },
    {
        id: 3,
        name: 'The City Hotling Homes Hunza',
        location: 'Hunza',
        price: 'From ₹2,299/night',
        image: hotelImage3,
    },
    {
        id: 4,
        name: 'The City Hotling Homes Naran',
        location: 'Naran',
        price: 'From ₹4,674/night',
        image: hotelImage4,
    },
    {
        id: 5,
        name: 'The City Hotling Homes Skardu',
        location: 'Skardu',
        price: 'From ₹5,099/night',
        image: hotelImage5,
    },
];

export const tripsSellingOutFast = [
    {
        id: 1,
        title: 'Experience Hunza Valley Music Festival',
        dates: '17 Dec',
        price: 'From ₹22,856/person',
        nights: 7,
        image: hotelImage1,
    },
    {
        id: 2,
        title: 'Experience Swat Valley',
        dates: '17 Nov, 06 Dec & 3 more',
        price: 'From ₹44,442/person',
        nights: 8,
        image: hotelImage2,
    },
    {
        id: 3,
        title: 'Experience Naran Kaghan',
        dates: '28 Dec & 15 Jan',
        price: 'From ₹44,443/person',
        nights: 8,
        image: hotelImage3,
    },
    {
        id: 4,
        title: 'Experience Skardu',
        dates: '23 Nov',
        price: 'From ₹40,815/person',
        nights: 8,
        image: hotelImage4,
    },
    {
        id: 5,
        title: 'Experience Murree Hills',
        dates: '04 Dec & 01 Jan',
        price: 'From ₹43,810/person',
        nights: 7,
        image: hotelImage5,
    },
    {
        id: 6,
        title: 'Experience Kalam Valley',
        dates: '10 Dec & 20 Jan',
        price: 'From ₹38,500/person',
        nights: 6,
        image: hotelImage1,
    },
];

export const winterWanderlist = [
    { id: 1, city: 'Murree', region: 'Punjab', image: hotelImage1 },
    { id: 2, city: 'Swat', region: 'KPK', image: hotelImage2 },
    { id: 3, city: 'Hunza', region: 'Gilgit-Baltistan', image: hotelImage3 },
    { id: 4, city: 'Naran', region: 'KPK', image: hotelImage4 },
    { id: 5, city: 'Skardu', region: 'Gilgit-Baltistan', image: hotelImage5 },
    { id: 6, city: 'Kalam', region: 'KPK', image: hotelImage1 },
    { id: 7, city: 'Nathiagali', region: 'KPK', image: hotelImage2 },
    { id: 8, city: 'Shogran', region: 'KPK', image: hotelImage3 },
];

export const trendingNow = [
    { id: 1, city: 'Karachi', region: 'Sindh', image: hotelImage1 },
    { id: 2, city: 'Lahore', region: 'Punjab', image: hotelImage2 },
    { id: 3, city: 'Islamabad', region: 'Capital', image: hotelImage3 },
    { id: 4, city: 'Gwadar', region: 'Balochistan', image: hotelImage4 },
    { id: 5, city: 'Peshawar', region: 'KPK', image: hotelImage5 },
    { id: 6, city: 'Quetta', region: 'Balochistan', image: hotelImage1 },
    { id: 7, city: 'Multan', region: 'Punjab', image: hotelImage2 },
    { id: 8, city: 'Rawalpindi', region: 'Punjab', image: hotelImage3 },
];

export const exploreOffbeat = [
    { id: 1, city: 'Malam Jabba', region: 'KPK', image: hotelImage1 },
    { id: 2, city: 'Kalam', region: 'KPK', image: hotelImage2 },
    { id: 3, city: 'Nathiagali', region: 'KPK', image: hotelImage3 },
    { id: 4, city: 'Shogran', region: 'KPK', image: hotelImage4 },
    { id: 5, city: 'Kalash Valley', region: 'KPK', image: hotelImage5 },
    { id: 6, city: 'Chitral', region: 'KPK', image: hotelImage1 },
    { id: 7, city: 'Fairy Meadows', region: 'Gilgit-Baltistan', image: hotelImage2 },
    { id: 8, city: 'Deosai Plains', region: 'Gilgit-Baltistan', image: hotelImage3 },
];

export const partyEscapes: Array<{
    id: number;
    name: string;
    location: string;
    price: string;
    image: string;
    badgeType: 'snowflake' | 'shopping';
}> = [
        {
            id: 1,
            name: 'The City Hotling Karachi',
            location: 'Karachi',
            price: 'From ₹1,151/night',
            image: hotelImage1,
            badgeType: 'snowflake',
        },
        {
            id: 2,
            name: 'The City Hotling Plus Lahore',
            location: 'Lahore',
            price: 'From ₹989/night',
            image: hotelImage2,
            badgeType: 'snowflake',
        },
        {
            id: 3,
            name: 'The City Hotling Islamabad',
            location: 'Islamabad',
            price: 'From ₹1,399/night',
            image: hotelImage3,
            badgeType: 'shopping',
        },
        {
            id: 4,
            name: 'The City Hotling Murree',
            location: 'Murree',
            price: 'From ₹639/night',
            image: hotelImage4,
            badgeType: 'snowflake',
        },
        {
            id: 5,
            name: 'The City Hotling Swat',
            location: 'Swat',
            price: 'From ₹1,099/night',
            image: hotelImage5,
            badgeType: 'snowflake',
        },
    ];

export const topTripsForYou = [
    {
        id: 1,
        title: 'Experience Hunza Valley',
        dates: '17 Nov, 06 Dec & 3 more',
        price: 'From ₹44,442/person',
        nights: 8,
        image: hotelImage1,
    },
    {
        id: 2,
        title: 'Experience Swat Valley Adventure',
        dates: '04 Dec & 01 Feb',
        price: 'From ₹43,809/person',
        nights: 7,
        image: hotelImage2,
    },
    {
        id: 3,
        title: 'Experience Skardu',
        dates: '16 Nov, 23 Nov & 4 more',
        price: 'From ₹33,559/person',
        nights: 8,
        image: hotelImage3,
    },
];

export const weekendEscapes = [
    { id: 1, city: 'Murree', region: 'Punjab', image: hotelImage1 },
    { id: 2, city: 'Nathiagali', region: 'KPK', image: hotelImage2 },
    { id: 3, city: 'Shogran', region: 'KPK', image: hotelImage3 },
    { id: 4, city: 'Gwadar', region: 'Balochistan', image: hotelImage4 },
    { id: 5, city: 'Kalam', region: 'KPK', image: hotelImage5 },
    { id: 6, city: 'Swat', region: 'KPK', image: hotelImage1 },
    { id: 7, city: 'Naran', region: 'KPK', image: hotelImage2 },
    { id: 8, city: 'Malam Jabba', region: 'KPK', image: hotelImage3 },
];

export const budgetFriendly = [
    {
        id: 1,
        name: 'The City Hotling Hunza',
        location: 'Hunza',
        price: 'From ₹849/night',
        image: hotelImage1,
    },
    {
        id: 2,
        name: 'The City Hotling Lahore',
        location: 'Lahore',
        price: 'From ₹599/night',
        image: hotelImage2,
    },
    {
        id: 3,
        name: 'The City Hotling Karachi',
        location: 'Karachi',
        price: 'From ₹449/night',
        image: hotelImage3,
    },
    {
        id: 4,
        name: 'The City Hotling Skardu',
        location: 'Skardu',
        price: 'From ₹699/night',
        image: hotelImage4,
    },
    {
        id: 5,
        name: 'The City Hotling Murree',
        location: 'Murree',
        price: 'From ₹449/night',
        image: hotelImage5,
    },
];

export const lastMinuteEscapes = [
    { id: 1, city: 'Chitral', region: 'KPK', image: hotelImage1 },
    { id: 2, city: 'Kalash Valley', region: 'KPK', image: hotelImage2 },
    { id: 3, city: 'Gwadar', region: 'Balochistan', image: hotelImage3 },
    { id: 4, city: 'Fairy Meadows', region: 'Gilgit-Baltistan', image: hotelImage4 },
    { id: 5, city: 'Naran', region: 'KPK', image: hotelImage5 },
    { id: 6, city: 'Deosai Plains', region: 'Gilgit-Baltistan', image: hotelImage1 },
    { id: 7, city: 'Kalam', region: 'KPK', image: hotelImage2 },
    { id: 8, city: 'Malam Jabba', region: 'KPK', image: hotelImage3 },
    { id: 9, city: 'Shogran', region: 'KPK', image: hotelImage4 },
    { id: 10, city: 'Nathiagali', region: 'KPK', image: hotelImage5 },
];

export const travelReads = [
    {
        id: 1,
        title: 'Exploring Hunza Valley: A Complete Guide to Pakistan\'s Hidden Gem',
        author: 'Ahmed Khan',
        readTime: '10 mins read',
        image: hotelImage1,
    },
    {
        id: 2,
        title: 'Why You Need to Visit Swat Valley: Mountains, Lakes, and Culture',
        author: 'Ahmed Khan',
        readTime: '8 mins read',
        image: hotelImage2,
    },
    {
        id: 3,
        title: 'Discovering Skardu: The Gateway to Pakistan\'s Northern Wonders',
        author: 'Ahmed Khan',
        readTime: '9 mins read',
        image: hotelImage3,
    },
    {
        id: 4,
        title: 'The Soul of Northern Pakistan: A Journey Through Gilgit-Baltistan',
        author: 'Fatima Ali',
        readTime: '9 mins read',
        image: hotelImage4,
    },
    {
        id: 5,
        title: 'Murree Hills: A Winter Wonderland in Pakistan\'s Heartland',
        author: 'Ahmed Khan',
        readTime: '7 mins read',
        image: hotelImage5,
    },
    {
        id: 6,
        title: 'Gwadar: Pakistan\'s Emerging Coastal Paradise',
        author: 'Fatima Ali',
        readTime: '11 mins read',
        image: hotelImage1,
    },
    {
        id: 7,
        title: 'Naran Kaghan: The Ultimate Road Trip Through Pakistan\'s Mountains',
        author: 'Ahmed Khan',
        readTime: '12 mins read',
        image: hotelImage2,
    },
    {
        id: 8,
        title: 'Kalash Valley: Experiencing Pakistan\'s Unique Cultural Heritage',
        author: 'Fatima Ali',
        readTime: '8 mins read',
        image: hotelImage3,
    },
];

