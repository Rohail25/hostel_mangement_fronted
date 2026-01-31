import { Link } from 'react-router-dom';
import { hotelCards } from '../home/homeData';

const FeaturedHotels = () => {
    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Handpicked hostels for every category</h2>
                        <p className="mt-3 text-gray-600 max-w-2xl">
                            Whether you prefer the long-term ease of Second Home or the thrill packed into Bag Pack, these properties
                            are ready for you. Filter on the hostels page to see even more across Pakistan.
                        </p>
                    </div>
                    <Link
                        to="/hostels"
                        className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                    >
                        View all hostels
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {hotelCards.slice(0, 6).map((card) => (
                        <article key={card.id} className="rounded-3xl overflow-hidden border border-gray-100 shadow-lg bg-white">
                            <div className="relative h-56">
                                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                                {card.badge && (
                                    <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-600">
                                        {card.badge}
                                    </span>
                                )}
                            </div>
                            <div className="p-6 flex flex-col gap-3">
                                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                                <p className="text-sm text-gray-600">{card.description}</p>
                                <Link
                                    to="/hostels"
                                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                                >
                                    Book this stay
                                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedHotels;

