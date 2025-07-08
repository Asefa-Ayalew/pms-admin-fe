import { Service } from "./service.model";

export interface Property {
  id?: string;
  tenantId?: string;
  name?: string;
  address: {
    country: string;
    city: string;
    subcity: string;
    woreda: string;
    kebele: string;
  };
  description?: string;
  numberOfRooms: number;
  size: number;
  isFurnished: boolean;
  amenities?: string[];
  galleries?: Gallery[];
  services?: PropertyService[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
  deletedBy?: string;
  deletedAt?: string;
}
export interface Gallery {
  propertyId: string;
  description?: string;
  gallery: File;
}
export interface PropertyService {
  propertyId?: string;
  serviceId: string;
  id?: string;
  service?: Service
  isOptional?: boolean;
  isPublic?: boolean;
  chargeAmount?: number;
  availableFrom?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
  deletedBy?: string;
  deletedAt?: string;
}