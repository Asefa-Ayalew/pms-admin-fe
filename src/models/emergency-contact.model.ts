export interface AddressType {
    country: string;
    city: string;
    subcity: string;
    woreda: string;
    kebele: string;
}
export enum UserContactType {
    BAIL = 'bail',
    EMERGENCY = 'emergency',
    FAMILY = 'family',
    FRIEND = 'friend',
    OTHER = 'other',
}
export interface EmergencyContact {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    address: AddressType;
    contactType: UserContactType;
    userId?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
    archivedAt?: string;
}