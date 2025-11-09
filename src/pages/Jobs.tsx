import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

type JobType = 'Full-time' | 'Part-time' | 'Remote' | 'Contract'

interface JobVacancy {
    id: string
    title: string
    location: string
    type: JobType
    department: string
    description: string
    postedAt: string
}

const initialJobs: JobVacancy[] = [
    {
        id: 'job-1',
        title: 'Front Desk Executive',
        location: 'Karachi, PK',
        type: 'Full-time',
        department: 'Operations',
        description: 'Welcome guests, manage check-ins/check-outs, and deliver a delightful Hotling experience at our flagship hostel.',
        postedAt: '2024-05-02',
    },
    {
        id: 'job-2',
        title: 'Partnerships Manager',
        location: 'Remote',
        type: 'Remote',
        department: 'Growth',
        description: 'Identify new franchise partners, nurture leads, and help us grow the Hotling footprint in emerging travel destinations.',
        postedAt: '2024-04-28',
    },
    {
        id: 'job-3',
        title: 'Experience Host',
        location: 'Hunza Valley, PK',
        type: 'Contract',
        department: 'Experiences',
        description: 'Host curated travel experiences, coordinate local guides, and ensure guests unlock the best offbeat adventures.',
        postedAt: '2024-04-15',
    },
]

const jobTypes: JobType[] = ['Full-time', 'Part-time', 'Remote', 'Contract']

const Jobs = () => {
    const [jobs, setJobs] = useState<JobVacancy[]>(initialJobs)
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [type, setType] = useState<JobType>('Full-time')
    const [department, setDepartment] = useState('')
    const [description, setDescription] = useState('')
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState<JobType | 'All'>('All')

    const handleAddJob = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!title.trim() || !location.trim() || !department.trim() || !description.trim()) {
            return
        }

        const newJob: JobVacancy = {
            id: `job-${Date.now()}`,
            title: title.trim(),
            location: location.trim(),
            type,
            department: department.trim(),
            description: description.trim(),
            postedAt: new Date().toISOString().slice(0, 10),
        }

        setJobs((prev) => [newJob, ...prev])
        setTitle('')
        setLocation('')
        setDepartment('')
        setDescription('')
        setType('Full-time')
    }

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesType = filterType === 'All' || job.type === filterType
            const term = search.toLowerCase()
            const matchesSearch =
                job.title.toLowerCase().includes(term) ||
                job.location.toLowerCase().includes(term) ||
                job.department.toLowerCase().includes(term)
            return matchesType && matchesSearch
        })
    }, [jobs, filterType, search])

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="px-6 sm:px-10 lg:px-16 pt-16 pb-10 bg-gradient-to-b from-sky-50 via-white to-white">
                    <div className="max-w-3xl">
                        <p className="text-sm uppercase tracking-[0.35em] text-primary-500 font-semibold mb-3">careers @ hotling</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Build the future of social travel.</h1>
                        <p className="text-lg text-gray-600">
                            We are a collective of dreamers, backpackers, and builders. Post open roles, track applications, and grow teams that make every stay unforgettable.
                        </p>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 pb-16 grid gap-12 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.25)]">
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by role, location, or department"
                                className="flex-1 min-w-[220px] rounded-full border border-gray-200 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                            <select
                                value={filterType}
                                onChange={(event) => setFilterType(event.target.value as JobType | 'All')}
                                className="rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                            >
                                <option value="All">All types</option>
                                {jobTypes.map((jobType) => (
                                    <option key={jobType} value={jobType}>
                                        {jobType}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-6">
                            {filteredJobs.length === 0 && (
                                <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No vacancies found</h3>
                                    <p className="text-gray-500">Try clearing filters or post a new job using the form.</p>
                                </div>
                            )}

                            {filteredJobs.map((job) => (
                                <article key={job.id} className="rounded-3xl border border-gray-100 bg-white shadow-[0_32px_60px_-40px_rgba(15,23,42,0.35)] overflow-hidden p-8">
                                    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-primary-600 uppercase tracking-[0.3em] mb-4">
                                        <span>{job.department}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{job.type}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{new Date(job.postedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-3">
                                            <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.25em]">{job.location}</p>
                                        </div>
                                        <a
                                            href={`mailto:careers@hotling.com?subject=Application%20for%20${encodeURIComponent(job.title)}`}
                                            className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-gray-900 transition-colors"
                                        >
                                            Apply now
                                        </a>
                                    </div>
                                    <p className="mt-6 text-gray-600 leading-relaxed">{job.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_25px_60px_-35px_rgba(15,23,42,0.3)] p-8 sticky top-28">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Post a vacancy</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Add open roles and share them with the Hotling community. All postings stay private to your session.
                            </p>

                            <form className="space-y-4" onSubmit={handleAddJob}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Role title</label>
                                    <input
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        placeholder="e.g. Hostel Manager"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        value={location}
                                        onChange={(event) => setLocation(event.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        placeholder="City, Country or Remote"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Job type</label>
                                        <select
                                            value={type}
                                            onChange={(event) => setType(event.target.value as JobType)}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        >
                                            {jobTypes.map((jobType) => (
                                                <option key={jobType} value={jobType}>
                                                    {jobType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Department</label>
                                        <input
                                            value={department}
                                            onChange={(event) => setDepartment(event.target.value)}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            placeholder="e.g. Operations"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Role summary</label>
                                    <textarea
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        placeholder="Tell candidates what the role is about..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-full bg-[#F4603C] text-white font-semibold py-3 mt-2 shadow-[0_15px_35px_-20px_rgba(244,96,60,0.9)] hover:bg-[#e04e2b] transition-colors"
                                >
                                    Publish vacancy
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Jobs

