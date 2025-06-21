export interface UserRole {
  roleId: string
}

export interface UserRoles {
  userId: string,
  roleIds: string[]
}

export interface Role {
  id: string;
  name: string;
  key: string;
  description: string;
  viewTransporterPrice: boolean;
  viewShipperPrice: boolean;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string | null;
  createdBy?: string | null;
}

