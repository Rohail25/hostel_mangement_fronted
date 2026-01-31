const SocialProof = () => {
    return (
        <section className="py-10 bg-gradient-light">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                    <div>
                        <div className="text-4xl font-bold text-primary-600 mb-2">2k+</div>
                        <div className="text-gray-700 font-medium">Rooms Managed</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
                        <div className="text-gray-700 font-medium">On-Time Rent Tracking</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-primary-600 mb-2">4.8/5</div>
                        <div className="text-gray-700 font-medium">User Satisfaction</div>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-lg text-gray-700 italic max-w-2xl mx-auto">
                        "HostelCity has transformed how we manage our properties. Everything is organized,
                        automated, and easy to track."
                    </p>
                    <p className="text-gray-600 mt-2">— Property Manager, City Hostels</p>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;

