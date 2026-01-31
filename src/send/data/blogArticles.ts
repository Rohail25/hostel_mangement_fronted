export type BlogCategory = 'City Guide' | 'Hostel Spotlight' | 'Travel Tips' | 'Community'

export interface BlogArticle {
    id: string
    title: string
    summary: string
    heroImage: string
    hotel: string
    location: string
    category: BlogCategory
    readTime: string
    publishedAt: string
    content: string[]
    gallery: string[]
}

export const blogArticles: BlogArticle[] = [
    {
        id: 'blog-1',
        title: 'Inside the Skyline Suites Rooftop Lounge',
        summary:
            'From sunrise yoga to starlit acoustic sessions, discover why Skyline Suites is the go-to rooftop hostel for digital nomads.',
        heroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
        hotel: 'Skyline Suites Hostel',
        location: 'Midtown, PK',
        category: 'Hostel Spotlight',
        readTime: '5 min read',
        publishedAt: '2024-04-20',
        content: [
            'Skyline Suites was designed with the urban backpacker in mind. Set 18 floors above the bustle of Midtown, the rooftop lounge is the heartbeat of the hostel where communal breakfasts merge into co-working afternoons and sunset socials. The space stretches along the skyline with panoramic windows that frame the city’s evolving palette of light.',
            'Morning hours are the quietest. Sunrise pours across the long work bench as remote professionals plug in laptops and order pour-over coffee from the barista cart. Power outlets are embedded into every table, Wi-Fi is faultless, and the playlist transitions from lo-fi beats to soft acoustic covers through the day.',
            'By midday the lounge shifts into community mode. Guests sign up for mentorship hours, lightning talks, and language exchanges. Residents curate rotating art installations on the feature wall—everything from typography posters to handwoven tapestries sourced from local makers.',
            'Sunset is when the magic happens. The staff strings up Edison bulbs, the herb garden releases a mellow citrus scent, and the mixologist begins stirring signature mocktails. Wednesday nights are acoustic open-mic evenings, Saturdays are for astronomy meetups with telescopes on standby.',
            'What travellers love most is the flexibility: whether you need a corner to take calls, a yoga deck to unwind, or simply a cosy nook to swap stories, the lounge offers it all. Designed in partnership with local artists, every wall narrates a piece of the city, and every piece of furniture is modular so guests can reconfigure the room for workshops or film screenings.',
            'Hot tip: reserve a beanbag next to the herb garden for sunrise—complimentary pour-over coffee is served every morning at 6:30am. Pair it with the almond croissants baked fresh downstairs and you will understand why travellers extend their stay “for just one more day.”'
        ],
        gallery: [
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1400&q=80'
        ],
    },
    {
        id: 'blog-2',
        title: '48 Hours in Green Valley',
        summary:
            'A curated itinerary blending forest hikes, farm-to-table breakfasts, and community art nights right from the Green Valley Hostel doorstep.',
        heroImage: 'https://images.unsplash.com/photo-1500530855697-8c1b2f909d77?auto=format&fit=crop&w=1600&q=80',
        hotel: 'Green Valley Hostel',
        location: 'Skardu, PK',
        category: 'City Guide',
        readTime: '7 min read',
        publishedAt: '2024-04-05',
        content: [
            'Day one kicks off with a sunrise hike organised by the hostel crew. The trail weaves through terraced farms and pine forests before reaching a ridge that overlooks the valley. Guides unpack thermoses of cinnamon tea and share local folklore while the sun spills across fields of apricot blossoms.',
            'Back at the hostel, chef Sana preps a breakfast table bursting with local produce: buckwheat pancakes drizzled with honey, herb-infused yogurt, and fire-roasted tomatoes. Guests linger on the patio swapping gear recommendations and marking routes on the communal trail map.',
            'Post-lunch, hop onto the hostel shuttle to the ceramics studio where travellers learn how to craft Skardu clayware. The workshop is led by Master Aziz, who speaks softly about the lineage of potters in his family while helping you throw your first bowl.',
            'Evenings are for bonfires, folk music, and the famous walnut brownies baked on-site. If the weather turns chilly, the indoor lounge lights the stone fireplace and screens documentary reels made by visiting filmmakers.',
            'On day two, rent a bike from reception and follow the curated map to hidden waterfalls and picnic spots. Each waypoint includes an audio story accessible via QR code, narrated by elders who grew up wandering the same trails.',
            'Wrap up the weekend with Green Valley’s community art night—paints, canvas, and a ceiling of stars overhead. Artists-in-residence guide collaborative murals that later line the hostel corridors, leaving a kaleidoscope of memories long after you have headed home.'
        ],
        gallery: [
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1500534319200-e285ebc76b16?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80'
        ],
    },
    {
        id: 'blog-3',
        title: 'Hostel City Center: Remote Work Essentials',
        summary:
            'How the co-working pods, lightning-fast WiFi, and curated networking events at City Center Hostel power productive getaways.',
        heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
        hotel: 'City Center Hostel',
        location: 'Karachi, PK',
        category: 'Travel Tips',
        readTime: '4 min read',
        publishedAt: '2024-03-18',
        content: [
            'The co-working pods at City Center Hostel are engineered for focus: ergonomic seating, acoustic panels, and a coffee tap that never sleeps. Each pod includes height-adjustable desks, Bose noise-cancelling headphones for rent, and a scheduling system that syncs with the Hotling app.',
            'For teams, the conference nook comes fully stocked with whiteboards, a 4K projector, and sticky-note dispensers. Guests can book it for sprint planning or quick remote stand-ups, and the staff will even print out agendas upon request.',
            'Every Wednesday evening the hostel hosts “Pitch & Pasta” where founders and freelancers connect over fresh bowls tossed in the communal kitchen. Investors passing through the city frequently RSVP, making it a surprisingly effective networking hub.',
            'Daily productivity rituals include “deep work” alarms that trigger ambient lighting shifts and a playlist change. When the lights switch to warm amber, that is your cue to wrap up and migrate to the lounge for human interaction.',
            'Need a breather? Head to the micro-theatre on level 2 for a VR detox session or take the quick tram to the waterfront promenade. Guests can grab yoga mats from reception and join the sunset stretch session led by the hostel wellness coach.',
            'To round things off, City Center’s pantry stocks healthy snacks sourced from local vendors—think pomegranate energy bars and bottled chai. It is remote work heaven without the sterile co-working vibe.'
        ],
        gallery: [
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80'
        ],
    },
    {
        id: 'blog-4',
        title: 'Volunteer Weekends at Harbor View',
        summary:
            'Hotling travellers teamed up with local marine biologists for coastal clean-ups. Here is how you can join the next wave.',
        heroImage: 'https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=1600&q=80',
        hotel: 'Harbor View Hostel',
        location: 'Gwadar, PK',
        category: 'Community',
        readTime: '6 min read',
        publishedAt: '2024-03-01',
        content: [
            'Once a month, Harbor View Hostel transforms into a basecamp for marine conservation. Travellers and locals gather at dawn for shoreline clean-ups followed by reef restoration workshops. Marine biologists give a crash course on coral health before the group wades into the shallows.',
            'Two-hour floating labs offer a rare up-close encounter with juvenile coral nurseries. Volunteers help measure growth, log water temperatures, and reposition fragments on nursery racks.',
            'Afternoons include storytelling sessions where coastal elders recount Gwadar’s fishing heritage and share recipes that have sustained the community for generations. The hostel kitchen recreates a few honourary dishes for dinner.',
            'As the sun dips, the jetty transforms into an open-air cinema screening documentaries filmed by past volunteers. Tip: bring a blanket and sit near the lighthouse for the best breeze.',
            'All participants receive snorkelling passes and a behind-the-scenes tour of the marine biology lab, where specimens glow under ultraviolet light and researchers explain how citizen science data shapes policy.',
            'Proceeds from the volunteer weekend fund coral nurseries anchored just off the hostel’s private jetty and support scholarships for local students pursuing marine sciences.'
        ],
        gallery: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1504870712357-65ea720d6078?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1400&q=80'
        ],
    },
    {
        id: 'blog-5',
        title: '5 Budget-Friendly Hostels for Solo Trekkers',
        summary:
            'A curated list of Hotling hostels near Pakistan’s most iconic trails, complete with storage hacks and sunrise photo spots.',
        heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
        hotel: 'Hotling Network',
        location: 'Northern Pakistan',
        category: 'Travel Tips',
        readTime: '8 min read',
        publishedAt: '2024-02-22',
        content: [
            'Solo trekking through the north is easier when you know where to crash. We highlight five Hotling hostels that offer gear lockers, hot showers, and community trail briefings. Each property keeps a laminated binder of trail notes contributed by past guests, complete with hazard alerts and updated water sources.',
            'Hunza Base Hostel is a favourite for sunrise photographers thanks to its ridge-top deck and the barista who starts pouring espresso shots at dawn. The hostel launders wet gear overnight and loans microspikes when the passes turn icy.',
            'Fairy Meadows Cabin takes pre-order lunch requests—wraps and energy bites sealed and labelled for each hiker. The kitchen also hosts nightly briefings with local guides who draw route updates on a giant chalk map.',
            'For K2 Base Camp aspirants, Skardu Transit Hostel offers altitude acclimatisation workshops and meditation sessions to help steady nerves. The bunk rooms are fitted with privacy curtains so you can rest before multi-day pushes.',
            'Every hostel listed offers shuttle links to trailheads and partnerships with certified mountain guides who know the terrain inside out. Download the Hotling Trek companion app and you will get real-time weather alerts pushed to your phone.',
            'Pack light, label your gear, and leave a page in the hostel logbook; future trekkers rely on those tips as much as trail markers.'
        ],
        gallery: [
            'https://images.unsplash.com/photo-1500530855697-586d8f17a8b9?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1518684079-b2cf9f0c0f27?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1500534319200-9d7af4bf3d87?auto=format&fit=crop&w=1400&q=80'
        ],
    },
    {
        id: 'blog-6',
        title: 'Designing the New Zo House Communal Kitchen',
        summary:
            'Peek behind the scenes as our architects collaborate with guests to build a kitchen that sparks conversations and midnight cravings.',
        heroImage: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1600&q=80',
        hotel: 'Zo House',
        location: 'Lahore, PK',
        category: 'Hostel Spotlight',
        readTime: '5 min read',
        publishedAt: '2024-02-10',
        content: [
            'Zo House surveyed over 500 guests before sketching the first blueprint. The result is a kitchen split into bite-sized zones: baking bay, spice lab, fermentation corner, and the communal tasting table. Every counter is labelled so you always know where to find the garlic press or the kombucha jars.',
            'Daytime is dedicated to open cooking slots. Guests scan a QR code to reserve stations and download ingredient lists that match their skill level. Junior cooks can follow visual guides while experienced chefs can request seasonal produce boxes.',
            'Guests can sign up for chef residencies that celebrate Lahore’s culinary icons. For a week at a time, a guest chef teaches family recipes, hosts supper clubs, and leads trips through the spice markets. Zo House documents the experience and uploads video tutorials to the Hotling app.',
            'Evenings bring the tasting table alive. Long benches encourage communal dining, and the walls are lined with photo frames of hostel alumni who left their signature dishes behind. The pantry operates on a trust system—everyone contributes a jar, spice, or snack to keep the cycle going.',
            'The project also partners with zero-waste initiatives, ensuring leftover ingredients are redistributed to neighbourhood food banks. Compost bins break down peels and scraps, which feed the rooftop herb garden that supplies mint, basil, and lemongrass.',
            'Next up on the roadmap: a rooftop smoker and a dessert lab dedicated to reinventing classic Pakistani sweets. Consider this your invite to be part of the first tasting panel.'
        ],
        gallery: [
            'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1400&q=80',
            'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=1400&q=80'
        ],
    },
]

