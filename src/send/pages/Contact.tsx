import Header from '../components/Header'
import Footer from '../components/Footer'

const teams = [
    {
        title: 'Support Team',
        description: 'Booking & stay related queries',
        cta: 'WhatsApp',
        href: 'https://wa.me/0000000000',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Franchise Team',
        description: 'Open a Hotling property',
        cta: 'Sign Up Now',
        href: '#franchise',
        image: 'https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Marketing Team',
        description: 'Creator, brand & artist collabs',
        cta: 'Email us',
        href: 'mailto:marketing@hotling.com',
        image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
    },
]

const Contact = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="px-6 sm:px-8 lg:px-12 pt-16 pb-12 text-center">
                    <p className="text-sm uppercase tracking-[0.4em] text-primary-500 font-semibold mb-3">we're here for you</p>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Hey, need help?</h1>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                        From booking enquiries to opening your own Hotling franchise, we are just a text or email away. Choose the team that suits your question best.
                    </p>
                </section>

                <section className="px-6 sm:px-8 lg:px-12 pb-16">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {teams.map((team) => (
                            <div key={team.title} className="group rounded-[32px] bg-white border border-gray-100 shadow-[0_45px_80px_-45px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col min-h-[30rem]">
                                <div className="h-60 bg-gray-100 overflow-hidden">
                                    <img src={team.image} alt={team.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{team.title}</h3>
                                    <p className="text-sm text-gray-500 mb-8 flex-1">{team.description}</p>
                                    <a
                                        href={team.href}
                                        className="inline-flex items-center justify-center rounded-full bg-[#F4603C] text-white font-semibold px-6 py-3 shadow-[0_12px_30px_-18px_rgba(244,96,60,0.9)] transition-transform hover:translate-y-[-2px]"
                                    >
                                        {team.cta}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-6 sm:px-8 lg:px-12 pb-24">
                    <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
                        <div className="rounded-3xl bg-white border border-gray-100 shadow-[0_45px_80px_-45px_rgba(0,0,0,0.45)] p-10">
                            <h2 className="text-3xl font-semibold text-gray-900">Tell us about your stay</h2>
                            <p className="mt-3 text-gray-600">
                                Share what you need and our team will reply within one business day. We respond faster on weekdays between 10 AM
                                and 7 PM PKT.
                            </p>
                            <form className="mt-8 space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-name">
                                            Full name
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            placeholder="Hira Khan"
                                            className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-email">
                                            Email address
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-phone">
                                            Phone number
                                        </label>
                                        <input
                                            id="contact-phone"
                                            type="tel"
                                            placeholder="+92 3XX XXXXXXX"
                                            className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-topic">
                                            What do you need?
                                        </label>
                                        <select
                                            id="contact-topic"
                                            className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            defaultValue="booking"
                                        >
                                            <option value="booking">Booking help</option>
                                            <option value="partnership">Franchise & partnerships</option>
                                            <option value="feedback">Feedback & suggestions</option>
                                            <option value="media">Media & collaborations</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-message">
                                        Message
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        rows={5}
                                        placeholder="Share details about your query, preferred dates, or the property you are interested in."
                                        className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                        required
                                    />
                                </div>
                                <label className="inline-flex items-center gap-3 text-sm text-gray-600">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    Keep me posted about hostel launches and travel offers.
                                </label>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-3 rounded-full bg-primary-600 px-7 py-3.5 text-white font-semibold shadow-[0_15px_35px_-20px_rgba(255,161,22,0.9)] hover:bg-primary-700 transition-colors"
                                >
                                    Send message
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                        <aside className="rounded-3xl border border-gray-100 bg-gray-900 text-white p-10 flex flex-col gap-6">
                            <div>
                                <h3 className="text-xl font-semibold">Quick contact</h3>
                                <p className="mt-2 text-white/70">Prefer direct lines? Reach us through these channels.</p>
                            </div>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-white/50 uppercase tracking-[0.3em] text-xs">Support hotline</p>
                                    <a href="tel:+923001112233" className="text-lg font-semibold mt-1 inline-block">
                                        +92 300 111 2233
                                    </a>
                                </div>
                                <div>
                                    <p className="text-white/50 uppercase tracking-[0.3em] text-xs">Email</p>
                                    <a href="mailto:support@hotling.com" className="text-lg font-semibold mt-1 inline-block">
                                        support@hotling.com
                                    </a>
                                </div>
                                <div>
                                    <p className="text-white/50 uppercase tracking-[0.3em] text-xs">Office hours</p>
                                    <p className="mt-1 font-semibold">Mon – Sat, 10:00 AM – 7:00 PM (PKT)</p>
                                </div>
                            </div>
                            <div className="mt-auto space-y-3">
                                <p className="text-sm text-white/60">Visit us at</p>
                                <address className="not-italic text-sm leading-relaxed text-white/80">
                                    4th Floor, Skyline Plaza<br />
                                    Shahrah-e-Faisal, Karachi<br />
                                    Pakistan
                                </address>
                                <a
                                    href="https://maps.google.com"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-200 hover:text-primary-100 transition-colors"
                                >
                                    Open in Google Maps
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="relative py-24 bg-gray-50 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <span className="text-[220px] md:text-[320px] font-black uppercase tracking-[0.3em] text-gray-200 select-none">Hotling</span>
                    </div>
                    <div className="relative max-w-3xl mx-auto text-center px-6 space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Follow your heart with Hotling</h2>
                        <p className="text-lg text-gray-600">
                            Join our community of travellers, creators, and partners who make every Hotling stay unforgettable. We love hearing from you.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
                            <a href="https://instagram.com" className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-colors">
                                Instagram
                            </a>
                            <a href="https://youtube.com" className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-colors">
                                YouTube
                            </a>
                            <a href="mailto:hello@hotling.com" className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-colors">
                                hello@hotling.com
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Contact


