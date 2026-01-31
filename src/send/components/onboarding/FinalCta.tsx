import { Link } from 'react-router-dom'

const FinalCta = () => {
    return (
        <section className="bg-black px-6 py-20 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-4xl space-y-6">
                <h2 className="text-3xl font-bold text-white">Ready to onboard your property?</h2>
                <p className="text-lg text-white/80">
                    Complete the nine-step application to submit your hotel or hostel for admin verification. We review every submission within
                    48 hours and support you through launch.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/onboarding/start"
                        className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
                    >
                        Start onboarding now
                    </Link>
                    <a
                        href="mailto:onboarding@hotling.com"
                        className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                    >
                        Email onboarding support
                    </a>
                    <a
                        href="https://chat.hotling.com"
                        className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                    >
                        Chat with us live
                    </a>
                </div>
            </div>
        </section>
    )
}

export default FinalCta

