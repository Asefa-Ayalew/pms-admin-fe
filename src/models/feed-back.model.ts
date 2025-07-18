export interface FeedBack {
    id?: string;
    tenantId?: string;
    tenantName?: string;
    name: string;
    subject: string;
    phone: string;
    email: string;
    message: string;
    createdBy?: string;
    updatedBy?: string;
    deletedBy?:string;
    archivedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    archivedAt?: Date
}