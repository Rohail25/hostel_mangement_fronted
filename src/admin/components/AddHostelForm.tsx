import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOfficeIcon,
  XMarkIcon,
  Cog6ToothIcon,
  CameraIcon,
  PhotoIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { Select } from './Select';

interface HostelFormState {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  description: string;
  amenities: string[];
  hostelImage: File | null;
  hostelImagePreview: string;
  category: string;
  type: string;
  checkInTime: string;
  checkOutTime: string;
  mapLink: string;
  totalFloors: string;
  totalRooms: string;
  totalBeds: string;
}

interface HostelSubmitData {
  name: string;
  email: string;
  phone: string;
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
  };
  description: string;
  amenities: string[];
  category: string;
  type: string;
  operatingHours: {
    checkIn: string;
    checkOut: string;
  };
  hostelImage: File | null;
  mapLink: string;
  totalFloors: number;
  totalRooms: number;
  totalBeds: number;
  arrangements: ArrangementRow[];
}

interface ArrangementRow {
  id: string;
  blockLabel: string;
  rooms: number;
  baths: number;
  seats: number;
}

type RawArrangementRow = Partial<ArrangementRow> & {
  block?: string | number;
  floor?: string | number;
  roomCount?: number | string;
  bathCount?: number | string;
  beds?: number | string;
  bedCount?: number | string;
  total?: number | string;
};

interface HostelSourceData {
  name?: string;
  email?: string;
  managerPhone?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  address?: {
    country?: string;
    state?: string;
    city?: string;
    street?: string;
  };
  city?: string;
  street?: string;
  description?: string;
  notes?: string;
  amenities?: string[] | string;
  hostelImage?: string;
  logo?: string;
  image?: string;
  category?: string;
  type?: string | string[];
  operatingHours?: {
    checkIn?: string;
    checkOut?: string;
  };
  checkInTime?: string;
  checkOutTime?: string;
  mapLink?: string;
  locationMapLink?: string;
  addressMapLink?: string;
  totalFloors?: number;
  totalRooms?: number;
  totalBeds?: number;
  arrangements?: ArrangementRow[] | string;
  architecture?: Array<{
    floorNumber?: number;
    floorName?: string;
    name?: string;
    label?: string;
    roomCount?: number;
    rooms?: Array<{
      totalBeds?: number;
      beds?: unknown[];
      hasAttachedBathroom?: boolean;
    }>;
  }>;
}

const countryStateCityMap: Record<string, Record<string, string[]>> = {
  Pakistan: {
    Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur'],
    Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpurkhas'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Swat', 'Abbottabad', 'Kohat', 'Bannu', 'Mansehra'],
    Balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'],
    'Azad Jammu and Kashmir': ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Diamer'],
    'Islamabad Capital Territory': ['Islamabad'],
  },
};

const countryOptions = [
  { value: '', label: 'Select Country' },
  { value: 'Pakistan', label: 'Pakistan' },
  // { value: 'Other', label: 'Other' },
];

const amenityOptions = [
  'Hot Water',
  'Cold Water',
  'Parking - Bike',
  'Parking - Car',
  'Lockers',
  'AC Rooms',
  'Water Chillers',
  '3 Time Mess',
  'Laundry',
  'WiFi',
  'Security',
  'Power Backup',
  'Lift/Elevator',
  'CCTV',
  'Study Area',
  'Common Room',
  'Housekeeping',
  'Filtered Water',
].map((amenity) => ({ value: amenity, label: amenity }));

const getStateOptions = (country: string) => {
  const stateMap = countryStateCityMap[country];
  if (!stateMap) {
    return [{ value: '', label: 'Select State' }];
  }

  return [
    { value: '', label: 'Select State' },
    ...Object.keys(stateMap).map((state) => ({ value: state, label: state })),
  ];
};

const getCityOptions = (country: string, state: string) => {
  const stateMap = countryStateCityMap[country];
  const cities = stateMap?.[state];

  if (!cities) {
    return [{ value: '', label: 'Select City' }];
  }

  return [
    { value: '', label: 'Select City' },
    ...cities.map((city) => ({ value: city, label: city })),
  ];
};

