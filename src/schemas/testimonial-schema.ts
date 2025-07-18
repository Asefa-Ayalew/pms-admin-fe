import z from "zod";
export const testimonialFormSchema = z.object({
  customerName: z.string(),
  customerPosition: z.string(),
  message: z.string(),
  rating: z.number(),
});

export type testimonialFormSchema = z.infer<typeof testimonialFormSchema>;

export const testimonialDefaultValue: testimonialFormSchema = {
  customerName: "",
  customerPosition: "",
  message: "",
  rating: 1,
};
