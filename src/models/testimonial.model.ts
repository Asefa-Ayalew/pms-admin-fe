export interface Testimonial {
  id?: string;
  customerName: string;
  customerPosition: string;
  message: string;
  rating: number;
  customerImage?: CustomerImage;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  archivedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  archivedAt?: Date;
}

interface CustomerImage {
  name: string;
  url: string;
  originalName: string;
  type: string;
  size: number;
  bucketName: string;
}
