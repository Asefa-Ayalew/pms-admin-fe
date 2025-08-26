import { Tenant } from "./tenant.model";
import { User } from "./user.model";

export interface Department {
  id?: string;
  name: string;
  code?: string;
  description: string;
  user?: User[];
  tenant?: Tenant
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
}
