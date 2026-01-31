interface PartnerCard {
    id: number;
    icon: string;
    title: string;
    description: string;
}

const PartnerWithZoWorld = () => {
    const partnerCards: PartnerCard[] = [
        {
            id: 1,
            icon: '🔑',
            title: 'Franchise with The City Hotling:',
            description: 'Open The City Hotling & Zo Stays in your destination.',
        },
        {
            id: 2,
            icon: '🧳',
            title: 'Partner with The City Hotling:',
            description: 'Travel agencies & Tour operators.',
        },
        {
            id: 3,
            icon: '📷',
            title: 'Become a The City Hotling Creator:',
            description: 'Travel, shoot videos, & inspire!',
        },
        {
            id: 4,
            icon: '🎒',
            title: 'Join The City Hotling Internship Program',
            description: '',
        },
        {
            id: 5,
            icon: '🎧',
            title: 'Perform at The City Hotling &',
            description: 'collab as artist.',
        },
    ];

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Title */}
                <div className="mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center">
                        Partner With Zo World
                    </h2>
                </div>

                {/* Partner Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
                    {partnerCards.map((card) => (
                        <div
                            key={card.id}
                            className="bg-gray-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col"
                        >
                            {/* Icon */}
                            <div className="text-6xl md:text-7xl mb-4 text-center flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))' }}>
                                {card.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {card.title}
                            </h3>

                            {/* Description */}
                            {card.description && (
                                <p className="text-gray-700 text-sm mb-4 flex-grow">
                                    {card.description}
                                </p>
                            )}

                            {/* Apply Now Button */}
                            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-auto">
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bottom Section: "hotling" with "follow your heart" */}
                <div className="relative mt-20 py-12">
                    {/* Large "hotling" Background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[150px] md:text-[250px] font-bold text-gray-200 select-none" style={{ fontFamily: 'cursive, serif', letterSpacing: '0.1em' }}>
                            Hotling
                        </div>
                    </div>

                    {/* "follow your heart" Text */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl md:text-6xl font-bold text-gray-900" style={{ fontFamily: 'cursive, serif' }}>
                            follow your
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-4xl md:text-6xl font-bold text-gray-900" style={{ fontFamily: 'cursive, serif' }}>
                                heart
                            </span>
                            <span className="text-5xl md:text-7xl" style={{ color: '#ef4444' }}>❤️</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerWithZoWorld;