const extractMapsPreviewQuery = (link: string) => {
  const trimmedLink = link.trim();
  if (!trimmedLink) {
    return '';
  }

  try {
    const url = new URL(trimmedLink);
    const directQuery =
      url.searchParams.get('q') ||
      url.searchParams.get('query') ||
      url.searchParams.get('destination') ||
      url.searchParams.get('daddr') ||
      url.searchParams.get('ll') ||
      url.searchParams.get('center');

    if (directQuery) {
      return directQuery;
    }

    const placeMatch = url.pathname.match(/\/place\/([^/]+)/i);
    if (placeMatch?.[1]) {
      return decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
    }

    const atMatch = trimmedLink.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (atMatch) {
      return `${atMatch[1]},${atMatch[2]}`;
    }

    return `${url.hostname}${url.pathname}`.replace(/^www\./, '');
  } catch {
    return trimmedLink;
  }
};

const buildGoogleMapsPreviewUrl = (link: string) => {
  const query = extractMapsPreviewQuery(link);
  if (!query) {
    return '';
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
};

const normalizeHostelType = (value: HostelSourceData['type']) => {
  if (Array.isArray(value)) {
    return value.find((item) => Boolean(item)) || '';
  }

  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.find((item) => Boolean(item)) || '';
    }
  } catch {
    // Fall through to plain string handling.
  }

  return trimmed;
};

const buildArrangementRowsFromArchitecture = (
  architecture: HostelSourceData['architecture']
): ArrangementRow[] => {
  if (!Array.isArray(architecture) || architecture.length === 0) {
    return [];
  }

  return architecture.map((floor, index) => {
    const rooms = Array.isArray(floor.rooms) ? floor.rooms : [];
    const seats = rooms.reduce((totalSeats, room) => {
      if (typeof room.totalBeds === 'number') {
        return totalSeats + room.totalBeds;
      }

      return totalSeats + (Array.isArray(room.beds) ? room.beds.length : 0);
    }, 0);

    return {
      id: `row-${index + 1}`,
      blockLabel: String(floor.floorName || floor.name || floor.label || floor.floorNumber || index + 1),
      rooms: floor.roomCount ?? rooms.length,
      baths: 0,
      seats,
    };
  });
};

const generateAmenitiesDescription = (amenities: string[]) => {
  const selectedAmenities = amenities.filter(Boolean);

  if (selectedAmenities.length === 0) {
    return 'Select hostel amenities to generate a smart description automatically.';
  }

  const formattedAmenities = selectedAmenities.map((amenity) => amenity.toLowerCase());
  const amenityList = formattedAmenities.length === 1
    ? formattedAmenities[0]
    : `${formattedAmenities.slice(0, -1).join(', ')} and ${formattedAmenities[formattedAmenities.length - 1]}`;

  const comfortLine = selectedAmenities.length >= 3
    ? 'This setup gives residents a more complete, comfortable, and convenient living experience.'
    : 'This setup focuses on the selected facilities to keep the stay comfortable and practical.';

  return `This hostel offers ${amenityList}. ${comfortLine}`;
};

interface AddHostelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HostelSubmitData) => void;
  editingHostel?: HostelSourceData | null;
}

