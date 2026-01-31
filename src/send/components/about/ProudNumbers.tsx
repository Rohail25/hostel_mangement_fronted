type Stat = {
    label: string
    value: string
    icon?: React.ReactNode
}

type ProudNumbersProps = {
    heading: string
    stats: Stat[]
}

const ProudNumbers = ({ heading, stats }: ProudNumbersProps) => {
    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-base font-semibold text-gray-900 text-center mb-6">{heading}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto text-center">
                    {stats.map((s, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 p-5">
                            <div className="mb-2 text-primary-600">{s.icon || '◎'}</div>
                            <div className="text-xl font-bold text-gray-900">{s.value}</div>
                            <div className="text-xs text-gray-600">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProudNumbers


