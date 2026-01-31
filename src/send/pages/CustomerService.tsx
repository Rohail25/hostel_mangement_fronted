import Header from '../components/Header'
import Footer from '../components/Footer'

const supportChannels = [
    {
        heading: 'Live chat',
        summary: 'Instant help from our global team, 24/7.',
        description:
            'Reach a Hotling support hero straight from your dashboard. We resolve 70% of queries in under 10 minutes by sharing screen recordings, Docs, and knowledge base snippets.',
        actionLabel: 'Open chat window',
        actionHref: 'https://chat.hotling.com',
    },
    {
        heading: 'Email support',
        summary: 'Detailed follow-ups and account tweaks.',
        description:
            'Send us booking disputes, payment adjustments, OTA sync requests, or technical logs. Each thread gets a dedicated case owner until resolution.',
        actionLabel: 'Email care@hotling.com',
        actionHref: 'mailto:care@hotling.com',
    },
    {
        heading: 'Phone concierge',
        summary: 'Crisis line for urgent escalations.',
        description:
            'Call when you need immediate escalation—overbookings, safety incidents, power outages. On-call managers coordinate with local authorities and partner hostels.',
        actionLabel: 'Call +92 21 112 345 67',
        actionHref: 'tel:+922111234567',
    },
]

const articles = [
    {
        title: 'How to modify group reservations',
        description: 'Steps to split invoices, assign beds, and upsell add-ons without cancelling the stay.',
        href: '/assets/help-center/modify-group-reservations.pdf',
    },
    {
        title: 'Best practices for late check-ins',
        description: 'Templates and automations to guide guests arriving after midnight while keeping security tight.',
        href: '/assets/help-center/late-checkin-guide.pdf',
    },
    {
        title: 'Sync Hotling with your POS',
        description: 'Connect bar, cafe, and activity sales to the guest folio in a few minutes.',
        href: '/assets/help-center/hotling-pos-sync.pdf',
    },
]

const escalationSteps = [
    { label: 'Self-serve toolkit', description: 'Browse the knowledge base and video library for quick fixes.' },
    {
        label: 'Escalate to live agent',
        description: 'Start a chat or call. Your ticket is logged and monitored until resolved.',
    },
    {
        label: 'Follow-up & feedback',
        description: 'Rate the experience. We iterate on scripts, automations, and documentation every month.',
    },
]

const ticketReasons = [
    'Reservation issue',
    'Payment & refunds',
    'Technical support',
    'Partnership & franchise',
    'Feedback & suggestions',
]

const faqs = [
    {
        question: 'How do I reopen a closed ticket?',
        answer:
            'Reply to the original ticket email or start a chat referencing the ticket ID. Our system automatically reopens the thread and assigns the previous case owner so you keep context.',
    },
    {
        question: 'What if a guest requires a partial refund?',
        answer:
            'Initiate a refund from the Hotling dashboard: Reservations → Select booking → Adjust charges. Use the notes section to explain the reason so finance can reconcile the payout during nightly settlement.',
    },
    {
        question: 'Can I export chat transcripts for training?',
        answer:
            'Yes. From the Customer Service console, choose Transcripts → Filter by date or hostel → Export as CSV or PDF. You can also subscribe to weekly digest emails for your leadership team.',
    },
    {
        question: 'How long are support logs retained?',
        answer:
            'All tickets, call logs, and chat summaries are retained for 18 months. You can request immediate deletion of sensitive data by emailing privacy@hotling.com.',
    },
]

