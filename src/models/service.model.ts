export interface Service {
  id?: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
  chargeType?: "Included" | "Fixed" | "Variable";
  defaultChargeAmount?: number;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  archivedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  archivedAt?: Date;
}

export const ChargeType = ["Included", "Fixed", "Variable"] as const;

