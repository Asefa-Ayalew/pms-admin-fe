import z from "zod";
export const roomSchema = z.object({
  propertyId: z.string(),
  description: z.string().optional(),
  roomNumber: z.string(),
  floorNumber: z.string(),
  type: z.string(),
  size: z.number(),
  isFurnished: z.boolean().optional(),
  makePublic: z.boolean().optional(),
  numberOfBedRooms: z
    .number()
    .min(1, "Must have at least 1 bedroom")
    .optional(),
  amenities: z.array(z.string()).optional(),
});

export type roomFormSchema = z.infer<typeof roomSchema>;

export const roomDefaultValue: roomFormSchema = {
  propertyId: "",
  description: "",
  floorNumber: "",
  roomNumber: "",
  type: "",
  size: 1,
  amenities: [],
  isFurnished: false,
  makePublic: false,
  numberOfBedRooms: 1,
};

export const gallerySchema = z.object({
  roomId: z.string(),
  description: z.string().optional(),
  gallery: z.instanceof(File, { message: "A file is required" }),
});

export type galleryFormSchema = z.infer<typeof gallerySchema>;

export const galleryDefaultValue: galleryFormSchema = {
  roomId: "",
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
  serviceId: '',
  isOptional: false,
  isPublic: true,
  chargeAmount: 0,
  availableFrom: undefined,
};