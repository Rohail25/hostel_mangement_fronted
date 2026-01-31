import { stayCategories } from './productsData';

const StayCategories = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-10">
                <div className="max-w-2xl mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Choose the stay that matches your plans</h2>
                    <p className="mt-3 text-gray-600">
                        Each collection is intentionally designed so you can pick the vibe, amenities, and duration that feel right.
                        Upgrade or switch categories anytime—your booking stays flexible.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {stayCategories.map((category) => (
                        <article
                            key={category.id}
                            className="h-full rounded-3xl border border-gray-100 shadow-[0_15px_40px_-25px_rgba(15,23,42,0.35)] hover:shadow-[0_20px_50px_-25px_rgba(15,23,42,0.45)] transition-shadow bg-white"
                        >
                            <div className="p-8 flex flex-col h-full">
                                <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-[0.25em] px-4 py-1">
                                    {category.subtitle}
                                </span>
                                <h3 className="mt-6 text-2xl font-semibold text-gray-900">{category.title}</h3>
                                <p className="mt-4 text-gray-600 leading-relaxed">{category.description}</p>
                                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                    {category.highlights.map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-6">
                                    <button className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                                        Explore {category.title}
                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StayCategories;

