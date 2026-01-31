type StoryProps = {
    heading: string
    paragraphs: string[]
    imageUrl: string
}

const Story = ({ heading, paragraphs, imageUrl }: StoryProps) => {
    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-6">
                <div className="rounded-2xl bg-gray-50 p-6 md:p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{heading}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-3 text-gray-700 text-sm leading-6">
                            {paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                            <img src={imageUrl} alt={heading} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Story


