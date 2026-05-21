import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),

  middleName: z.string().optional().nullable().or(z.literal("")),

  lastName: z.string().min(1, "Last name is required"),

  email: z.string().email("Invalid email"),

  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .optional()
    .nullable()
    .or(z.literal("")),

  address: z.string().optional().nullable().or(z.literal("")),

  adminNotes: z.string().optional().nullable().or(z.literal("")),
});

export type UserFormData = z.infer<typeof userSchema>;