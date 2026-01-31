import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'

type NullableFile = File | null

type FormState = {
    ownerName: string
    ownerEmail: string
    ownerPhone: string
    ownerPassword: string
    ownerCnic: string
    ownerProfilePicture: NullableFile
    ownerAddress: string
    propertyName: string
    propertyType: string
    propertyDescriptionShort: string
    propertyDescriptionLong: string
    propertyCategory: string
    propertyRegistration: string
    propertyCountry: string
    propertyCity: string
    propertyAddress: string
    propertyMapLink: string
    propertyContactEmail: string
    propertyContactPhone: string
    propertyWebsite: string
    propertyAmenities: string
    propertyFoodServices: string
    propertySafety: string
    propertyAccessibility: string
    propertyLanguages: string
    propertyCheckIn: string
    propertyCheckOut: string
    roomType: string
    roomCount: string
    roomPrice: string
    roomMaxGuests: string
    roomFacilities: string
    roomImages: File[]
    paymentMethod: string
    paymentAccountTitle: string
    paymentBankName: string
    paymentAccountNumber: string
    paymentCommission: string
    paymentTaxNumber: string
    propertyExteriorPhoto: NullableFile
    propertyLobbyPhoto: NullableFile
    propertyRoomPhotos: File[]
    propertyBathroomPhotos: File[]
    propertyDiningPhotos: File[]
    verificationCnicFront: NullableFile
    verificationCnicBack: NullableFile
    verificationBusinessCert: NullableFile
    verificationOwnershipProof: NullableFile
    verificationVideo: NullableFile
    agreeTerms: boolean
    agreeCommissionPolicy: boolean
    confirmInformation: boolean
}

const onboardingSteps = [
    { title: 'Owner Personal Details', emoji: '👤' },
    { title: 'Hotel / Hostel Basic Information', emoji: '🏨' },
    { title: 'Property Facilities', emoji: '🏠' },
    { title: 'Room Details', emoji: '🛏️' },
    { title: 'Payment & Payout Details', emoji: '💳' },
    { title: 'Property Images', emoji: '📸' },
    { title: 'Verification Documents', emoji: '📜' },
    { title: 'Terms & Conditions', emoji: '⚙️' },
    { title: 'Final Review', emoji: '🚀' },
]

const initialFormState: FormState = {
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerPassword: '',
    ownerCnic: '',
    ownerProfilePicture: null,
    ownerAddress: '',
    propertyName: '',
    propertyType: '',
    propertyDescriptionShort: '',
    propertyDescriptionLong: '',
    propertyCategory: '',
    propertyRegistration: '',
    propertyCountry: '',
    propertyCity: '',
    propertyAddress: '',
    propertyMapLink: '',
    propertyContactEmail: '',
    propertyContactPhone: '',
    propertyWebsite: '',
    propertyAmenities: '',
    propertyFoodServices: '',
    propertySafety: '',
    propertyAccessibility: '',
    propertyLanguages: '',
    propertyCheckIn: '',
    propertyCheckOut: '',
    roomType: '',
    roomCount: '',
    roomPrice: '',
    roomMaxGuests: '',
    roomFacilities: '',
    roomImages: [],
    paymentMethod: '',
    paymentAccountTitle: '',
    paymentBankName: '',
    paymentAccountNumber: '',
    paymentCommission: '',
    paymentTaxNumber: '',
    propertyExteriorPhoto: null,
    propertyLobbyPhoto: null,
    propertyRoomPhotos: [],
    propertyBathroomPhotos: [],
    propertyDiningPhotos: [],
    verificationCnicFront: null,
    verificationCnicBack: null,
    verificationBusinessCert: null,
    verificationOwnershipProof: null,
    verificationVideo: null,
    agreeTerms: false,
    agreeCommissionPolicy: false,
    confirmInformation: false,
}

type TextInputProps = {
    label: string
    name: keyof FormState
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    type?: string
    placeholder?: string
    required?: boolean
}

const TextInput = ({ label, name, value, onChange, type = 'text', placeholder, required = false }: TextInputProps) => (
    <label className="block space-y-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <input
            name={name as string}
            value={value}
            type={type}
            required={required}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </label>
)

