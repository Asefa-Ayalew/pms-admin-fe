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
export interface Gallery {
  id?: string;
  propertyId: string;
  description?: string;
  isActive?: boolean;
  gallery?: File;
  type?: string;
  url?: string;
  photo?: Photo;
}
interface Photo {
  bucketName: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
}
