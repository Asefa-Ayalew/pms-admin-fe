import z from 'zod'
import { UserContactType } from '../models/emergency-contact.model'
export const NewEmergencyContactSchema = z.object({
    // id: z.optional(z.string().uuid()),
    firstName: z.string({
        required_error: "First Name is required",
    }).min(2, "First Name must be at least 2 characters").max(50, "First Name must be at most 50 characters"),

    middleName: z.string({
        required_error: "Middle Name is required",
    }).min(2, "Middle Name must be at least 2 characters").max(50, "Middle Name must be at most 50 characters"),
    lastName: z.string({
        required_error: "Last Name is required",
    }).min(2, "Last Name must be at least 2 characters").max(50, "Last Name must be at most 50 characters"),
    userId: z.string({
        required_error: "User is required"
    }).optional(),
    phone: z.string({
        required_error: "Phone number is required"
    }),
    email: z.string({
        required_error: "Email is required",
    }).email("Invalid email format"),
    address: z.object({
        country: z.string({
            required_error: "Country is required",
        }),
        city: z.string({
            required_error: "City is required",
        }).min(2, "City must be at least 2 characters").max(50, "City must be at most 50 characters"),
        subcity: z.string({
            required_error: "Subcity is required",
        }).min(2, "Subcity must be at least 2 characters").max(50, "Subcity must be at most 50 characters"),
        woreda: z.string({
            required_error: "Zip Code is required",
        }).min(2, "Woreda must be at least 2 characters").max(50, "Woreda must be at most 50 characters"),
        kebele: z.string({
            required_error: "Kebele is required",
        }).min(2, "Kebele must be at least 2 characters").max(100, "Kebele must be at most 100 characters"),
    }),
    contactType: z.nativeEnum(UserContactType, {
        errorMap: () => ({ message: "Contact type must be BAIL, EMERGENCY, FAMILY, FRIEND, or OTHER" }),
    })
})