export const AddHostelForm: React.FC<AddHostelFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingHostel,
}) => {
  const isEditing = Boolean(editingHostel);
  const tabOrder: Array<'hostelInfo' | 'hostelSettings' | 'arrangementManagement'> = [
    'hostelInfo',
    'hostelSettings',
    'arrangementManagement',
  ];
  const [activeTab, setActiveTab] = useState<'hostelInfo' | 'hostelSettings' | 'arrangementManagement'>('hostelInfo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<HostelFormState>({
    name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    street: '',
    description: '',
    amenities: [] as string[],
    hostelImage: null as File | null,
    hostelImagePreview: '',
    category: '',
    type: '',
    checkInTime: '',
    checkOutTime: '',
    mapLink: '',
    totalFloors: '',
    totalRooms: '',
    totalBeds: '',
  });
  const [arrangementRows, setArrangementRows] = useState<ArrangementRow[]>([
    { id: 'row-1', blockLabel: '1', rooms: 0, baths: 0, seats: 0 },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const previousGeneratedDescriptionRef = useRef('');
  const mapPreviewUrl = buildGoogleMapsPreviewUrl(formData.mapLink);
  const stateOptions = getStateOptions(formData.country);
  const cityOptions = getCityOptions(formData.country, formData.state);

  const totals = arrangementRows.reduce(
    (accumulator, row) => ({
      blocks: accumulator.blocks + 1,
      rooms: accumulator.rooms + row.rooms,
      baths: accumulator.baths + row.baths,
      seats: accumulator.seats + row.seats,
      capacity: accumulator.capacity + row.rooms + row.baths + row.seats,
    }),
    { blocks: 0, rooms: 0, baths: 0, seats: 0, capacity: 0 }
  );

  const syncArrangementTotals = (rows: ArrangementRow[]) => {
    const nextTotals = rows.reduce(
      (accumulator, row) => ({
        blocks: accumulator.blocks + 1,
        rooms: accumulator.rooms + row.rooms,
        baths: accumulator.baths + row.baths,
        seats: accumulator.seats + row.seats,
      }),
      { blocks: 0, rooms: 0, baths: 0, seats: 0 }
    );

    setFormData((prev) => ({
      ...prev,
      totalFloors: String(nextTotals.blocks),
      totalRooms: String(nextTotals.rooms),
      totalBeds: String(nextTotals.seats),
    }));
  };

  const generatedDescription = React.useMemo(
    () => generateAmenitiesDescription(formData.amenities),
    [formData.amenities]
  );

  useEffect(() => {
    const currentDescription = formData.description.trim();
    const previousGeneratedDescription = previousGeneratedDescriptionRef.current;
    const shouldAutoFill = formData.amenities.length > 0 && (
      !descriptionTouched || currentDescription === '' || currentDescription === previousGeneratedDescription
    );

    if (shouldAutoFill) {
      setFormData((previous) => (
        previous.description === generatedDescription
          ? previous
          : { ...previous, description: generatedDescription }
      ));
    }

    previousGeneratedDescriptionRef.current = generatedDescription;
  }, [descriptionTouched, formData.amenities.length, formData.description, generatedDescription]);

  // Reset form when modal opens/closes or editingHostel changes
  useEffect(() => {
    if (isOpen) {
      if (editingHostel) {
        const editingAddress = editingHostel.address || {};
        const editingContactInfo = editingHostel.contactInfo || {};
        const editingImage = editingHostel.hostelImage || editingHostel.logo || editingHostel.image || '';
        const editingHostelWithMap = editingHostel as HostelSourceData & {
          locationMapLink?: string;
          addressMapLink?: string;
        };
        const editingMapLink = editingHostelWithMap.mapLink || editingHostelWithMap.locationMapLink || editingHostelWithMap.addressMapLink || '';

        // Populate form with editing hostel data
        // Note: You may need to fetch full hostel details from API
        setFormData({
          name: editingHostel.name || '',
          email: editingContactInfo.email || editingHostel.email || '',
          phone: editingContactInfo.phone || editingHostel.managerPhone || '',
          country: editingAddress.country || '',
          state: editingAddress.state || '',
          city: editingAddress.city || editingHostel.city || '',
          street: editingAddress.street || editingHostel.street || '',
          description: editingHostel.description || editingHostel.notes || '',
          amenities: Array.isArray(editingHostel.amenities)
            ? editingHostel.amenities
            : typeof editingHostel.amenities === 'string'
              ? (() => {
                  try {
                    const parsed = JSON.parse(editingHostel.amenities);
                    return Array.isArray(parsed) ? parsed : [editingHostel.amenities];
                  } catch {
                    return [editingHostel.amenities];
                  }
                })()
              : [],
          hostelImage: null,
          hostelImagePreview: editingImage,
          category: editingHostel.category || '',
          type: normalizeHostelType(editingHostel.type),
          checkInTime: editingHostel.operatingHours?.checkIn || editingHostel.checkInTime || '9:00AM',
          checkOutTime: editingHostel.operatingHours?.checkOut || editingHostel.checkOutTime || '6:00PM',
          mapLink: editingMapLink,
          totalFloors: editingHostel.totalFloors?.toString() || '',
          totalRooms: editingHostel.totalRooms?.toString() || '',
          totalBeds: editingHostel.totalBeds?.toString() || '',
        });
        setDescriptionTouched(Boolean(editingHostel.description || editingHostel.notes));
        const editingArrangements = Array.isArray(editingHostel.arrangements)
          ? editingHostel.arrangements
          : typeof editingHostel.arrangements === 'string'
            ? (() => {
                try {
                  const parsed = JSON.parse(editingHostel.arrangements);
                  return Array.isArray(parsed) ? parsed : [];
                } catch {
                  return [];
                }
              })()
            : buildArrangementRowsFromArchitecture(editingHostel.architecture);
        if (editingArrangements.length > 0) {
          setArrangementRows(
            editingArrangements.map((row, index) => {
              const normalizedRow = row as RawArrangementRow;
              return {
                id: normalizedRow.id || `row-${index + 1}`,
                blockLabel: String(normalizedRow.blockLabel || normalizedRow.block || normalizedRow.floor || index + 1),
                rooms: Number(normalizedRow.rooms ?? normalizedRow.roomCount ?? 0),
                baths: Number(normalizedRow.baths ?? normalizedRow.bathCount ?? 0),
                seats: Number(normalizedRow.seats ?? normalizedRow.beds ?? normalizedRow.bedCount ?? 0),
              };
            })
          );
        } else {
          setArrangementRows([{ id: 'row-1', blockLabel: '1', rooms: 0, baths: 0, seats: 0 }]);
        }
      } else {
        // Reset form for new hostel
        setFormData({
          name: '',
          email: '',
          phone: '',
          country: '',
          state: '',
          city: '',
          street: '',
          description: '',
          amenities: [],
          hostelImage: null,
          hostelImagePreview: '',
          category: '',
          type: '',
          checkInTime: '9:00AM',
          checkOutTime: '6:00PM',
          mapLink: '',
          totalFloors: '',
          totalRooms: '',
          totalBeds: '',
  });
        setDescriptionTouched(false);
          setArrangementRows([{ id: 'row-1', blockLabel: '1', rooms: 0, baths: 0, seats: 0 }]);
      }
      setActiveTab('hostelInfo');
      setErrors({});
    }
  }, [isOpen, editingHostel]);

  useEffect(() => {
    syncArrangementTotals(arrangementRows);
  }, [arrangementRows]);

  const addArrangementRow = () => {
    setArrangementRows((previousRows) => [
      ...previousRows,
      {
        id: `row-${previousRows.length + 1}-${Date.now()}`,
        blockLabel: String(previousRows.length + 1),
        rooms: 0,
        baths: 0,
        seats: 0,
      },
    ]);
  };

  const updateArrangementRow = (rowId: string, field: keyof Omit<ArrangementRow, 'id'>, value: string) => {
    setArrangementRows((previousRows) =>
      previousRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: field === 'blockLabel' ? value : Number(value) || 0,
            }
          : row
      )
    );
  };

  const removeArrangementRow = (rowId: string) => {
    setArrangementRows((previousRows) =>
      previousRows.length > 1 ? previousRows.filter((row) => row.id !== rowId) : previousRows
    );
  };

  // Category options (frontend labels differ from backend values)
  const categoryOptions = [
    // { value: '', label: 'Select Category' },
    { value: 'luxury', label: 'Hotel Botique' },
    { value: 'back_pack', label: 'BackPacking' },
    { value: 'home2', label: 'Second Home' },
  ];

  // Category comments mapping
  const categoryComments: Record<string, string> = {
    home2: 'This is long stay like students, job person, backpackers',
    luxury: 'Comfortable luxury 3-10 days short staying option for individuals, couples, or families mostly.',
    back_pack: 'A budget friendly 3-10 days short staying accomodation for backpackers, travellers, students.',
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Type options
  const typeOptions = [
    // { value: '', label: 'Select Type' },
    { value: 'boy', label: 'Boy' },
    { value: 'girl', label: 'Girl' },
    { value: 'family', label: 'Family' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Hostel Info validation
    if (!formData.name.trim()) {
      newErrors.name = 'Hostel name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Street is required';
    }

    // Hostel Settings validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    if (!formData.checkInTime) {
      newErrors.checkInTime = 'Check-in time is required';
    }
    if (!formData.checkOutTime) {
      newErrors.checkOutTime = 'Check-out time is required';
    }

    setErrors(newErrors);
    return newErrors;
  };

  const focusFirstInvalidTab = (validationErrors: Record<string, string>) => {
    const hostelInfoFields = ['name', 'email', 'phone', 'country', 'state', 'city', 'street'];
    const hostelSettingsFields = ['category', 'type', 'checkInTime', 'checkOutTime'];

    if (hostelInfoFields.some((field) => validationErrors[field])) {
      setActiveTab('hostelInfo');
      return;
    }

    if (hostelSettingsFields.some((field) => validationErrors[field])) {
      setActiveTab('hostelSettings');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalidTab(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: {
          country: formData.country.trim(),
          state: formData.state.trim(),
          city: formData.city.trim(),
          street: formData.street.trim(),
        },
        description: formData.description.trim(),
        amenities: formData.amenities,
        category: formData.category,
        type: formData.type,
        operatingHours: {
          checkIn: formData.checkInTime,
          checkOut: formData.checkOutTime,
        },
        hostelImage: formData.hostelImage,
        mapLink: formData.mapLink.trim(),
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : 0,
        totalRooms: formData.totalRooms ? parseInt(formData.totalRooms) : 0,
        totalBeds: formData.totalBeds ? parseInt(formData.totalBeds) : 0,
        arrangements: arrangementRows.map((row) => ({
          id: row.id,
          blockLabel: row.blockLabel,
          rooms: row.rooms,
          baths: row.baths,
          seats: row.seats,
          total: row.rooms + row.baths + row.seats,
        })),
      };

      await onSubmit(submitData);

      // Reset form
      handleClose();
    } catch (error) {
      console.error('Error submitting hostel form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      street: '',
      description: '',
      amenities: [],
      hostelImage: null,
      hostelImagePreview: '',
      category: '',
      type: '',
      checkInTime: '',
      checkOutTime: '',
      mapLink: '',
      totalFloors: '',
      totalRooms: '',
      totalBeds: '',
    });
    setErrors({});
    setActiveTab('hostelInfo');
    setArrangementRows([{ id: 'row-1', blockLabel: '1', rooms: 0, baths: 0, seats: 0 }]);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          hostelImage: file,
          hostelImagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      hostelImage: null,
      hostelImagePreview: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const currentTabIndex = tabOrder.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabOrder.length - 1;

  const handleNextTab = () => {
    if (!isLastTab) {
      setActiveTab(tabOrder[currentTabIndex + 1]);
    }
  };

  const handlePreviousTab = () => {
    if (!isFirstTab) {
      setActiveTab(tabOrder[currentTabIndex - 1]);
    }
  };

  // Effect to handle body overflow when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-64 bg-slate-800 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                    <h2 className="text-lg font-semibold text-white">Hostel Info</h2>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 p-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('hostelInfo')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'hostelInfo'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    <span className="font-medium">Hostel Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('hostelSettings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'hostelSettings'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span className="font-medium">Hostel Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('arrangementManagement')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'arrangementManagement'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    <span className="font-medium">Hostel Arrangements</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {isEditing ? 'EDIT HOSTEL' : 'CREATE HOSTEL'}
                    </h3>
                    <span className="block w-12 h-1 bg-pink-500 mt-1" />
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'hostelInfo' && (
                      <div className="space-y-6">
                        {/* Hostel Image Upload */}
                        <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-200">
                          <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white ring-offset-2 ring-offset-slate-50">
                              {formData.hostelImagePreview ? (
                                <img
                                  src={formData.hostelImagePreview}
                                  alt="Hostel logo preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BuildingOfficeIcon className="w-20 h-20 text-white" />
                              )}
                            </div>
                            {formData.hostelImagePreview && (
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600 transition-colors shadow-lg"
                                title="Remove image"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            )}
                            <div
                              className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer"
                              onClick={handleImageClick}
                            >
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                  <CameraIcon className="w-6 h-6 text-blue-600" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <button
                              type="button"
                              onClick={handleImageClick}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                              <PhotoIcon className="w-5 h-5" />
                              <span className="font-medium">Upload Hostel Logo / Picture</span>
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                              JPG, PNG or GIF. Max size 2MB
                            </p>
                          </div>
                        </div>

                        {/* Hostel Name */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Hostel Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter hostel name"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                          )}
                        </div>

                        {/* Email and Phone Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="hostel@example.com"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="03001234567"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                          </div>
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                            <MapPinIcon className="w-5 h-5 text-blue-600" />
                            <span>Choose country, state, and city from the dropdowns to keep hostel location data consistent.</span>
                          </div>

                          {/* Country and State Row */}
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Country <span className="text-red-500">*</span>
                              </label>
                              <Select
                                value={formData.country}
                                onChange={(value) =>
                                  setFormData({ ...formData, country: value, state: '', city: '' })
                                }
                                options={countryOptions}
                                placeholder="Select Country"
                              />
                              {errors.country && (
                                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                State <span className="text-red-500">*</span>
                              </label>
                              <Select
                                value={formData.state}
                                onChange={(value) => setFormData({ ...formData, state: value, city: '' })}
                                options={stateOptions}
                                placeholder="Select State"
                                disabled={!formData.country}
                              />
                              {errors.state && (
                                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                              )}
                            </div>
                          </div>

                          {/* City and Street Row */}
                          <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.city}
            onChange={(value) => setFormData({ ...formData, city: value })}
            options={cityOptions}
            placeholder="Select City"
            disabled={!formData.state}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Address <span className="text-red-500">*</span>
            </label>
            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                placeholder="Enter street address"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
            />
                              {errors.street && (
                                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
          </div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amenities
                              </label>
                              <p className="text-xs text-slate-500">
                                Select the facilities your hostel offers. These will be summarized in Hostel View.
                              </p>
                            </div>
                            <div className="text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1">
                              {formData.amenities.length} selected
                            </div>
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm max-h-72 overflow-y-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                              <thead className="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Select</th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Amenity</th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 bg-white">
                                {amenityOptions.map((amenity) => {
                                  const checked = formData.amenities.includes(amenity.value);

                                  return (
                                    <tr key={amenity.value} className={checked ? 'bg-blue-50/60' : ''}>
                                      <td className="px-4 py-3 align-middle">
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => toggleAmenity(amenity.value)}
                                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="px-4 py-3 align-middle font-medium text-slate-800">{amenity.label}</td>
                                      <td className="px-4 py-3 align-middle text-slate-500">
                                        {checked ? 'Included' : 'Not included'}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Generated description</p>
                            <p className="mt-2 text-sm leading-6 text-blue-900">{generatedDescription}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => {
                              const value = e.target.value;
                              setDescriptionTouched(value.trim().length > 0);
                              setFormData({ ...formData, description: value });
                            }}
                            rows={4}
                            placeholder="Enter hostel description..."
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Hostel Map Link */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Hostel Map (Google Map Link)
                          </label>
                          <input
                            type="url"
                            value={formData.mapLink}
                            onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                            placeholder="https://maps.google.com/..."
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            Enter the Google Maps link for the hostel location
                          </p>
                        </div>

                        {/* Google Map Preview */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800">Map Preview</h4>
                            <p className="text-xs text-slate-500">Live preview of the pasted Google Maps location.</p>
                          </div>

                          {formData.mapLink.trim() ? (
                            mapPreviewUrl ? (
                              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <iframe
                                  title="Google Maps preview"
                                  src={mapPreviewUrl}
                                  className="h-72 w-full"
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                />
                              </div>
                            ) : (
                              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                                We could not generate a preview from this link. Please paste a valid Google Maps place or coordinates link.
                              </div>
                            )
                          ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                              Paste a Google Maps link above and the hostel location preview will appear here.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'hostelSettings' && (
                      <div className="space-y-6">
                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={formData.category}
                            onChange={(value) => setFormData({ ...formData, category: value })}
                            options={categoryOptions}
                          />
                          {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                          )}
                          {formData.category && categoryComments[formData.category] && (
                            <p className="mt-2 text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                              {categoryComments[formData.category]}
                            </p>
                          )}
                        </div>

                        {/* Type */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Type <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={formData.type}
                            onChange={(value) => setFormData({ ...formData, type: value })}
                            options={typeOptions}
                          />
                          {errors.type && (
                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                          )}
        </div>

                        {/* Operating Hours */}
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5" />
                            Operating Hours
                          </h4>
                          <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Check-in Time <span className="text-red-500">*</span>
            </label>
            <input
                                type="time"
                                value={formData.checkInTime}
                                onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
            />
                              {errors.checkInTime && (
                                <p className="mt-1 text-sm text-red-600">{errors.checkInTime}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Check-out Time <span className="text-red-500">*</span>
            </label>
            <input
                                type="time"
                                value={formData.checkOutTime}
                                onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
            />
                              {errors.checkOutTime && (
                                <p className="mt-1 text-sm text-red-600">{errors.checkOutTime}</p>
            )}
          </div>
        </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'arrangementManagement' && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Specify the total capacity for your hostel. You can add detailed arrangements (specific blocks, rooms, and beds) after creating the hostel using the "Arrange" button.
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900">Block Capacity Table</h4>
                            <p className="text-sm text-slate-600">Each row represents one block/floor. Fill in rooms, baths, and seats/beds for that block.</p>
                          </div>
                          <button
                            type="button"
                            onClick={addArrangementRow}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            + Add Row
                          </button>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Block/Floor</th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Rooms</th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Baths</th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Seats/Beds</th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Row Capacity</th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 bg-white">
                                {arrangementRows.map((row, index) => {
                                  const rowCapacity = row.rooms + row.baths + row.seats;
                                  return (
                                    <tr key={row.id} className="align-top">
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold">{index + 1}</span>
                                          <input
                                            type="number"
                                            min="1"
                                            value={row.blockLabel}
                                            onChange={(e) => updateArrangementRow(row.id, 'blockLabel', e.target.value)}
                                            className="w-24 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Floor"
                                          />
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <input
                                          type="number"
                                          min="0"
                                          value={row.rooms}
                                          onChange={(e) => updateArrangementRow(row.id, 'rooms', e.target.value)}
                                          className="w-28 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Rooms"
                                        />
                                      </td>
                                      <td className="px-4 py-3">
                                        <input
                                          type="number"
                                          min="0"
                                          value={row.baths}
                                          onChange={(e) => updateArrangementRow(row.id, 'baths', e.target.value)}
                                          className="w-28 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Baths"
                                        />
                                      </td>
                                      <td className="px-4 py-3">
                                        <input
                                          type="number"
                                          min="0"
                                          value={row.seats}
                                          onChange={(e) => updateArrangementRow(row.id, 'seats', e.target.value)}
                                          className="w-28 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Beds"
                                        />
                                      </td>
                                      <td className="px-4 py-3 font-semibold text-slate-900">{rowCapacity}</td>
                                      <td className="px-4 py-3">
                                        <button
                                          type="button"
                                          onClick={() => removeArrangementRow(row.id)}
                                          disabled={arrangementRows.length === 1}
                                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                  <td className="px-4 py-3 font-semibold text-slate-900">Total</td>
                                  <td className="px-4 py-3 font-semibold text-slate-900">{totals.rooms}</td>
                                  <td className="px-4 py-3 font-semibold text-slate-900">{totals.baths}</td>
                                  <td className="px-4 py-3 font-semibold text-slate-900">{totals.seats}</td>
                                  <td className="px-4 py-3 font-semibold text-blue-700">{totals.capacity}</td>
                                  <td className="px-4 py-3 text-slate-500">{totals.blocks} blocks</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Total Blocks</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totals.blocks}</p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Total Rooms</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totals.rooms}</p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Total Seats</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{totals.seats}</p>
                          </div>
                        </div>
                      </div>
                    )}
        </div>

                  {/* Footer Buttons */}
                  <div className="p-6 border-t border-slate-200 bg-white flex justify-between gap-3">
                    <div className="flex gap-3">
                      {!isFirstTab && (
                        <button
                          type="button"
                          onClick={handlePreviousTab}
                          disabled={isSubmitting}
                          className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    {isLastTab ? (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting && (
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Hostel' : 'Create Hostel')}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextTab}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    )}
                    </div>
                  </div>
      </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
