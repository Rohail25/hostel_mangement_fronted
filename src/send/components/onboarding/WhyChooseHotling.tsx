type WhyChooseHotlingProps = {
    reasons: Array<{ title: string; description: string }>
}

const WhyChooseHotling = ({ reasons }: WhyChooseHotlingProps) => {
    return (
        <section className="bg-gray-50 px-6 py-16 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl space-y-10">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">Why owners choose Hotling over DIY tools</h2>
                    <p className="text-lg text-gray-600">We combine people, product, and growth strategy so every partner sees results faster.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {reasons.map((reason) => (
                        <div
                            key={reason.title}
                            className="space-y-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_45px_90px_-70px_rgba(15,23,42,0.35)]"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">{reason.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhyChooseHotling

