export interface FAQ {
  id?: string;
  tenantId?: string;
  tenantName: string;
  question: string;
  answer: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
}
