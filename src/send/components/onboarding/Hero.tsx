import { Link } from 'react-router-dom'

type HeroProps = {
    deliverables: string[]
    capabilities: Array<{ title: string; description: string }>
}

const Hero = ({ deliverables, capabilities }: HeroProps) => {
    return (
        <section className="bg-gradient-to-br from-sky-50 via-white to-white px-6 pb-16 pt-20 sm:px-10 lg:px-16">
            <div className="w-full space-y-10 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
                <div className="space-y-6">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                        For hotel & hostel owners
                    </span>
                    <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                        Onboard your property once. Manage bookings, rooms, mess, staff, and payouts forever.
                    </h1>
                    <p className="text-lg text-gray-600">
                        Hotling gives you an owner dashboard, manager logins, and step-by-step onboarding so you can add hotels, hostels,
                        rooms, and mess facilities with confidence. Centralise operations, market smarter, and grow revenue on autopilot.
                    </p>
                    <div className="space-y-4">
                        <h1 className=" font-bold uppercase tracking-[0.2em] text-black">
                            What we provide to hotel owners
                        </h1>
                        <ul className="space-y-3 text-sm text-gray-700">
                            {deliverables.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/60 px-4 py-3 backdrop-blur"
                                >
                                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                        ✓
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <Link
                            to="/onboarding/start"
                            className="inline-flex items-center rounded-full bg-black px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-900"
                        >
                            Onboard your hostel
                        </Link>
                        <Link
                            to="/owner-hotel"
                            className="inline-flex items-center rounded-full border border-gray-200 px-7 py-3 text-base font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
                        >
                            Talk to our onboarding team
                        </Link>
                    </div>
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {capabilities.map((capability) => (
                            <li
                                key={capability.title}
                                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_35px_70px_-60px_rgba(15,23,42,0.35)]"
                            >
                                <h3 className="text-lg font-semibold text-gray-900">{capability.title}</h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{capability.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-6 rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_45px_90px_-70px_rgba(15,23,42,0.45)]">
                    <h2 className="text-2xl font-semibold text-gray-900">What you set up during onboarding</h2>
                    <ol className="space-y-4 text-sm text-gray-600">
                        <li>
                            <strong className="font-semibold text-gray-900">Owner identity & access:</strong> Personal details, CNIC, team
                            roles, and login preferences.
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">Property blueprint:</strong> Rooms, dorms, mess plans, amenities,
                            policies, and media library.
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">Commercial setup:</strong> Rates, taxes, commissions, payout
                            channels, and marketing preferences.
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-900">Verification & launch:</strong> Document checks, listing preview,
                            soft launch, and go-live announcement.
                        </li>
                    </ol>
                </div>
            </div>
        </section>
    )
}

export default Hero

