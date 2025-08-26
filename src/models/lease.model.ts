import { Room } from "./room.model";
import { Tenant } from "./tenant.model";

export interface Lease {
  id?: string;
  tenantId?: string;
  propertyId?: string;
  room?: Room;
  roomId?: string;
  contractorId?: string;
  lastPaidAmount?: number;
  paidUntil?: Date;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  contractor?: Tenant;
  tenant?: Tenant;
  documents?: LeaseDocument[];
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  archivedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  archivedAt?: Date;
}

export interface LeaseDocument {
  id?: string;
  documentTypeId?: string;
  tenantId?: string;
  leaseId?: string;
  reference?: string;
  description?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  archivedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  archivedAt?: Date;
  attachment?: Blob;
}
