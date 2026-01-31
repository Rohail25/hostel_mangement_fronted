const HowItWorks = () => {
    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            1
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Add Hostels</h3>
                        <p className="text-gray-600">
                            Start by adding your hostel properties with all essential details and configurations.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            2
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Add Rooms & Seats</h3>
                        <p className="text-gray-600">
                            Configure your floor plans, rooms, and individual seats with occupancy tracking.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            3
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Manage & Monitor</h3>
                        <p className="text-gray-600">
                            Track billing, maintenance, tenant information, and performance metrics all in one
                            dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