const CustomerService = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="px-6 sm:px-10 lg:px-16 pt-16 pb-12 bg-gradient-to-b from-white via-sky-50 to-white">
                    <div className="max-w-4xl space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-primary-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
                            Help & support
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                            Help when you need it, after the onboarding dust settles.
                        </h1>
                        <p className="text-lg text-gray-600">
                            Once Hotling is live at your hostel, this hub keeps operations steady—answering questions, resolving bugs, processing refunds, and capturing feedback so your guests stay delighted.
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm font-medium">
                            <a
                                href="https://chat.hotling.com"
                                className="inline-flex items-center rounded-full bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors"
                            >
                                Start live chat
                            </a>
                            <a
                                href="mailto:care@hotling.com"
                                className="inline-flex items-center rounded-full border border-gray-200 px-6 py-3 text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-colors"
                            >
                                Email support
                            </a>
                        </div>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 py-16 grid gap-10 lg:grid-cols-3">
                    {supportChannels.map((channel) => (
                        <div
                            key={channel.heading}
                            className="rounded-[28px] border border-gray-100 bg-white p-8 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.35)] space-y-4"
                        >
                            <h2 className="text-xl font-semibold text-gray-900">{channel.heading}</h2>
                            <p className="text-sm font-semibold text-primary-500 uppercase tracking-[0.25em]">{channel.summary}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{channel.description}</p>
                            <a href={channel.actionHref} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
                                {channel.actionLabel}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </section>

                <section className="px-6 sm:px-10 lg:px-16 pb-16 bg-white">
                    <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Submit a support request</h2>
                            <p className="text-gray-600 text-lg">
                                Tell us what you need help with and we will direct it to the right team. Attach as much detail as possible—screenshots, booking IDs, error logs—so we can respond quickly.
                            </p>
                            <form
                                className="space-y-5"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    const form = event.currentTarget
                                    const data = new FormData(form)
                                    const subject = encodeURIComponent(`Support request: ${data.get('reason')}`)
                                    const body = encodeURIComponent(
                                        `Hostel: ${data.get('hostel')}\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nTopic: ${data.get('reason')}\n\nDetails:\n${data.get('message')}`,
                                    )
                                    window.location.href = `mailto:care@hotling.com?subject=${subject}&body=${body}`
                                    form.reset()
                                }}
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Your name</label>
                                        <input
                                            name="name"
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            placeholder="Alex, Front Desk Manager"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            placeholder="you@hostel.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Hostel name</label>
                                        <input
                                            name="hostel"
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            placeholder="Hotling Skyline Suites"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Issue type</label>
                                        <select
                                            name="reason"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            defaultValue={ticketReasons[0]}
                                        >
                                            {ticketReasons.map((reason) => (
                                                <option key={reason} value={reason}>
                                                    {reason}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Describe the issue</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        placeholder="Include booking IDs, timestamps, screenshots, and steps to reproduce."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-full bg-primary-600 text-white px-6 py-3 text-sm font-semibold hover:bg-primary-700 transition-colors"
                                >
                                    Submit request
                                </button>
                            </form>
                        </div>

                        <aside className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.35)] space-y-4 h-fit">
                            <h3 className="text-xl font-semibold text-gray-900">Refund & compensation policy</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                • Same-day cancellations: guests receive a 50% refund or a voucher valid for 12 months.<br />
                                • Overbooking incidents: Hotling covers the first night at a partner hostel plus transport.<br />
                                • Service downtime over 2 hours: affected bookings receive automated goodwill credits.
                            </p>
                            <a href="/assets/policies/refund-policy.pdf" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
                                Download full refund policy
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
                                </svg>
                            </a>
                            <p className="text-xs text-gray-500">Need a manual adjustment? Escalate via chat with “refund review” in the first message.</p>
                        </aside>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 pb-16 bg-gray-50">
                    <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Help center highlights</h2>
                            <p className="text-gray-600 text-lg">
                                Prefer to self-serve? Download actionable guides from our operators, updated every quarter with new playbooks and automation templates.
                            </p>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {articles.map((article) => (
                                    <a
                                        key={article.title}
                                        href={article.href}
                                        className="rounded-2xl bg-white border border-gray-100 p-6 shadow-[0_35px_70px_-60px_rgba(15,23,42,0.35)] hover:border-primary-400 transition-colors"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{article.description}</p>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <aside className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.35)] space-y-4 h-fit">
                            <h3 className="text-xl font-semibold text-gray-900">Escalation ladder</h3>
                            <ul className="space-y-4 text-sm text-gray-600">
                                {escalationSteps.map((step) => (
                                    <li key={step.label} className="flex gap-3">
                                        <span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs font-semibold">
                                            {escalationSteps.indexOf(step) + 1}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-gray-900">{step.label}</p>
                                            <p>{step.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-gray-500">Escalations average a 92% satisfaction score—tell us where to improve.</p>
                        </aside>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 pb-16 bg-white">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Frequently asked questions</h2>
                        <p className="text-gray-600 text-lg">
                            Rapid answers to the questions we hear most after hostels launch Hotling.
                        </p>
                        <div className="space-y-4">
                            {faqs.map((faq) => (
                                <details key={faq.question} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_45px_-40px_rgba(15,23,42,0.4)]">
                                    <summary className="text-lg font-semibold text-gray-900 cursor-pointer focus:outline-none">
                                        {faq.question}
                                    </summary>
                                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 pb-20">
                    <div className="max-w-4xl mx-auto rounded-[32px] bg-black text-white p-10 shadow-[0_45px_90px_-70px_rgba(15,23,42,0.55)]">
                        <h2 className="text-3xl font-bold mb-4">Need white-glove onboarding support?</h2>
                        <p className="text-white/80 text-lg mb-6">
                            Our customer service team partners with the onboarding crew to migrate data, configure integrations, and train your staff. Talk to both teams with one click.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a href="/onboarding" className="inline-flex items-center rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-gray-200 transition-colors">
                                Visit onboarding page
                            </a>
                            <a href="mailto:care@hotling.com" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white hover:text-black transition-colors">
                                care@hotling.com
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default CustomerService

