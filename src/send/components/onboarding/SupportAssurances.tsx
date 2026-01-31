type SupportAssurancesProps = {
    assurances: Array<{ title: string; description: string }>
    journey: Array<{ step: string; title: string; description: string }>
}

const SupportAssurances = ({ assurances, journey }: SupportAssurancesProps) => {
    return (
        <section className="bg-white px-6 py-16 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl space-y-10 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Partner support that scales with you</h2>
                    <p className="text-lg text-gray-600">Even after onboarding, you get proactive guidance and reliable help from hospitality experts.</p>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {assurances.map((support) => (
                            <div
                                key={support.title}
                                className="space-y-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_45px_90px_-70px_rgba(15,23,42,0.3)]"
                            >
                                <h3 className="text-lg font-semibold text-gray-900">{support.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{support.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <aside className="space-y-6 rounded-[32px] border border-gray-100 bg-gray-50 p-8 shadow-[0_45px_90px_-70px_rgba(15,23,42,0.3)]">
                    <h3 className="text-xl font-semibold text-gray-900">How the onboarding journey unfolds</h3>
                    <ul className="space-y-5 text-sm text-gray-600">
                        {journey.map((milestone) => (
                            <li key={milestone.step} className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-primary">{milestone.step}</span>
                                <h4 className="text-base font-semibold text-gray-900">{milestone.title}</h4>
                                <p>{milestone.description}</p>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </section>
    )
}

export default SupportAssurances

