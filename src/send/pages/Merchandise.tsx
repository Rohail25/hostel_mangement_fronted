import Header from '../components/Header'
import Footer from '../components/Footer'

const collections = [
    {
        title: 'Traveller essentials Coming Soon!',
        description:
            'Designed for the backpacker who loves both comfort and storytelling. Planet-friendly fabrics, gender-neutral fits, and packing strategies built into every pocket.',
        items: [
            {
                name: 'Midnight Skyline hoodie',
                blurb: 'A heavyweight organic cotton hoodie inspired by the rooftop lounges across Hotling hostels. Features a hidden phone pocket and headphone loops.',
                image: 'https://images.unsplash.com/photo-1523374228107-6e44bd2b524e?auto=format&fit=crop&w=1200&q=80',
            },
            {
                name: 'Collapsible travel bottle',
                blurb: 'Leak-proof, dishwasher-safe, and embossed with every Hotling city on the itinerary. Perfect for refilling at hostel hydration stations.',
                image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
            },
        ],
    },
    {
        title: 'Hostel lounge upgrades',
        description:
            'Give your community spaces a Hotling glow-up. Acoustic lighting, modular seating, and custom art prints co-created with our residency artists.',
        items: [
            {
                name: 'Aurora ambient lamp',
                blurb: 'Adjustable RGBW lamp that syncs with the Hotling mood presets. Switch from cowork to campfire ambience in seconds.',
                image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
            },
            {
                name: 'Storyline art prints',
                blurb: 'Limited-edition illustrated maps of our favourite hostels. Printed on recycled cotton rag paper with soy inks.',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
            },
        ],
    },
]

const perks = [
    'Carbon-neutral shipping from our regional warehouses in Karachi, Lahore, and Islamabad.',
    'Bulk pricing and white-labelling available for Hotling franchise partners.',
    'Co-create limited collections with local artists through the Hotling residency program.',
]

const Merchandise = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="pt-16 pb-12 bg-gradient-to-b from-white via-sky-50 to-white">
                    <div className="w-full lg:w-[90%] mx-auto px-3 sm:px-8 lg:px-12">
                        <div className="max-w-4xl space-y-6">
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-primary-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
                                Hotling merch
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">Wear the journey. Dress your hostel. Amplify the Hotling vibe.</h1>
                            <p className="text-lg text-gray-600">
                                Our merchandise line blends sustainable materials, travel-ready functionality, and limited-edition collaborations with artists we meet on the road. Stock your hostel shop or pack souvenirs that carry hostel memories home.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm font-medium">
                                <a href="mailto:merch@hotling.com" className="inline-flex items-center rounded-full bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors">
                                    Get wholesale catalog
                                </a>
                                <a href="#collections" className="inline-flex items-center rounded-full border border-gray-200 px-6 py-3 text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-colors">
                                    Browse collections
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="collections" className="py-16 space-y-16">
                    <div className="w-full lg:w-[90%] mx-auto px-3 sm:px-8 lg:px-12">
                        {collections.map((collection) => (
                            <div key={collection.title} className="space-y-10">
                                <div className="max-w-3xl">
                                    <h2 className="text-3xl font-bold text-gray-900">{collection.title}</h2>
                                    <p className="text-gray-600 text-lg">{collection.description}</p>
                                </div>
                                <div className="grid gap-10 md:grid-cols-2">
                                    {collection.items.map((item) => (
                                        <div key={item.name} className="rounded-[28px] border border-gray-100 bg-white shadow-[0_45px_90px_-60px_rgba(15,23,42,0.35)] overflow-hidden">
                                            <div className="h-56 bg-gray-100 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="p-8 space-y-3">
                                                <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">{item.blurb}</p>
                                                <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
                                                    Add to inquiry list
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pb-20 bg-gray-50">
                    <div className="w-full lg:w-[90%] mx-auto px-3 sm:px-8 lg:px-12">
                        <div className="max-w-5xl mx-auto grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-gray-900">Why hostel partners love Hotling merch</h2>
                                <ul className="space-y-4 text-gray-600 text-lg">
                                    {perks.map((perk) => (
                                        <li key={perk} className="flex gap-3">
                                            <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{perk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <aside className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.35)] space-y-4 h-fit">
                                <h3 className="text-xl font-semibold text-gray-900">Quick shop links</h3>
                                <ul className="space-y-3 text-sm font-semibold text-primary-600">
                                    <li><a href="/hostels" className="flex items-center gap-2 hover:text-primary-700"><span className="w-2 h-2 rounded-full bg-primary-500" />Restock bestsellers</a></li>
                                    <li><a href="mailto:design@hotling.com" className="flex items-center gap-2 hover:text-primary-700"><span className="w-2 h-2 rounded-full bg-primary-500" />Request custom artwork</a></li>
                                    <li><a href="/blogs" className="flex items-center gap-2 hover:text-primary-700"><span className="w-2 h-2 rounded-full bg-primary-500" />See collab highlights</a></li>
                                </ul>
                                <p className="text-xs text-gray-500">Need volume pricing? Drop a line at merch@hotling.com for a personalised quote.</p>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Merchandise


