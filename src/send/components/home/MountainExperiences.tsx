import { useState, useEffect } from 'react';

interface Experience {
    id: number;
    title: string;
    dates: string;
    price: string;
    nights: number;
    image: string;
}

interface MountainExperiencesProps {
    experiences: Experience[];
}

const MountainExperiences = ({ experiences }: MountainExperiencesProps) => {
    const [currentExperienceSlide, setCurrentExperienceSlide] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);
    const [comingSoonMessage, setComingSoonMessage] = useState<string | null>(null);

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

    const effectivePerView = Math.min(itemsPerView, Math.max(1, experiences.length));

    useEffect(() => {
        setCurrentExperienceSlide(0);
        if (experiences.length > 0) {
            const maxSlides = Math.max(0, experiences.length - effectivePerView);
            if (maxSlides > 0) {
                const interval = setInterval(() => {
                    setCurrentExperienceSlide((prev) => (prev + 1) % (maxSlides + 1));
                }, 5000);

                return () => clearInterval(interval);
            }
        }
    }, [experiences.length, effectivePerView]);

    useEffect(() => {
        if (!comingSoonMessage) return;

        const timer = setTimeout(() => setComingSoonMessage(null), 3000);
        return () => clearTimeout(timer);
    }, [comingSoonMessage]);

    const handleComingSoon = (title: string) => {
        setComingSoonMessage(`Coming soon: ${title}`);
    };

    return (
        <section className="py-10 bg-white">
            <div className="w-full lg:w-[90%] mx-auto px-3 sm:px-8 lg:px-12">
                <div className="mb-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                        Explore the Pakistani Mountains
                    </h2>
                    <p className="text-lg text-gray-600">
                        Join us for weeklong trips to epic mountain locations across Pakistan!
                    </p>
                </div>

                {comingSoonMessage && (
                    <div className="mb-6 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-primary-700 shadow-sm">
                        {comingSoonMessage}
                    </div>
                )}

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            gap: '1.5rem',
                            transform: `translateX(calc(-${currentExperienceSlide * (100 / effectivePerView)}% - ${currentExperienceSlide * 1.5}rem))`,
                        }}
                    >
                        {experiences.map((experience) => {
                            const itemWidth = `calc((100% - ${(effectivePerView - 1) * 1.5}rem) / ${effectivePerView})`;
                            return (
                                <button
                                    key={experience.id}
                                    type="button"
                                    onClick={() => handleComingSoon(experience.title)}
                                    className="flex-shrink-0 text-left bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                                    style={{
                                        width: itemWidth,
                                    }}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={experience.image}
                                            alt={experience.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Nights Badge */}
                                        <div className="absolute bottom-3 left-3 bg-gray-900 bg-opacity-75 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                            {experience.nights} Nights
                                        </div>
                                        {/* Lightning Icon */}
                                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                                            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                                        <p className="text-gray-600 text-sm mb-2">{experience.dates}</p>
                                        <p className="text-lg font-semibold text-primary-600">{experience.price}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MountainExperiences;

