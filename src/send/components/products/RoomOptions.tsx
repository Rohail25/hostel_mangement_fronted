import { roomOptions } from './productsData';

const RoomOptions = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 md:px-10">
                <div className="max-w-2xl mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Rooms that respect every traveller</h2>
                    <p className="mt-3 text-gray-600">
                        Pick the space that matches your comfort level. Each hostel offers curated inventory for women, men, and
                        families so everyone enjoys privacy without giving up community vibes.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {roomOptions.map((option) => (
                        <article
                            key={option.id}
                            className="rounded-3xl bg-white border border-gray-100 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] p-8"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                            <p className="mt-3 text-gray-600 leading-relaxed">{option.description}</p>
                            <ul className="mt-5 space-y-2 text-sm text-gray-700">
                                {option.details.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomOptions;

