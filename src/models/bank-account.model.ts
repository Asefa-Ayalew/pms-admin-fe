export interface BankAccount {
    id?: string;
    accountNumber: string;
    tenantId?: string;
    bankName: string;
    bankCode: string;
    ownerName?: string;
    ownerId?: string;
    isPreferred: boolean;
    ownerType: OwnerType;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
    archivedAt?: string;
}

export enum OwnerType {
    INDIVIDUAL = "INDIVIDUAL",
    GOVERNMENTAL = "GOVERNMENTAL",
    COMPANY = "COMPANY",
    ORGANIZATION = "ORGANIZATION",
}
