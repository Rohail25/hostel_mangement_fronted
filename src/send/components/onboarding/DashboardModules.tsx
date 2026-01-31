type DashboardModulesProps = {
    modules: Array<{ title: string; description: string; items: string[] }>
}

const DashboardModules = ({ modules }: DashboardModulesProps) => {
    return (
        <section className="bg-white px-6 py-16 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl space-y-10">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">Everything you can do inside the owner dashboard</h2>
                    <p className="text-lg text-gray-600">
                        Configure once, then monitor and optimise every part of your hospitality business from Hotling.
                    </p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    {modules.map((module) => (
                        <div
                            key={module.title}
                            className="space-y-4 rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_45px_90px_-70px_rgba(15,23,42,0.3)]"
                        >
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{module.description}</p>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {module.items.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default DashboardModules

