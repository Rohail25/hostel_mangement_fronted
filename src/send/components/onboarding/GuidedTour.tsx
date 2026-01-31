const GuidedTour = () => {
    return (
        <section className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-6 pb-16 sm:px-10 lg:px-16">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">Take a 90-second guided tour</h2>
                    <p className="text-gray-600 text-lg">
                        Watch how guests search and book, how hoteliers manage inventory, and how our support team keeps everything running
                        smoothly.
                    </p>
                    <a
                        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Play walkthrough video
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-[28px] shadow-[0_45px_90px_-70px_rgba(15,23,42,0.45)]">
                    <iframe
                        className="h-full w-full"
                        src="https://www.youtube.com/embed/5ZkH0E9KZx4?rel=0&modestbranding=1"
                        title="Hotling Onboarding Walkthrough"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    )
}

export default GuidedTour

