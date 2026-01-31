const ValueCards = () => {
    return (
        <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">
                    Everything You Need
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Unified Billing */}
                    <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm5 5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unified Billing</h3>
                        <p className="text-gray-600">
                            Automated invoices, due reminders, and payment tracking all in one place.
                        </p>
                    </div>

                    {/* Maintenance & Alerts */}
                    <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Maintenance & Alerts</h3>
                        <p className="text-gray-600">
                            Never miss critical dates with automated reminders for bills and maintenance.
                        </p>
                    </div>

                    {/* Room & Seat Architecture */}
                    <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Room & Seat Architecture</h3>
                        <p className="text-gray-600">
                            Visualize floors, rooms, and seats with live occupancy tracking and management.
                        </p>
                    </div>

                    {/* Score Cards */}
                    <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Score Cards</h3>
                        <p className="text-gray-600">
                            Evaluate tenants, employees, and vendors with comprehensive criteria and history.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ValueCards;

