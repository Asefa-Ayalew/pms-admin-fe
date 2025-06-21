import * as z from 'zod';

export const NewUserSchema = z.object({
    firstName: z.string({
        required_error: "First Name is required",
    }).min(2, "First Name must be at least 2 characters").max(50, "First Name must be at most 50 characters"),

    middleName: z.string({
        required_error: "Middle Name is required",
    }).min(2, "Middle Name must be at least 2 characters").max(50, "Middle Name must be at most 50 characters"),
    jobTitle: z.string({
        required_error: "Job Title is required",
    }).min(2, "Job Title must be at least 2 characters").max(50, "Job Title must be at most 50 characters"),
    lastName: z.string({
        required_error: "Last Name is required",
    }).min(2, "Last Name must be at least 2 characters").max(50, "Last Name must be at most 50 characters"),
    tin: z.string({ required_error: "Tin is required" })
        .min(3, "TIN must be at least 3 characters").max(10, "TIN must be at most 10 characters"),
    phone: z.string({ required_error: "Phone Number is required" }),
    email: z.string({
        required_error: "Email is required",
    }).email("Invalid email format"),

    password: z.string().min(8, "Password must be at least 8 characters").optional(),

    gender: z.enum(["Male", "Female"]).default("Male"),

    employeeNumber: z.string().optional(),

    isEmployee: z.boolean().default(true),

    departmentId: z.string().optional(),

    userRoles: z.any(),
    roleIds: z.any(),
    userType: z.string().optional(),

    dateOfBirth: z.coerce.date().optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

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
});
