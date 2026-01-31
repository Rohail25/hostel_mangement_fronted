type JoinMovementProps = {
    heading: string
    description: string
    ctaText: string
    ctaHref: string
}

const JoinMovement = ({ heading, description, ctaText, ctaHref }: JoinMovementProps) => {
    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-6">
                <div className="rounded-2xl border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">{heading}</h3>
                        <p className="text-sm text-gray-600 mb-4 max-w-xl">{description}</p>
                        <a href={ctaHref} className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-semibold shadow-blue">
                            {ctaText}
                        </a>
                    </div>
                    <div className="w-56 h-56 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 grid place-items-center text-xs text-primary-700">
                        Explore
                    </div>
                </div>
            </div>
        </section>
    )
}

export default JoinMovement


