type AboutIntroProps = {
    title: string
    subtitle?: string
}

const AboutIntro = ({ title, subtitle }: AboutIntroProps) => {
    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
                {subtitle ? (
                    <p className="mt-2 text-sm text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
                ) : null}
            </div>
        </section>
    )
}

export default AboutIntro


