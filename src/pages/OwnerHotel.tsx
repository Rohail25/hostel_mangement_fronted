import { useRef, useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/apiClient'
import Header from '../components/Header'
import Footer from '../components/Footer'

const benefits = [
    { icon: '📈', title: 'Increase your online bookings', description: 'Boost occupancy with prominent placement across Hotling search results and curated collections.' },
    { icon: '💰', title: 'Secure weekly payouts', description: 'Automated disbursements with transparent statements and downloadable invoices.' },
    { icon: '🧾', title: 'Clear commission model', description: 'Simple, performance-based pricing with no hidden fees or surprise deductions.' },
    { icon: '🧑‍💻', title: 'Manage everything in one dashboard', description: 'Update rates, inventory, and restrictions in real time on desktop or mobile.' },
    { icon: '🌍', title: 'Reach travellers worldwide', description: 'Tap into Hotling’s marketing campaigns, loyalty members, and global affiliate partners.' },
    { icon: '☎️', title: '24/7 partner support', description: 'Dedicated onboarding coaches, live chat, and hotline support whenever you need it.' },
]

const steps = [
    { number: '01', title: 'Create an account', body: 'Register as a hotel partner and verify ownership with a quick SMS or email code.' },
    { number: '02', title: 'Add property details', body: 'Share your hotel story, amenities, photos, and policies to attract the right guests.' },
    { number: '03', title: 'Set pricing & rooms', body: 'Configure room types, base rates, promotions, and availability rules in minutes.' },
    { number: '04', title: 'Start receiving bookings', body: 'Go live, get instant booking alerts, and manage guests from your Hotling dashboard.' },
]

const optionalFeatures = [
    'Revenue and booking analytics with trend insights',
    'Calendar-based availability and rate management',
    'Commission and payout tracking with downloadable statements',
    'Guest review management panel with response templates',
]

interface OwnerFormData {
    name: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    alternatePhone: string
    HostelName: string
    taxId: string
    registrationNumber: string
    hostelName: string
    hostelCity: string
    hostelAddress: string
    hostelMap: string
    hostelType: string
    roomCount: string
    amenities: string
    photos: FileList | null
    startingPrice: string
    accountTitle: string
    iban: string
    payoutFrequency: string
    termsAgreed: boolean
}

const OwnerHotel = () => {
    const navigate = useNavigate()
    const formRef = useRef<HTMLFormElement>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<OwnerFormData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        alternatePhone: '',
        HostelName: '',
        taxId: '',
        registrationNumber: '',
        hostelName: '',
        hostelCity: '',
        hostelAddress: '',
        hostelMap: '',
        hostelType: 'Luxury',
        roomCount: '',
        amenities: '',
        photos: null,
        startingPrice: '',
        accountTitle: '',
        iban: '',
        payoutFrequency: 'Weekly',
        termsAgreed: false,
    })

    const handleInputChange = (e: any) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: e.target.checked
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
        setError(null)
    }

    const handleFileChange = (e: any) => {
        setFormData(prev => ({
            ...prev,
            photos: e.target.files
        }))
    }

    const validateStep1 = (): boolean => {
        if (!formData.name.trim()) {
            setError('Owner name is required')
            return false
        }
        if (!formData.email.trim()) {
            setError('Email is required')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email format')
            return false
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required')
            return false
        }
        if (!formData.password.trim()) {
            setError('Password is required')
            return false
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters')
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return false
        }
        return true
    }

    const validateStep2 = (): boolean => {
        if (!formData.hostelName.trim()) {
            setError('Hotel name is required')
            return false
        }
        if (!formData.hostelCity.trim()) {
            setError('City is required')
            return false
        }
        if (!formData.hostelAddress.trim()) {
            setError('Address is required')
            return false
        }
        if (!formData.roomCount.trim() || parseInt(formData.roomCount) < 1) {
            setError('Number of rooms must be at least 1')
            return false
        }
        if (!formData.startingPrice.trim() || parseFloat(formData.startingPrice) <= 0) {
            setError('Starting price must be greater than 0')
            return false
        }
        if (!formData.termsAgreed) {
            setError('You must agree to the Terms & Conditions')
            return false
        }
        return true
    }

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateStep2()) {
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            // Create FormData for multipart/form-data
            const formDataToSend = new FormData()

            // Add owner info
            formDataToSend.append('name', formData.name)
            formDataToSend.append('email', formData.email)
            formDataToSend.append('phone', formData.phone)
            formDataToSend.append('password', formData.password)
            formDataToSend.append('username', formData.name.replace(/\s+/g, '_'))
            if (formData.alternatePhone) formDataToSend.append('alternatePhone', formData.alternatePhone)
            if (formData.HostelName) formDataToSend.append('HostelName', formData.HostelName)
            if (formData.taxId) formDataToSend.append('taxId', formData.taxId)
            if (formData.registrationNumber) formDataToSend.append('registrationNumber', formData.registrationNumber)

            // Create hostel data
            const hostelData = {
                name: formData.hostelName,
                type: [formData.hostelType],
                category: ['home2'],
                address: {
                    city: formData.hostelCity,
                    street: formData.hostelAddress,
                },
                amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
                contactInfo: {
                    phone: formData.phone,
                    email: formData.email,
                },
                operatingHours: {
                    checkIn: '14:00',
                    checkOut: '11:00',
                },
            }
            formDataToSend.append('hostelData', JSON.stringify(hostelData))

            // Add profile photo if any
            if (formData.photos && formData.photos.length > 0) {
                formDataToSend.append('profilePhoto', formData.photos[0])
            }

            // Step 1: Create Owner account (Public registration endpoint - no auth required)
            const ownerResponse = await api.post('/admin/owner/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (!ownerResponse.success) {
                throw new Error(ownerResponse.message || 'Failed to create owner account')
            }

            const ownerId = ownerResponse.data.id

            // Step 2: Create Hostel linked to owner
            const hostelResponse = await api.post('/admin/hostels', {
                ...hostelData,
                ownerId: ownerId,
                status: 'active',
            })

            if (!hostelResponse.success) {
                throw new Error(hostelResponse.message || 'Failed to create hostel')
            }

            // Success! Redirect to login
            alert('Registration successful! Your account has been created. Please login to continue.')
            navigate('/login')
        } catch (err: any) {
            console.error('Submission error:', err)
            setError(err.message || 'Failed to complete registration. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"
                            alt="Luxury hotel lobby"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                    <div className="relative px-6 sm:px-10 lg:px-16 py-24 text-white">
                        <div className="max-w-4xl space-y-6">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
                                Partner spotlight
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Partner with Hotling</h1>
                            <p className="text-lg text-white/90">
                                Join thousands of hotels earning more with online bookings. Showcase your property to curious travellers, manage revenue with ease, and enjoy dependable payouts backed by our hospitality experts.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#registration"
                                    className="inline-flex items-center rounded-full bg-white text-black px-7 py-3 text-sm font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Register your property
                                </a>
                                <a
                                    href="https://www.youtube.com/watch?v=5ZkH0E9KZx4"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold hover:bg-white hover:text-black transition-colors"
                                >
                                    Watch intro video
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
                    <div className="max-w-6xl mx-auto space-y-10">
                        <div className="space-y-3 text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Why owners choose Hotling</h2>
                            <p className="text-gray-600 text-lg">Grow bookings, streamline operations, and delight guests with a single platform.</p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.title}
                                    className="rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_35px_70px_-60px_rgba(15,23,42,0.35)] space-y-2"
                                >
                                    <span className="text-3xl" aria-hidden>
                                        {benefit.icon}
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 py-16 bg-gray-50">
                    <div className="max-w-6xl mx-auto space-y-10">
                        <div className="space-y-3 text-center">
                            <h2 className="text-3xl font-bold text-gray-900">From signup to first booking in four guided steps</h2>
                            <p className="text-gray-600 text-lg">Your onboarding coach and intuitive dashboard keep everything on track.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute left-1/2 top-0 hidden h-full w-1 bg-primary-100 md:block" aria-hidden />
                            <div className="grid gap-6 md:grid-cols-2">
                                {steps.map((step) => (
                                    <div
                                        key={step.number}
                                        className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_45px_90px_-70px_rgba(15,23,42,0.35)] space-y-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white text-lg font-bold">
                                                {step.number}
                                            </span>
                                            <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-[28px] bg-white border border-primary-100 p-10 shadow-[0_45px_90px_-80px_rgba(15,23,42,0.4)] space-y-6">
                            <h3 className="text-2xl font-semibold text-gray-900">Preview your dashboard</h3>
                            <p className="text-gray-600">
                                Manage bookings, monitor revenue, respond to reviews, and collaborate with your team from any device.
                            </p>
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                                <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-lg font-semibold">Today&apos;s snapshot</h4>
                                        <span className="text-sm text-white/70">Updated 3 mins ago</span>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/15 p-4">
                                            <p className="text-xs uppercase text-white/70">Upcoming check-ins</p>
                                            <p className="text-2xl font-bold">12 guests</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/15 p-4">
                                            <p className="text-xs uppercase text-white/70">Monthly revenue</p>
                                            <p className="text-2xl font-bold">Rs 2.4M</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/15 p-4">
                                            <p className="text-xs uppercase text-white/70">Rating</p>
                                            <p className="text-2xl font-bold">4.7 / 5</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/15 p-4">
                                            <p className="text-xs uppercase text-white/70">Pending reviews</p>
                                            <p className="text-2xl font-bold">5 replies</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-3xl border border-gray-100 p-6 space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900">What partners say</h4>
                                    <blockquote className="text-sm text-gray-600 leading-relaxed">
                                        “After joining Hotling, bookings increased by 40% and our staff finally has one place to manage everything.” — Skyline Suites,
                                        Lahore
                                    </blockquote>
                                    <blockquote className="text-sm text-gray-600 leading-relaxed">
                                        “Payouts land every Friday and the team helps us optimise rates for festivals.” — Azure Bay Resort, Karachi
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="registration" className="px-6 sm:px-10 lg:px-16 py-16 bg-white">
                    <div className="max-w-6xl mx-auto space-y-10">
                        <div className="space-y-3 text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Register your hotel in minutes</h2>
                            <p className="text-gray-600 text-lg">Tell us about your property and we will help you go live quickly.</p>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
                            {/* Error Message */}
                            {error && (
                                <div className="max-w-4xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Step Indicator */}
                            <div className="max-w-4xl mx-auto flex gap-4">
                                {[1, 2].map((step) => (
                                    <div key={step} className="flex-1">
                                        <div className={`h-2 rounded-full ${currentStep >= step ? 'bg-primary-600' : 'bg-gray-200'}`} />
                                        <p className="text-xs text-gray-600 mt-2 text-center">
                                            {step === 1 ? 'Owner Information' : 'Hotel Information'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Step 1: Owner Information */}
                            {currentStep === 1 && (
                                <div className="max-w-4xl mx-auto">
                                    <section className="space-y-6 rounded-[32px] border border-gray-100 bg-gray-50 p-8 shadow-[0_35px_70px_-70px_rgba(15,23,42,0.4)]">
                                        <h3 className="text-2xl font-semibold text-gray-900">Owner Information</h3>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Full name <span className="text-red-500">*</span></label>
                                            <input
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="Ahmed Raza"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="you@hotel.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Phone number <span className="text-red-500">*</span></label>
                                            <input
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="+92 300 1234567"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Alternate phone (optional)</label>
                                            <input
                                                name="alternatePhone"
                                                value={formData.alternatePhone}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="+92 300 1234567"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Create password <span className="text-red-500">*</span></label>
                                            <input
                                                name="password"
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="Minimum 8 characters"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Confirm password <span className="text-red-500">*</span></label>
                                            <input
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="Confirm password"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Hotel/Business name (optional)</label>
                                            <input
                                                name="HostelName"
                                                value={formData.HostelName}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="Your business name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Tax ID/GST (optional)</label>
                                            <input
                                                name="taxId"
                                                value={formData.taxId}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="Your tax ID"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Registration number (optional)</label>
                                            <input
                                                name="registrationNumber"
                                                value={formData.registrationNumber}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                placeholder="Your registration number"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-8 mt-8 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="inline-flex items-center rounded-full bg-primary-600 text-black px-8 py-3 text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </section>
                            </div>
                            )}

                            {/* Step 2: Hostel Information */}
                            {currentStep === 2 && (
                                <div className="max-w-4xl mx-auto">
                                    <section className="space-y-6 rounded-[32px] border border-gray-100 bg-gray-50 p-8 shadow-[0_35px_70px_-70px_rgba(15,23,42,0.4)]">
                                        <h3 className="text-2xl font-semibold text-gray-900">Hotel Information <span className="text-red-500">*</span></h3>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Hotel name</label>
                                                <input
                                                    name="hostelName"
                                                    required
                                                    value={formData.hostelName}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                    placeholder="Hotling Grand Islamabad"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">City</label>
                                                <input
                                                    name="hostelCity"
                                                    required
                                                    value={formData.hostelCity}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                    placeholder="Islamabad"
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <label className="text-sm font-semibold text-gray-700">Full address</label>
                                                <input
                                                    name="hostelAddress"
                                                    required
                                                    value={formData.hostelAddress}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                    placeholder="Plot 21, Blue Area, Islamabad"
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <label className="text-sm font-semibold text-gray-700">Google Maps link (optional)</label>
                                                <input
                                                    name="hostelMap"
                                                    value={formData.hostelMap}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                    placeholder="https://maps.google.com/..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Hotel type</label>
                                                <select
                                                    name="hostelType"
                                                    value={formData.hostelType}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                >
                                                    <option>Luxury</option>
                                                    <option>Business</option>
                                                    <option>Budget</option>
                                                    <option>Guest House</option>
                                                    <option>Resort</option>
                                                    <option>Boutique</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Number of rooms</label>
                                                <input
                                                    name="roomCount"
                                                    type="number"
                                                    min={1}
                                                    required
                                                    value={formData.roomCount}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                    placeholder="65"
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <label className="text-sm font-semibold text-gray-700">Amenities (optional)</label>
                                                <textarea
                                                    name="amenities"
                                                    rows={3}
                                                    value={formData.amenities}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                    placeholder="Free WiFi, Rooftop pool, Airport shuttle, Private parking..."
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <label className="text-sm font-semibold text-gray-700">Upload hotel photos (optional)</label>
                                                <input
                                                    name="photos"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="w-full rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                />
                                                <p className="text-xs text-gray-500">First photo will be used as profile photo</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Starting price per night (PKR)</label>
                                                <input
                                                    name="startingPrice"
                                                    type="number"
                                                    min={0}
                                                    required
                                                    value={formData.startingPrice}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                                                    placeholder="8500"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <div className="space-y-4 mt-10">
                                        <label className="inline-flex items-start gap-3 text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                name="termsAgreed"
                                                required
                                                checked={formData.termsAgreed}
                                                onChange={handleInputChange}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span>
                                                I confirm that all details are accurate and I agree to the{' '}
                                                <a href="/terms" className="text-primary-600 underline hover:text-primary-700">
                                                    Terms &amp; Conditions
                                                </a>
                                                .
                                            </span>
                                        </label>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(1)}
                                                className="inline-flex items-center rounded-full bg-gray-200 text-gray-700 px-8 py-3 text-sm font-semibold hover:bg-gray-300 transition-colors"
                                            >
                                                ← Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="inline-flex items-center rounded-full bg-blue-100 text-black px-8 py-3 text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Registering...' : 'Register my hotel'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </section>

                <section className="px-6 sm:px-10 lg:px-16 pb-16 bg-gray-50">
                    <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-gray-900">What&apos;s coming next</h2>
                            <p className="text-gray-600">
                                We are building even more power tools for partners who want to scale fast without complicating operations.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {optionalFeatures.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <span className="mt-1 text-primary-500">◆</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_45px_90px_-70px_rgba(15,23,42,0.35)] space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">Need help getting started?</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Reach out to our Partner Support Team any time. We assist with listings, pricing, operations, and post-stay experiences.
                            </p>
                            <div className="space-y-2 text-sm font-semibold text-primary-600">
                                <a href="mailto:partners@hotling.com" className="flex items-center gap-2 hover:text-primary-700">
                                    <span>✉️</span>
                                    partners@hotling.com
                                </a>
                                <a href="https://wa.me/923001234567" className="flex items-center gap-2 hover:text-primary-700">
                                    <span>📱</span>
                                    WhatsApp: +92 300 123 4567
                                </a>
                                <a href="tel:+922111234567" className="flex items-center gap-2 hover:text-primary-700">
                                    <span>📞</span>
                                    Hotline: +92 21 112 345 67
                                </a>
                            </div>
                            <a
                                href="https://chat.hotling.com"
                                className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-900 transition-colors"
                            >
                                Open partner live chat
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default OwnerHotel


