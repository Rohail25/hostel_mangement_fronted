import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Stepper from '../components/Stepper';
import Header from '../components/Header';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Step 1: Account Info
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Step 2: Personal Info
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [document, setDocument] = useState<File | null>(null);

  // Step 3: Address Info
  const [hostelName, setHostelName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const steps = [
    { label: 'Account Info', number: 1 },
    { label: 'Personal Info', number: 2 },
    { label: 'Address Info', number: 3 },
  ];

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!document) newErrors.document = 'Document upload is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!hostelName.trim()) newErrors.hostelName = 'Hostel name or city is required';
    if (!addressLine.trim()) newErrors.addressLine = 'Address is required';
    if (!postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }

    if (!isValid) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      // Submit registration
      console.log('Registration data:', {
        username,
        email,
        password,
        fullName,
        phoneNumber,
        gender,
        dateOfBirth,
        document,
        hostelName,
        roomNumber,
        addressLine,
        postalCode,
      });
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
      setErrors({ ...errors, document: '' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      {/* Back to Home Button - Centered */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-6 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-blue hover:shadow-blue-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-6">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-soft-lg p-8">
            {/* Step 1: Account Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-primary-600 mb-6">Account Information</h2>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrors({ ...errors, username: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.username ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                      placeholder="Username"
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                      placeholder="Email"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                      placeholder="Password"
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-primary-600 hover:bg-primary-700 border-2 border-gray-300 text-black py-3 px-4 rounded-lg font-semibold transition-all shadow-blue hover:shadow-blue-md transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Continue to Personal Info
                </button>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-primary-600 mb-6">Personal Information</h2>

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrors({ ...errors, fullName: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrors({ ...errors, phoneNumber: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setErrors({ ...errors, gender: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.gender ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => {
                      setDateOfBirth(e.target.value);
                      setErrors({ ...errors, dateOfBirth: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>

                {/* Document Upload - Moved to Personal Info */}
                <div>
                  <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment of Document (Upload File)
                  </label>
                  <input
                    id="document"
                    type="file"
                    onChange={handleFileChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.document ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                  />
                  {document && (
                    <p className="mt-2 text-sm text-green-600">Selected: {document.name}</p>
                  )}
                  {errors.document && <p className="mt-1 text-sm text-red-600">{errors.document}</p>}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Back to Account Info
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-primary-600 hover:bg-primary-700  border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all shadow-blue hover:shadow-blue-md transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Continue to Address Info
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Address Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-primary-600 mb-6">Address Information</h2>

                {/* Hostel Name / City */}
                <div>
                  <label htmlFor="hostelName" className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel Name / City
                  </label>
                  <input
                    id="hostelName"
                    type="text"
                    value={hostelName}
                    onChange={(e) => {
                      setHostelName(e.target.value);
                      setErrors({ ...errors, hostelName: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.hostelName ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                    placeholder="Enter hostel name or city"
                  />
                  {errors.hostelName && <p className="mt-1 text-sm text-red-600">{errors.hostelName}</p>}
                </div>

                {/* Room Number */}
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number (if applicable)
                  </label>
                  <input
                    id="roomNumber"
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter room number"
                  />
                </div>

                {/* Address Line */}
                <div>
                  <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line
                  </label>
                  <input
                    id="addressLine"
                    type="text"
                    value={addressLine}
                    onChange={(e) => {
                      setAddressLine(e.target.value);
                      setErrors({ ...errors, addressLine: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.addressLine ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                    placeholder="Enter your address"
                  />
                  {errors.addressLine && <p className="mt-1 text-sm text-red-600">{errors.addressLine}</p>}
                </div>

                {/* Postal Code */}
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(e.target.value);
                      setErrors({ ...errors, postalCode: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.postalCode ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                    placeholder="Enter postal code"
                  />
                  {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Back to Personal Info
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-primary-600 hover:bg-primary-700  border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all shadow-blue hover:shadow-blue-md transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Submit Registration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;

