import { z } from "zod";
import { OwnerType } from "../models/bank-account.model";

export const NewBankAccountSchema = z.object({
    accountNumber: z.string()
        .regex(/^\d{10,16}$/, "Account number must be 10-16 digits"),

    tenantId: z.string().uuid("Invalid Tenant ID format").optional(),

    bankName: z.string()
        .min(3, "Bank name must be at least 3 characters")
        .max(50, "Bank name must be at most 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Bank name must contain only alphabets and spaces"),

    bankCode: z.string(),
    ownerName: z.optional(z.string()),

    ownerId: z.optional(z.string()),

    isPreferred: z.boolean(),

    ownerType: z.nativeEnum(OwnerType, {
        errorMap: () => ({ message: "Owner type must be INDIVIDUAL, GOVERNMENTAL, COMPANY, or ORGANIZATION" }),
    }),
});

export type NewBankAccountSchema = z.infer<typeof NewBankAccountSchema>;
