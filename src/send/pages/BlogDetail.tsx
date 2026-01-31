import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { blogArticles } from '../data/blogArticles'

const BlogDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const article = blogArticles.find((item) => item.id === id) ?? blogArticles[0]

    if (!article) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center px-6 py-24 text-center">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-semibold text-gray-900">No blogs available</h1>
                        <p className="text-gray-600">Check back soon for the latest Hotling travel stories.</p>
                        <button
                            type="button"
                            onClick={() => navigate('/blogs')}
                            className="inline-flex items-center rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-gray-900 transition-colors"
                        >
                            Back to Blogs
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="relative h-[380px] sm:h-[460px] overflow-hidden">
                    <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5" />
                    <div className="absolute inset-x-0 bottom-0 px-6 sm:px-10 lg:px-16 pb-12">
                        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white mb-6">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to blogs
                        </Link>
                        <div className="max-w-3xl text-white space-y-3">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]">
                                <span>{article.category}</span>
                                <span className="text-white/50">•</span>
                                <span>{article.readTime}</span>
                                <span className="text-white/50">•</span>
                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{article.title}</h1>
                            <p className="text-white/80 text-sm sm:text-base">
                                {article.summary}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                                <span>{article.hotel}</span>
                                <span className="text-white/40">•</span>
                                <span>{article.location}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <article className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
                    <div className="max-w-4xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <div className="space-y-10 text-lg text-gray-700 leading-relaxed">
                            {article.content.map((paragraph, index) => (
                                <div key={index} className="space-y-3">
                                    <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                                        {index === 0 && 'Arrive Above the Skyline'}
                                        {index === 1 && 'Morning Rituals with Pour-Over Coffee'}
                                        {index === 2 && 'Community by Day'}
                                        {index === 3 && 'Sunset Transformations'}
                                        {index === 4 && 'Design that Adapts to You'}
                                        {index === 5 && 'Insider Tip'}
                                    </h2>
                                    <p>{paragraph}</p>
                                </div>
                            ))}
                        </div>

                        <aside className="hidden lg:flex flex-col gap-6 sticky top-28 self-start">
                            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.35)] space-y-3">
                                <h3 className="text-lg font-semibold text-gray-900">At a glance</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li><span className="font-semibold text-gray-800">Hotel:</span> {article.hotel}</li>
                                    <li><span className="font-semibold text-gray-800">Location:</span> {article.location}</li>
                                    <li><span className="font-semibold text-gray-800">Category:</span> {article.category}</li>
                                    <li><span className="font-semibold text-gray-800">Read time:</span> {article.readTime}</li>
                                    <li><span className="font-semibold text-gray-800">Published:</span> {new Date(article.publishedAt).toLocaleDateString()}</li>
                                </ul>
                            </div>

                            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.3)] space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Plan your stay</h3>
                                <p className="text-sm text-gray-600">Ready to experience this hostel? Browse availability, plan excursions, or speak with our travel concierge.</p>
                                <a
                                    href="/hostels"
                                    className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-gray-900 transition-colors"
                                >
                                    Explore hostels
                                </a>
                            </div>
                        </aside>
                    </div>

                    {article.gallery && article.gallery.length > 0 && (
                        <div className="max-w-5xl mx-auto mt-14 grid gap-6 md:grid-cols-2">
                            {article.gallery.map((image, index) => (
                                <div key={image} className={`rounded-3xl overflow-hidden shadow-[0_35px_80px_-55px_rgba(15,23,42,0.45)] ${index === 0 ? 'md:col-span-2 h-80' : 'h-64'}`}>
                                    <img src={image} alt={`${article.title} gallery ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto mt-12 flex flex-wrap items-center justify-between gap-4 text-sm font-medium">
                        <span className="text-gray-500">Share this story:</span>
                        <div className="flex gap-3">
                            <a href="https://www.facebook.com" className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors">Facebook</a>
                            <a href="https://www.instagram.com" className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors">Instagram</a>
                            <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.summary)}`} className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors">Email</a>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    )
}

export default BlogDetail

