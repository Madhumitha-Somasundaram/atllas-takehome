import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),

  middleName: z.string().optional().nullable().or(z.literal("")),

  lastName: z.string().min(1, "Last name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  phoneNumber: z
    .string()
    .refine((val) => !val || /^\+?[0-9]{7,15}$/.test(val), {
      message: "Invalid phone number",
    })
    .optional()
    .nullable()
    .or(z.literal("")),

  address: z.string().optional().nullable().or(z.literal("")),

  adminNotes: z.string().optional().nullable().or(z.literal("")),
});

export type UserFormData = z.infer<typeof userSchema>;