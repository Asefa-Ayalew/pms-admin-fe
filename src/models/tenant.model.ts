export interface Tenant {
  id?: string;
  name: string;
  tradeName: string;
  tin: string;
  phoneNumber: string;
  email: string;
  industry: string;
  secondaryPhoneNumbers?: string[];
  secondaryEmails?: string[];
  description?: string;
  shortCode: string;
  contacts?: Contact[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
}
export interface Logo {
  id?: string;
  name: string;
  logo?: TenantLogo;
  tradeName: string;
  tin: string;
  phoneNumber: string;
  email: string;
  shortCode: string;
  secondaryPhoneNumbers?: string[];
  secondaryEmails?: string[];
  industry?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface Contact {
  id?: string;
  tenantId?: string;
  name: string;
  address?: TenantAddress;
  note: string;
  gender: string;
  phoneNumber: string;
  email: string;
  secondaryPhoneNumbers?: string[];
  secondaryEmails?: string[];
  industry?: string;
  responsibility?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface TenantAddress {
  country: string;
  city: string;
  subcity: string;
  woreda: string;
  kebele: string;
}

interface TenantLogo {
  name: string;
  url: string;
  originalName: string;
  type: string;
  size: number;
  bucketName: string;
}
