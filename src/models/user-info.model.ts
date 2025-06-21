import { Tenant } from "./tenant.model";

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  createdBy: string | null;
  updatedBy: string | null;
  archivedBy: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  role: {
    id: string;
    roleName: string;
    key: string;
    description: string;
    viewTransporterPrice: boolean;
    viewShipperPrice: boolean;
    createdAt: string;
    updatedAt: string;
    updatedBy: string | null;
    createdBy: string | null;
  };
}

export interface Organization {
  id: string;
  shortCode: string;
  name: string;
  logo?: {
    url: string;
    name: string;
    size: number;
    type: string;
    bucketName: string;
    originalName: string;
  };
  tradeName: string;
  tin: string;
  phoneNumber: string;
  address: {
    city: string;
    kebele: string;
    region: string;
    woreda: string;
    subCity: string;
  };
  email: string;
  secondaryPhoneNumbers: string[] | null;
  secondaryEmails: string[] | null;
  isShipper: boolean;
  isTransporter: boolean;
  isAssociation: boolean;
  isBrokerage: boolean;
  isVerified: boolean;
  isAllowBulk: boolean;
  createdAt: string;
  updatedBy: string | null;
  createdBy: string | null;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  firebaseUserId: string | null;
  jobTitle: string | null;
  middleName: string;
  profilePicture: string | null;
  isPowerUser: boolean;
  userType: string;
  gender: string;
  isActive: boolean;
  dateOfBirth: string;
  startDate: string;
  endDate: string;
  tin: string;
  licenseNumber: string | null;
  employeeNumber: string;
  driverStatus: string | null;
  driverType: string | null;
  reason: string | null;
  djiboutiEntranceLicenseNumber: string | null;
  isEmployee: boolean;
  transporterId: string | null;
  departmentId: string;
  emergencyContact: string | null;
  address: string | null;
  isAllowBulk: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  createdBy: string;
  organization: Organization;
  userRoles: UserRole[];
  activeRole?: ActiveRole;
  tenant?: Tenant;
}

export interface ActiveRole {
  id: string;
  key: string;
  name: string;
}
