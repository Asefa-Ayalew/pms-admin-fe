import z from "zod";
export const faqSchema = z.object({
  id: z.string(),
  tenantId: z.string().optional(),
  tenantName: z.string(),
  question: z.string(),
  answer: z.string(),
});

export type faqFormSchema = z.infer<typeof faqSchema>;

export const faqDefaultValue: faqFormSchema = {
  id: "",
  tenantId: "",
  tenantName: "",
  question: "",
  answer: "",
};
