type MVItem = {
    title: string
    description: string
    icon?: React.ReactNode
}

type MissionVisionProps = {
    heading: string
    subheading?: string
    items: MVItem[]
}

const MissionVision = ({ heading, subheading, items }: MissionVisionProps) => {
    return (
        <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-6">
                    <h2 className="text-base font-semibold text-gray-900">{heading}</h2>
                    {subheading ? (
                        <p className="mt-1 text-xs text-gray-500">{subheading}</p>
                    ) : null}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-5 shadow-soft border border-gray-100">
                            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 grid place-items-center mb-3">
                                {item.icon || <span className="text-sm">★</span>}
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-xs text-gray-600 mt-1 leading-5">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MissionVision


