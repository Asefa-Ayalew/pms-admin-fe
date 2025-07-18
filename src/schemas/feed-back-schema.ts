import z from "zod";
export const feedBackSchema = z.object({
  name: z.string(),
  subject: z.string(),
  email: z.string().min(1, "Email is required!").email("Invalid email format"),
  phone: z
    .string({
      required_error: "Phone Number is required",
    })
    .regex(/^\d+$/, "Phone Number should contain only digits")
    .min(9, "Phone Number must have at least 9 digits")
    .max(9, "Phone Number must have at most 9 digits"),
  message: z.string(),
});

export type feedBackFormSchema = z.infer<typeof feedBackSchema>;

export const feedBackDefaultValue: feedBackFormSchema = {
  name: "",
  subject: "",
  email: "",
  phone: "",
  message: "",
};
