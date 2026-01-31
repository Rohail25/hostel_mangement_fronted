/**
 * Types for Settings modals
 */

export interface PhoneEntry {
  id: string;
  type: string;
  number: string;
}

export interface EmailEntry {
  id: string;
  email: string;
}

export interface PersonalInfoFormData {
  username: string;
  email: string;
  phone: string;
  alternativePhone: string;
  profilePicture?: string;
  profilePhotoFile?: File | null;
  phones: PhoneEntry[];
  emails: EmailEntry[];
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LoginPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface HostelInfoFormData {
  companyName: string;
  primaryEmail: string;
  primaryPhone: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  companyWebsite: string;
  logo?: string;
}

export interface HostelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UserPhoneEntry {
  id: string;
  type: string;
  number: string;
}

export interface UserEmailEntry {
  id: string;
  type: string;
  email: string;
}

export interface NewUserFormData {
  // Personal Info
  firstName: string;
  middleInitial: string;
  lastName: string;
  company: string;
  jobTitle: string;
  loginEmail: string;
  userRole: string;
  profilePicture?: string;
  // Contact Info
  phones: UserPhoneEntry[];
  emails: UserEmailEntry[];
  // Address
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: NewUserFormData | null;
  isEdit?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  phone: string;
  email: string;
  role: string;
  properties: string;
  status: 'Active' | 'Inactive';
  isAccountOwner: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface UserRoleFormData {
  roleName: string;
  roleDescription: string;
  hostelId: number | null; // Authority Hostel - selected hostel for this role
  permissions: {
    people: {
      [key: string]: {
        viewList: boolean;
        viewOne: boolean;
        create: boolean;
        edit: boolean;
        delete: boolean;
      };
    };
    tasksAndMaintenance: {
      [key: string]: {
        viewList: 'none' | 'view' | 'edit';
        viewOne: 'none' | 'view' | 'edit';
        create: boolean;
        edit: boolean;
        delete: boolean;
      };
    };
  };
}

export interface NewUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleData?: UserRoleFormData | null;
  isEdit?: boolean;
  roleId?: number | null; // Role ID for edit mode
  onSuccess?: () => void; // Callback when role is created/updated successfully
}

