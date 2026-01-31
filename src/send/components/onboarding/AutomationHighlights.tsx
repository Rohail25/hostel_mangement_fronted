type AutomationHighlightsProps = {
    highlights: Array<{ icon: string; title: string; detail: string }>
}

const AutomationHighlights = ({ highlights }: AutomationHighlightsProps) => {
    return (
        <section className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-6 py-16 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl space-y-10">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">Operations we automate for you</h2>
                    <p className="text-lg text-gray-600">
                        Reduce manual follow-ups. Set once-and-done rules for repetitive tasks so your staff can focus on hospitality.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {highlights.map((automation) => (
                        <div
                            key={automation.title}
                            className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_35px_70px_-60px_rgba(15,23,42,0.35)]"
                        >
                            <span className="text-3xl" aria-hidden>
                                {automation.icon}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">{automation.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{automation.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AutomationHighlights

