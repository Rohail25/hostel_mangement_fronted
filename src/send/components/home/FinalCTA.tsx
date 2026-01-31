import { Link } from 'react-router-dom';

const FinalCTA = () => {
    return (
        <section className="py-10 bg-primary-600">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Ready to streamline your hostel operations?
                </h2>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of property managers who trust HostelCity for their daily operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/register"
                        className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-soft-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                    >
                        Register
                    </Link>
                    <Link
                        to="/contact"
                        className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-all shadow-soft-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-600 border border-primary-500"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;

