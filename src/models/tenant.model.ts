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
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
}
