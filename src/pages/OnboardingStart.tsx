import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

type OwnerFormState = {
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
    hostelCategory: string
    roomCount: string
    amenities: string
    startingPrice: string
    termsAgreed: boolean
}

const onboardingSteps = [
    { title: 'Owner Information', emoji: '👤' },
    { title: 'Hotel Information', emoji: '🏨' },
]

const initialFormState: OwnerFormState = {
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
    hostelType: 'mixed',
    hostelCategory: 'home2',
    roomCount: '',
    amenities: '',
    startingPrice: '',
    termsAgreed: false,
}

const OnboardingStart = () => {
    const navigate = useNavigate()
    const formRef = useRef<HTMLDivElement | null>(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [formState, setFormState] = useState<OwnerFormState>(initialFormState)
    const [formError, setFormError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const scrollToForm = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = event.target
        setFormState((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
        setFormError(null)
    }

    const validateStep1 = () => {
        if (!formState.name.trim()) {
            setFormError('Owner name is required')
            return false
        }
        if (!formState.email.trim()) {
            setFormError('Email is required')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            setFormError('Invalid email format')
            return false
        }
        if (!formState.phone.trim()) {
            setFormError('Phone number is required')
            return false
        }
        if (!formState.password.trim()) {
            setFormError('Password is required')
            return false
        }
        if (formState.password.length < 8) {
            setFormError('Password must be at least 8 characters')
            return false
        }
        if (formState.password !== formState.confirmPassword) {
            setFormError('Passwords do not match')
            return false
        }
        return true
    }

    const validateStep2 = () => {
        if (!formState.hostelName.trim()) {
            setFormError('Hotel name is required')
            return false
        }
        if (!formState.hostelCity.trim()) {
            setFormError('City is required')
            return false
        }
        if (!formState.hostelAddress.trim()) {
            setFormError('Address is required')
            return false
        }
        if (!formState.roomCount.trim() || Number(formState.roomCount) < 1) {
            setFormError('Number of rooms must be at least 1')
            return false
        }
        if (!formState.startingPrice.trim() || Number(formState.startingPrice) <= 0) {
            setFormError('Starting price must be greater than 0')
            return false
        }
        if (!formState.termsAgreed) {
            setFormError('You must agree to the Terms & Conditions')
            return false
        }
        return true
    }

    const handleNext = () => {
        if (currentStep === 0 && validateStep1()) {
            setCurrentStep(1)
            requestAnimationFrame(() => scrollToForm())
        }
    }

    const handleBack = () => {
        setFormError(null)
        setCurrentStep((prev) => Math.max(prev - 1, 0))
        requestAnimationFrame(() => scrollToForm())
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!validateStep2()) {
            return
        }

        setIsSubmitting(true)
        setFormError(null)

        setTimeout(() => {
            setIsSubmitting(false)
            alert('Registration successful! Please login to continue.')
            setFormState(initialFormState)
            navigate('/login')
        }, 500)
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
            <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div className="rounded-4xl bg-white px-6 py-8 shadow-xl sm:px-10 sm:py-10">
                        <div className="space-y-4 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Register your hotel in minutes</h1>
                            <p className="mx-auto max-w-2xl text-base text-gray-600">
                                Tell us about your property and we will help you go live quickly.
                            </p>
                        </div>
                        <div className="mt-10 grid gap-3 rounded-3xl border border-gray-100 bg-slate-50 p-5 sm:grid-cols-2">
                            {onboardingSteps.map((step, index) => {
                                const isActive = index === currentStep
                                const isCompleted = index < currentStep
                                return (
                                    <div
                                        key={step.title}
                                        className={`rounded-2xl border px-4 py-4 text-sm transition ${isActive
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : isCompleted
                                            ? 'border-green-200 bg-green-50 text-green-700'
                                            : 'border-gray-100 bg-white text-gray-500'}
                                        `}
                                    >
                                        <span className="flex items-center gap-2 font-semibold">
                                            <span role="img" aria-hidden>
                                                {step.emoji}
                                            </span>
                                            Step {index + 1}
                                        </span>
                                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">{step.title}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <section ref={formRef} className="rounded-4xl border border-gray-100 bg-white p-8 shadow-xl sm:p-10">
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {onboardingSteps[currentStep]?.emoji} {onboardingSteps[currentStep]?.title}
                            </h2>
                            <div className="h-2 w-full rounded-full bg-gray-100">
                                <div
                                    className="h-2 rounded-full bg-primary transition-all"
                                    style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {formError && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {formError}
                                </div>
                            )}

                            {currentStep === 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Full name <span className="text-red-500">*</span></label>
                                        <input
                                            name="name"
                                            value={formState.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Ahmed Raza"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={formState.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="you@hotel.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Phone number <span className="text-red-500">*</span></label>
                                        <input
                                            name="phone"
                                            value={formState.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="+92 300 1234567"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Alternate phone (optional)</label>
                                        <input
                                            name="alternatePhone"
                                            value={formState.alternatePhone}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="+92 300 1234567"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Create password <span className="text-red-500">*</span></label>
                                        <input
                                            name="password"
                                            type="password"
                                            value={formState.password}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Minimum 8 characters"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Confirm password <span className="text-red-500">*</span></label>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            value={formState.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700">Hotel/Business name (optional)</label>
                                        <input
                                            name="HostelName"
                                            value={formState.HostelName}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Your business name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Tax ID/GST (optional)</label>
                                        <input
                                            name="taxId"
                                            value={formState.taxId}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Your tax ID"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Registration number (optional)</label>
                                        <input
                                            name="registrationNumber"
                                            value={formState.registrationNumber}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Your registration number"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Hotel name <span className="text-red-500">*</span></label>
                                            <input
                                                name="hostelName"
                                                value={formState.hostelName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="Hotling Grand Islamabad"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">City <span className="text-red-500">*</span></label>
                                            <input
                                                name="hostelCity"
                                                value={formState.hostelCity}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="Islamabad"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Full address <span className="text-red-500">*</span></label>
                                            <input
                                                name="hostelAddress"
                                                value={formState.hostelAddress}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="Plot 21, Blue Area, Islamabad"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Google Maps link (optional)</label>
                                            <input
                                                name="hostelMap"
                                                value={formState.hostelMap}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="https://maps.google.com/..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Hostel type <span className="text-red-500">*</span></label>
                                            <select
                                                name="hostelType"
                                                value={formState.hostelType}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="mixed">Mixed</option>
                                                <option value="boys">Boys</option>
                                                <option value="girls">Girls</option>
                                                <option value="family">Family</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Hostel category <span className="text-red-500">*</span></label>
                                            <select
                                                name="hostelCategory"
                                                value={formState.hostelCategory}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="home2">Home</option>
                                                <option value="luxury">Luxury</option>
                                                <option value="back_pack">Back Pack</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Number of rooms <span className="text-red-500">*</span></label>
                                            <input
                                                name="roomCount"
                                                type="number"
                                                value={formState.roomCount}
                                                onChange={handleInputChange}
                                                required
                                                min={1}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="65"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Amenities (optional)</label>
                                            <textarea
                                                name="amenities"
                                                value={formState.amenities}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="Free WiFi, Rooftop pool, Airport shuttle, Private parking..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Starting price per night (PKR) <span className="text-red-500">*</span></label>
                                            <input
                                                name="startingPrice"
                                                type="number"
                                                value={formState.startingPrice}
                                                onChange={handleInputChange}
                                                required
                                                min={0}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="8500"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="inline-flex items-start gap-3 text-sm text-gray-600">
                                                <input
                                                    type="checkbox"
                                                    name="termsAgreed"
                                                    checked={formState.termsAgreed}
                                                    onChange={handleInputChange}
                                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span>I confirm that all details are accurate and I agree to the Terms & Conditions.</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="inline-flex items-center rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300"
                                    >
                                        ← Back
                                    </button>
                                )}
                                <button
                                    type={currentStep === 0 ? 'button' : 'submit'}
                                    onClick={currentStep === 0 ? handleNext : undefined}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {currentStep === 0 ? 'Next →' : isSubmitting ? 'Registering...' : 'Register my hotel'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default OnboardingStart
