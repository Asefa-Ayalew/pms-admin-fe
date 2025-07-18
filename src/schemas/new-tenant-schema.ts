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

export const contactSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  shortCode: z.string(),
  note: z.string({
    required_error: "TIN is required",
  }),
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
  gender: z.string(),
  responsibility: z.string(),
  address: z.object({
    country: z.string({
      required_error: "Country is required",
    }),
    city: z
      .string({
        required_error: "City is required",
      })
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be at most 50 characters"),
    subcity: z
      .string({
        required_error: "Subcity is required",
      })
      .min(2, "Subcity must be at least 2 characters")
      .max(50, "Subcity must be at most 50 characters"),
    woreda: z
      .string({
        required_error: "Zip Code is required",
      })
      .min(2, "Woreda must be at least 2 characters")
      .max(50, "Woreda must be at most 50 characters"),
    kebele: z
      .string({
        required_error: "Kebele is required",
      })
      .min(2, "Kebele must be at least 2 characters")
      .max(100, "Kebele must be at most 100 characters"),
  }),
});
