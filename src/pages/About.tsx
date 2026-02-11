import Header from '../components/Header'
import Footer from '../components/Footer'

const About = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[400px] sm:h-[500px] overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-16 h-full flex items-center">
                        <div className="max-w-3xl text-white space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                About The City Hotling
                            </h1>
                            <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
                                Your trusted partner in hospitality, connecting travelers with exceptional stays around the world.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <article className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Mission Section */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                                <p>
                                    At The City Hotling, we believe that every journey deserves the perfect accommodation. 
                                    Our mission is to provide travelers with a seamless booking experience, connecting them 
                                    with quality hotels and hostels that match their needs, preferences, and budget.
                                </p>
                                <p>
                                    We are committed to building a platform that empowers both travelers and property owners, 
                                    creating a community where hospitality thrives and memories are made.
                                </p>
                            </div>
                        </section>

                        {/* Values Section */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                                    <h3 className="text-xl font-semibold text-primary-600 mb-3">Trust & Transparency</h3>
                                    <p className="text-gray-700">
                                        We believe in honest communication and transparent pricing. Every property listed 
                                        on our platform is verified to ensure quality and accuracy.
                                    </p>
                                </div>
                                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                                    <h3 className="text-xl font-semibold text-primary-600 mb-3">Customer First</h3>
                                    <p className="text-gray-700">
                                        Your satisfaction is our priority. We continuously work to improve your experience 
                                        and provide exceptional customer support whenever you need it.
                                    </p>
                                </div>
                                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                                    <h3 className="text-xl font-semibold text-primary-600 mb-3">Innovation</h3>
                                    <p className="text-gray-700">
                                        We leverage cutting-edge technology to make booking easier, faster, and more intuitive 
                                        for both travelers and property owners.
                                    </p>
                                </div>
                                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                                    <h3 className="text-xl font-semibold text-primary-600 mb-3">Community</h3>
                                    <p className="text-gray-700">
                                        We foster a sense of community among travelers and hosts, creating connections that 
                                        go beyond just a place to stay.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* What We Offer Section */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
                            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Wide Selection of Properties</h3>
                                        <p>
                                            From budget-friendly hostels to luxury hotels, we offer a diverse range of 
                                            accommodations to suit every traveler's needs and preferences.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Easy Booking Process</h3>
                                        <p>
                                            Our intuitive platform makes it simple to search, compare, and book your perfect 
                                            stay in just a few clicks.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
                                        <p>
                                            Our dedicated customer service team is available around the clock to assist you 
                                            with any questions or concerns.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Verified Properties</h3>
                                        <p>
                                            All properties on our platform undergo a verification process to ensure quality, 
                                            safety, and accuracy of listings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contact CTA */}
                        <section className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-12 text-white">
                            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                            <p className="text-lg text-white/90 mb-6 max-w-2xl">
                                Have questions or want to learn more about The City Hotling? We'd love to hear from you.
                            </p>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-lg bg-white text-primary-600 px-6 py-3 text-base font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Contact Us
                            </a>
                        </section>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    )
}

export default About
