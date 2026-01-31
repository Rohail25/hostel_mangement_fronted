import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { blogArticles } from '../data/blogArticles'
import type { BlogCategory } from '../data/blogArticles'

const Blogs = () => {
    const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All')
    const [searchTerm, setSearchTerm] = useState('')

    const categories: (BlogCategory | 'All')[] = ['All', ...Array.from(new Set(blogArticles.map((article) => article.category)))]

    const visibleArticles = useMemo(() => {
        return blogArticles.filter((article) => {
            const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
            const query = searchTerm.trim().toLowerCase()
            const matchesSearch =
                query.length === 0 ||
                article.title.toLowerCase().includes(query) ||
                article.hotel.toLowerCase().includes(query) ||
                article.location.toLowerCase().includes(query)
            return matchesCategory && matchesSearch
        })
    }, [selectedCategory, searchTerm])

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="px-6 sm:px-10 lg:px-16 pt-16 pb-12 bg-gradient-to-b from-white via-sky-50 to-white">
                    <div className="max-w-4xl">
                        <p className="text-sm uppercase tracking-[0.35em] text-primary-500 font-semibold mb-3">hotling stories</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Blogs to plan your next hostel stay.</h1>
                        <p className="text-lg text-gray-600">
                            Spotlights on our favourite hostels, neighbourhood itineraries, and insider tips to make every Hotling night a story worth retelling.
                        </p>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 pb-20">
                    <div className="flex flex-wrap items-center gap-4 justify-between rounded-3xl border border-gray-100 bg-white shadow-[0_35px_70px_-45px_rgba(15,23,42,0.35)] p-5 mb-10">
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setSelectedCategory(category === 'All' ? 'All' : category)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${selectedCategory === category
                                        ? 'bg-black text-white shadow-[0_15px_35px_-25px_rgba(15,23,42,0.45)]'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search by hostel, city, or topic"
                            className="min-w-[220px] flex-1 sm:flex-none rounded-full border border-gray-200 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {visibleArticles.map((article) => (
                            <article key={article.id} className="group rounded-[30px] bg-white border border-gray-100 overflow-hidden shadow-[0_45px_90px_-60px_rgba(15,23,42,0.45)]">
                                <div className="h-56 bg-gray-100 overflow-hidden">
                                    <img
                                        src={article.heroImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-7 space-y-4">
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary-500">
                                        <span>{article.category}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{article.readTime}</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{article.title}</h2>
                                    <p className="text-sm text-gray-600 leading-relaxed">{article.summary}</p>
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                                        <span>{article.hotel}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{article.location}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                    <Link
                                        to={`/blogs/${article.id}`}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                                    >
                                        Read story
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    {visibleArticles.length === 0 && (
                        <div className="mt-16 rounded-3xl bg-gray-50 border border-dashed border-gray-300 py-16 text-center">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories match your filters.</h3>
                            <p className="text-gray-500">Adjust the category or try a different search phrase.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Blogs

