import { EmergencyContact } from "./emergency-contact.model";

export interface ProfileImage {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}
interface UserAddress {
  country: string;
  city: string;
  subcity: string;
  woreda: string;
  kebele: string;
}

export interface User {
  id?: string;
  firstName: string;
  middleName: string;
  lastName?: string;
  organizationId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization?: any;
  departmentId?: string;
  roleId?: string[];
  email?: string;
  address: UserAddress;
  phone: string;
  password?: string;
  firebaseUserId?: string;
  jobTitle?: string;
  gender: "Male" | "Female";
  licenseNumber?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profilePicture?: any;
  isPowerUser?: boolean;
  isEmployee?: boolean;
  isActive?: boolean;
  dateOfBirth?: Date;
  startDate?: Date;
  endDate?: Date;
  tin?: string;
  employeeNumber?: string;
  userRoles?: MappedUserRoles[];
  roleIds?: string[];
  userContacts?: EmergencyContact[];
  currentRole?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
}

export interface UserDocument {
  id: string;
  userId: string;
  documentTypeId: string;
  documentTypeCode?: string;
  documentReference?: string;
  file: File;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface MappedUserRoles {
  userId: string;
  roleId: string;
  role?: {
    id: string;
    name: string;
    description: string;
    key: string;
  };
  name: string;
  description: string;
  key: string;
}
