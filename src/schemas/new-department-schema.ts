import z from 'zod';
export const NewDepartmentSchema = z.object({
    name: z.string({
        required_error: "Department`s Name is required",
    })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must be at most 50 characters long" })
        .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters and spaces" }),
    description: z.string()
        .min(5, { message: "Description must be at least 5 characters long" })
    // .max(255, { message: "Description must not exceed 255 characters" })
});