type TextareaInputProps = {
    label: string
    name: keyof FormState
    value: string
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    required?: boolean
    rows?: number
}

const TextareaInput = ({ label, name, value, onChange, placeholder, required = false, rows = 3 }: TextareaInputProps) => (
    <label className="block space-y-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <textarea
            name={name as string}
            value={value}
            required={required}
            rows={rows}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </label>
)

type SelectInputProps = {
    label: string
    name: keyof FormState
    value: string
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void
    options: Array<{ label: string; value: string }>
    placeholder?: string
    required?: boolean
}

const SelectInput = ({ label, name, value, onChange, options, placeholder = 'Select', required = false }: SelectInputProps) => (
    <label className="block space-y-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <select
            name={name as string}
            value={value}
            required={required}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </label>
)

type FileInputProps = {
    label: string
    name: keyof FormState
    accept?: string
    required?: boolean
    multiple?: boolean
    onFileChange: (files: FileList | null) => void
    summary?: string | null
}

const FileInput = ({ label, name, accept, required = false, multiple = false, onFileChange, summary }: FileInputProps) => (
    <label className="block space-y-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <input
            name={name as string}
            type="file"
            accept={accept}
            required={required}
            multiple={multiple}
            onChange={(event) => onFileChange(event.target.files)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {summary && <p className="text-sm text-gray-500">{summary}</p>}
    </label>
)

const OnboardingStart = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [formState, setFormState] = useState<FormState>(initialFormState)
    const [formError, setFormError] = useState<string | null>(null)
    const [submissionComplete, setSubmissionComplete] = useState(false)
    const formRef = useRef<HTMLDivElement | null>(null)

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
    }

    const handleFileChange = (name: keyof FormState, files: FileList | null, allowMultiple = false) => {
        if (!files) {
            setFormState((prev) => ({
                ...prev,
                [name]: allowMultiple ? [] : null,
            }))
            return
        }

        setFormState((prev) => ({
            ...prev,
            [name]: allowMultiple ? Array.from(files) : files[0] ?? null,
        }))
    }

    const handleBack = () => {
        setFormError(null)
        setCurrentStep((prev) => Math.max(prev - 1, 0))
        requestAnimationFrame(() => scrollToForm())
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (currentStep === 7) {
            if (!formState.agreeTerms || !formState.agreeCommissionPolicy || !formState.confirmInformation) {
                setFormError('Please agree to the terms, commission policy, and confirm that your information is accurate.')
                return
            }
        }

        setFormError(null)

        const isLastStep = currentStep === onboardingSteps.length - 1
        if (!isLastStep) {
            setCurrentStep((prev) => prev + 1)
            requestAnimationFrame(() => scrollToForm())
            return
        }

        setSubmissionComplete(true)
        alert('Thank you! Your onboarding request has been submitted for admin verification.')
        setFormState(initialFormState)
        requestAnimationFrame(() => scrollToForm())
    }

    const renderFileSummary = (files: File[]) => {
        if (files.length === 0) return null
        return `${files.length} file${files.length > 1 ? 's' : ''} selected`
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="grid gap-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="Full Name"
                                name="ownerName"
                                value={formState.ownerName}
                                onChange={handleInputChange}
                                required
                                placeholder="Ayesha Khan"
                            />
                            <TextInput
                                label="Email Address"
                                name="ownerEmail"
                                type="email"
                                value={formState.ownerEmail}
                                onChange={handleInputChange}
                                required
                                placeholder="owner@example.com"
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="Phone Number (WhatsApp preferred)"
                                name="ownerPhone"
                                value={formState.ownerPhone}
                                onChange={handleInputChange}
                                required
                                placeholder="+92 300 1234567"
                            />
                            <TextInput
                                label="Password"
                                name="ownerPassword"
                                type="password"
                                value={formState.ownerPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Minimum 8 characters"
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="CNIC / National ID Number"
                                name="ownerCnic"
                                value={formState.ownerCnic}
                                onChange={handleInputChange}
                                required
                                placeholder="35202-1234567-1"
                            />
                            <FileInput
                                label="Profile Picture (optional)"
                                name="ownerProfilePicture"
                                accept="image/*"
                                onFileChange={(files) => handleFileChange('ownerProfilePicture', files)}
                                summary={
                                    formState.ownerProfilePicture ? `Selected: ${formState.ownerProfilePicture.name}` : null
                                }
                            />
                        </div>
                        <TextareaInput
                            label="Residential / Office Address"
                            name="ownerAddress"
                            value={formState.ownerAddress}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            placeholder="Street, area, city"
                        />
                    </div>
                )
            case 1:
                return (
                    <div className="grid gap-6">
                        <TextInput
                            label="Property Name"
                            name="propertyName"
                            value={formState.propertyName}
                            onChange={handleInputChange}
                            required
                            placeholder="Hotling Signature Lahore"
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <SelectInput
                                label="Type"
                                name="propertyType"
                                value={formState.propertyType}
                                onChange={handleInputChange}
                                required
                                options={[
                                    { value: 'Hotel', label: 'Hotel' },
                                    { value: 'Hostel', label: 'Hostel' },
                                    { value: 'Guest House', label: 'Guest House' },
                                    { value: 'Resort', label: 'Resort' },
                                ]}
                                placeholder="Select type"
                            />
                            <TextInput
                                label="Category or Star Rating"
                                name="propertyCategory"
                                value={formState.propertyCategory}
                                onChange={handleInputChange}
                                placeholder="4 Star Boutique"
                            />
                        </div>
                        <TextareaInput
                            label="Short Description"
                            name="propertyDescriptionShort"
                            value={formState.propertyDescriptionShort}
                            onChange={handleInputChange}
                            required
                            rows={2}
                            placeholder="Highlight your signature experience in under 200 characters."
                        />
                        <TextareaInput
                            label="Long Description"
                            name="propertyDescriptionLong"
                            value={formState.propertyDescriptionLong}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            placeholder="Tell guests what makes your stay special, your neighbourhood, and services."
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="Business Registration Number (optional)"
                                name="propertyRegistration"
                                value={formState.propertyRegistration}
                                onChange={handleInputChange}
                                placeholder="SECP-1234567"
                            />
                            <TextInput
                                label="Website or Social Media Links"
                                name="propertyWebsite"
                                value={formState.propertyWebsite}
                                onChange={handleInputChange}
                                placeholder="https://instagram.com/yourproperty"
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-3">
                            <TextInput
                                label="Country"
                                name="propertyCountry"
                                value={formState.propertyCountry}
                                onChange={handleInputChange}
                                required
                                placeholder="Pakistan"
                            />
                            <TextInput
                                label="City"
                                name="propertyCity"
                                value={formState.propertyCity}
                                onChange={handleInputChange}
                                required
                                placeholder="Islamabad"
                            />
                            <TextareaInput
                                label="Complete Address"
                                name="propertyAddress"
                                value={formState.propertyAddress}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                placeholder="Street, area, building name, nearby landmark."
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="Google Map Location / Pin"
                                name="propertyMapLink"
                                value={formState.propertyMapLink}
                                onChange={handleInputChange}
                                placeholder="https://goo.gl/maps/..."
                            />
                            <div className="space-y-4">
                                <TextInput
                                    label="Contact Email"
                                    name="propertyContactEmail"
                                    type="email"
                                    value={formState.propertyContactEmail}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="frontdesk@hotel.com"
                                />
                                <TextInput
                                    label="Contact Phone"
                                    name="propertyContactPhone"
                                    value={formState.propertyContactPhone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="+92 42 111 222 333"
                                />
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="grid gap-6">
                        <TextareaInput
                            label="Amenities"
                            name="propertyAmenities"
                            value={formState.propertyAmenities}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            placeholder="Wi-Fi, Parking, Laundry, Kitchen..."
                        />
                        <TextareaInput
                            label="Food Services"
                            name="propertyFoodServices"
                            value={formState.propertyFoodServices}
                            onChange={handleInputChange}
                            required
                            rows={2}
                            placeholder="Breakfast buffet, onsite restaurant, room service..."
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextareaInput
                                label="Safety Features"
                                name="propertySafety"
                                value={formState.propertySafety}
                                onChange={handleInputChange}
                                required
                                rows={2}
                                placeholder="CCTV, Fire extinguishers, 24/7 security..."
                            />
                            <TextareaInput
                                label="Accessibility Options"
                                name="propertyAccessibility"
                                value={formState.propertyAccessibility}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="Elevator, Wheelchair access, Accessible washrooms..."
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="Languages Spoken"
                                name="propertyLanguages"
                                value={formState.propertyLanguages}
                                onChange={handleInputChange}
                                required
                                placeholder="English, Urdu, Punjabi"
                            />
                            <div className="grid gap-3">
                                <TextInput
                                    label="Check-in Time"
                                    name="propertyCheckIn"
                                    type="time"
                                    value={formState.propertyCheckIn}
                                    onChange={handleInputChange}
                                    required
                                />
                                <TextInput
                                    label="Check-out Time"
                                    name="propertyCheckOut"
                                    type="time"
                                    value={formState.propertyCheckOut}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="grid gap-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="Room Type"
                                name="roomType"
                                value={formState.roomType}
                                onChange={handleInputChange}
                                required
                                placeholder="Single, Deluxe, Suite..."
                            />
                            <TextInput
                                label="Total Number of Rooms"
                                name="roomCount"
                                type="number"
                                value={formState.roomCount}
                                onChange={handleInputChange}
                                required
                                placeholder="25"
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="Price per Night"
                                name="roomPrice"
                                type="number"
                                value={formState.roomPrice}
                                onChange={handleInputChange}
                                required
                                placeholder="5500"
                            />
                            <TextInput
                                label="Maximum Guests per Room"
                                name="roomMaxGuests"
                                type="number"
                                value={formState.roomMaxGuests}
                                onChange={handleInputChange}
                                required
                                placeholder="3"
                            />
                        </div>
                        <TextareaInput
                            label="Room Facilities"
                            name="roomFacilities"
                            value={formState.roomFacilities}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            placeholder="AC, TV, Ensuite bathroom, Work desk..."
                        />
                        <FileInput
                            label="Room Images"
                            name="roomImages"
                            accept="image/*"
                            multiple
                            onFileChange={(files) => handleFileChange('roomImages', files, true)}
                            summary={renderFileSummary(formState.roomImages)}
                        />
                    </div>
                )
            case 4:
                return (
                    <div className="grid gap-6">
                        <SelectInput
                            label="Payment Method"
                            name="paymentMethod"
                            value={formState.paymentMethod}
                            onChange={handleInputChange}
                            required
                            placeholder="Select payout method"
                            options={[
                                { value: 'Bank', label: 'Bank' },
                                { value: 'JazzCash', label: 'JazzCash' },
                                { value: 'Easypaisa', label: 'Easypaisa' },
                            ]}
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="Account Title"
                                name="paymentAccountTitle"
                                value={formState.paymentAccountTitle}
                                onChange={handleInputChange}
                                required
                                placeholder="Hotling Hospitality Pvt. Ltd."
                            />
                            <TextInput
                                label="Bank Name"
                                name="paymentBankName"
                                value={formState.paymentBankName}
                                onChange={handleInputChange}
                                required
                                placeholder="Meezan Bank"
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextInput
                                label="IBAN / Account Number"
                                name="paymentAccountNumber"
                                value={formState.paymentAccountNumber}
                                onChange={handleInputChange}
                                required
                                placeholder="PK12MEZN0000000000000000"
                            />
                            <TextInput
                                label="Commission Agreement Percentage"
                                name="paymentCommission"
                                type="number"
                                value={formState.paymentCommission}
                                onChange={handleInputChange}
                                required
                                placeholder="18"
                            />
                        </div>
                        <TextInput
                            label="Tax / NTN (optional)"
                            name="paymentTaxNumber"
                            value={formState.paymentTaxNumber}
                            onChange={handleInputChange}
                            placeholder="NTN-1234567-8"
                        />
                    </div>
                )
            case 5:
                return (
                    <div className="grid gap-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <FileInput
                                label="Exterior Photo"
                                name="propertyExteriorPhoto"
                                accept="image/*"
                                required
                                onFileChange={(files) => handleFileChange('propertyExteriorPhoto', files)}
                                summary={
                                    formState.propertyExteriorPhoto ? `Selected: ${formState.propertyExteriorPhoto.name}` : null
                                }
                            />
                            <FileInput
                                label="Reception / Lobby Photo"
                                name="propertyLobbyPhoto"
                                accept="image/*"
                                required
                                onFileChange={(files) => handleFileChange('propertyLobbyPhoto', files)}
                                summary={
                                    formState.propertyLobbyPhoto ? `Selected: ${formState.propertyLobbyPhoto.name}` : null
                                }
                            />
                        </div>
                        <FileInput
                            label="Room Photos"
                            name="propertyRoomPhotos"
                            accept="image/*"
                            required
                            multiple
                            onFileChange={(files) => handleFileChange('propertyRoomPhotos', files, true)}
                            summary={renderFileSummary(formState.propertyRoomPhotos)}
                        />
                        <FileInput
                            label="Bathroom Photos"
                            name="propertyBathroomPhotos"
                            accept="image/*"
                            multiple
                            onFileChange={(files) => handleFileChange('propertyBathroomPhotos', files, true)}
                            summary={renderFileSummary(formState.propertyBathroomPhotos)}
                        />
                        <FileInput
                            label="Dining / Common Area Photos"
                            name="propertyDiningPhotos"
                            accept="image/*"
                            multiple
                            onFileChange={(files) => handleFileChange('propertyDiningPhotos', files, true)}
                            summary={renderFileSummary(formState.propertyDiningPhotos)}
                        />
                    </div>
                )
            case 6:
                return (
                    <div className="grid gap-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <FileInput
                                label="CNIC / ID Front"
                                name="verificationCnicFront"
                                accept="image/*,application/pdf"
                                required
                                onFileChange={(files) => handleFileChange('verificationCnicFront', files)}
                                summary={
                                    formState.verificationCnicFront ? `Selected: ${formState.verificationCnicFront.name}` : null
                                }
                            />
                            <FileInput
                                label="CNIC / ID Back"
                                name="verificationCnicBack"
                                accept="image/*,application/pdf"
                                required
                                onFileChange={(files) => handleFileChange('verificationCnicBack', files)}
                                summary={
                                    formState.verificationCnicBack ? `Selected: ${formState.verificationCnicBack.name}` : null
                                }
                            />
                        </div>
                        <FileInput
                            label="Business Registration Certificate"
                            name="verificationBusinessCert"
                            accept="image/*,application/pdf"
                            onFileChange={(files) => handleFileChange('verificationBusinessCert', files)}
                            summary={
                                formState.verificationBusinessCert
                                    ? `Selected: ${formState.verificationBusinessCert.name}`
                                    : null
                            }
                        />
                        <FileInput
                            label="Ownership Proof (Utility Bill, Lease, etc.)"
                            name="verificationOwnershipProof"
                            accept="image/*,application/pdf"
                            required
                            onFileChange={(files) => handleFileChange('verificationOwnershipProof', files)}
                            summary={
                                formState.verificationOwnershipProof
                                    ? `Selected: ${formState.verificationOwnershipProof.name}`
                                    : null
                            }
                        />
                        <FileInput
                            label="Optional Video Verification"
                            name="verificationVideo"
                            accept="video/*"
                            onFileChange={(files) => handleFileChange('verificationVideo', files)}
                            summary={formState.verificationVideo ? `Selected: ${formState.verificationVideo.name}` : null}
                        />
                    </div>
                )
            case 7:
                return (
                    <div className="grid gap-4">
                        <p className="text-gray-600">
                            Please review and agree to our platform policies to continue. These agreements help protect both property
                            owners and guests across every booking.
                        </p>
                        <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formState.agreeTerms}
                                onChange={handleInputChange}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">
                                I agree to the platform Terms & Conditions governing listings, guest interactions, and service-level
                                standards.
                            </span>
                        </label>
                        <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                            <input
                                type="checkbox"
                                name="agreeCommissionPolicy"
                                checked={formState.agreeCommissionPolicy}
                                onChange={handleInputChange}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">
                                I agree to the commission and payout policy, including settlement cycles and dispute resolution.
                            </span>
                        </label>
                        <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                            <input
                                type="checkbox"
                                name="confirmInformation"
                                checked={formState.confirmInformation}
                                onChange={handleInputChange}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">
                                I confirm that all information submitted is accurate and I accept responsibility for keeping it
                                updated.
                            </span>
                        </label>
                        {formError && <p className="text-sm font-semibold text-red-500">{formError}</p>}
                    </div>
                )
            case 8:
                return (
                    <div className="space-y-6">
                        <p className="text-gray-600">
                            Review your onboarding details below. You can go back to edit any section before submitting for admin
                            verification.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <section className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900">Owner Profile</h3>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>
                                        <strong className="text-gray-800">Name:</strong> {formState.ownerName || '—'}
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Email:</strong> {formState.ownerEmail || '—'}
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Phone:</strong> {formState.ownerPhone || '—'}
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">CNIC:</strong> {formState.ownerCnic || '—'}
                                    </li>
                                </ul>
                            </section>
                            <section className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900">Property Snapshot</h3>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>
                                        <strong className="text-gray-800">Name:</strong> {formState.propertyName || '—'}
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Type:</strong> {formState.propertyType || '—'}
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">City:</strong> {formState.propertyCity || '—'}
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Rooms:</strong> {formState.roomCount || '—'}
                                    </li>
                                </ul>
                            </section>
                            <section className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900">Facilities & Services</h3>
                                <p className="text-sm text-gray-600">
                                    {(formState.propertyAmenities || formState.propertyFoodServices) && (
                                        <span>
                                            Amenities: {formState.propertyAmenities || '—'}
                                            <br />
                                            Food: {formState.propertyFoodServices || '—'}
                                            <br />
                                            Safety: {formState.propertySafety || '—'}
                                        </span>
                                    )}
                                </p>
                            </section>
                            <section className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900">Payment Preferences</h3>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>
                                        <strong className="text-gray-800">Method:</strong> {formState.paymentMethod || '—'}
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Account Title:</strong> {formState.paymentAccountTitle || '—'}
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Commission:</strong> {formState.paymentCommission ? `${formState.paymentCommission}%` : '—'}
                                    </li>
                                </ul>
                            </section>
                        </div>
                        {submissionComplete && (
                            <div className="rounded-3xl border border-green-200 bg-green-50 px-6 py-4 text-green-700">
                                Your onboarding request has been submitted. We will notify you once the review is complete.
                            </div>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1">
                <section className="bg-gradient-to-br from-sky-50 via-white to-white px-6 pb-16 pt-20 sm:px-10 lg:px-16">
                    <div className="mx-auto flex max-w-5xl flex-col gap-8">
                        <div className="space-y-6">
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                                Start Onboarding
                            </span>
                            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                                Complete your Hotling owner onboarding in nine guided steps.
                            </h1>
                            <p className="text-lg text-gray-600">
                                Share your credentials, property profile, operations setup, and verification documents. You can pause at any
                                time—progress is saved in this session until you submit for admin review.
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <Link
                                    to="/onboarding"
                                    className="inline-flex items-center rounded-full border border-gray-200 px-6 py-2 font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
                                >
                                    Back to onboarding overview
                                </Link>
                                <a
                                    href="mailto:onboarding@hotling.com"
                                    className="inline-flex items-center rounded-full bg-black px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-900"
                                >
                                    Need help? Email our team
                                </a>
                            </div>
                        </div>
                        <div className="grid gap-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
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
                                                    : 'border-gray-100 bg-white text-gray-500'
                                            }`}
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
                </section>

                <section ref={formRef} className="bg-gray-50 px-6 pb-20 pt-16 sm:px-10 lg:px-16">
                    <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
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
                            {renderStepContent()}

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                                <div className="text-sm text-gray-500">
                                    Step {currentStep + 1} of {onboardingSteps.length}
                                </div>
                                <div className="flex gap-3">
                                    {currentStep > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="inline-flex items-center rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                                    >
                                        {currentStep === onboardingSteps.length - 1 ? 'Submit for verification' : 'Save & continue'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default OnboardingStart

