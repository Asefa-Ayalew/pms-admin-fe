import { z } from "zod";

const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  subcity: z.string().min(1, "Subcity is required"),
  woreda: z.string().min(1, "Woreda is required"),
  kebele: z.string().min(1, "Kebele is required"),
});

export const propertySchema = z.object({
  name: z.string(),
  address: addressSchema,
  description: z.string().optional(),
  numberOfRooms: z.number().min(1, "Must have at least 1 room"),
  size: z.number().min(1, "Size must be a positive number"),
  isFurnished: z.boolean(),
  amenities: z.array(z.string()).optional(),
});

// Infer TypeScript type
export type FormSchema = z.infer<typeof propertySchema>;

// Default Values
export const defaultValue: FormSchema = {
  address: {
    country: "",
    city: "",
    subcity: "",
    woreda: "",
    kebele: "",
  },
  name: "",
  description: "",
  numberOfRooms: 1,
  size: 1,
  isFurnished: false,
  amenities: [],
};
// gallery schema
export const gallerySchema = z.object({
  propertyId: z.string(),
  description: z.string().optional(),
  gallery: z.instanceof(File, { message: "A file is required" }),
});
export type galleryFormSchema = z.infer<typeof gallerySchema>;

export const galleryDefaultValue: galleryFormSchema = {
  propertyId: "",
  description: "",
  gallery: undefined as unknown as File,
};
// service schema
export const serviceSchema = z.object({
  serviceId: z.string(),
  isOptional: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  chargeAmount: z.number().optional(),
  availableFrom: z.date().optional(),
});
export type serviceFormSchema = z.infer<typeof serviceSchema>;

export const serviceDefaultValue: serviceFormSchema = {
  serviceId: "",
  isOptional: false,
  isPublic: true,
  chargeAmount: 0,
  availableFrom: undefined,
};
