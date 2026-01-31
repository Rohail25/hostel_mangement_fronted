type CoreFacilitiesProps = {
    facilities: Array<{ icon: string; label: string; description: string }>
}

const CoreFacilities = ({ facilities }: CoreFacilitiesProps) => {
    return (
        <section className="bg-white px-6 py-16 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl space-y-10">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">Core facilities we deliver to every hotel owner</h2>
                    <p className="text-lg text-gray-600">
                        From reservations to payouts, Hotling’s owner suite replaces fragmented tools with one connected platform.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {facilities.map((feature) => (
                        <div
                            key={feature.label}
                            className="rounded-3xl border border-gray-100 bg-sky-50/70 p-6 shadow-[0_35px_70px_-60px_rgba(15,23,42,0.3)]"
                        >
                            <span className="text-3xl" aria-hidden>
                                {feature.icon}
                            </span>
                            <h3 className="mt-3 text-lg font-semibold text-gray-900">{feature.label}</h3>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CoreFacilities

