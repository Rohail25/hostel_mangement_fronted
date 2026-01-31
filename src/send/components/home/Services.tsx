const services = [
    {
        title: '24/7 Reception',
        description: 'Our hostels stay open round the clock, so late check-ins and early departures are always welcome.',
    },
    {
        title: 'Family Friendly',
        description: 'We happily host families with flexible room options tailored for comfort and privacy.',
    },
    {
        title: 'Separate Dorms',
        description: 'Dedicated boys and girls dormitories ensure a safe, relaxed stay for every traveller.',
    },
    {
        title: 'Across Pakistan',
        description: 'From bustling city centres to serene northern escapes, our rooms span the best destinations in Pakistan.',
    },
];

const Services = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <span className="text-primary-600 font-semibold uppercase tracking-wide">Our Services</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                        Everything You Need For A Comfortable Stay
                    </h2>
                    <p className="text-gray-600 mt-4">
                        Discover why travellers and families choose our hostels across Pakistan.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="bg-white rounded-xl shadow-md p-8 text-left border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                            <p className="text-gray-600 mt-3">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

