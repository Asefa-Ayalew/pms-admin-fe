import z from "zod";

export const NewTenantSchema = z.object({
  name: z
    .string({
      required_error: "Tenant's Name is required",
    })
    .min(2, "Tenant Name must have at least 2 characters"),
  tradeName: z
    .string({
      required_error: "Trade Name is required",
    })
    .min(2, "Trade Name must have at least 2 characters"),
  tin: z
    .string({
      required_error: "TIN is required",
    })
    .regex(/^\d+$/, "Phone Number should contain only digits"),
  phoneNumber: z
    .string({
      required_error: "Phone Number is required",
    })
    .regex(/^\d+$/, "Phone Number should contain only digits")
    .min(9, "Phone Number must have at least 9 digits")
    .max(9, "Phone Number must have at most 9 digits"),
  secondaryPhoneNumbers: z
    .array(
      z
        .string()
        .regex(/^\d+$/, "Phone Number should contain only digits")
        .min(9, "Phone Number must have at least 9 digits")
        .max(9, "Phone Number must have at most 9 digits")
    )
    .optional(),
  email: z.string().min(1, "Email is required!").email("Invalid email format"),
  secondaryEmails: z.array(z.string().email("Invalid email")).optional(),
  industry: z
    .string({
      required_error: "Industry is required",
    })
    .min(2, "Industry must have at least 2 characters"),
  shortCode: z
    .string({
      required_error: "Short Code is required",
    })
    .min(3, "Short Code must have at least 3 characters")
    .max(4, "Short Code must have at most 4 characters"),
});
