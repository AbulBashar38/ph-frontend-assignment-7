import z from "zod";
import type { Gender } from "@/types";

// Same rules and messages as the backend (ph-backend-assignment-6/src/app/utils/commonZodSchemas.ts)

export const emailSchema = z
  .string("Email is required")
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .pipe(z.email("Invalid email address"));

export const passwordSchema = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must be at most 64 characters long")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[0-9]/, "Password must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character");

export const nameSchema = z
  .string("Name is required")
  .trim()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must be at most 50 characters long");

export const phoneSchema = z
  .string("Phone number is required")
  .trim()
  .regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10-15 digits");

const otpSchema = z
  .string("OTP is required")
  .regex(/^\d{6}$/, "OTP must be 6 digits");

export const loginSchema = z.object({
  email: emailSchema,
  // No strength rules on login, same as the backend
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(
      ["TENANT", "OWNER"],
      "Please choose whether you want to find a place or rent out space",
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  // Only compare once a new password is typed, so an empty form doesn't claim they match
  .refine(
    (data) => !data.newPassword || data.oldPassword !== data.newPassword,
    {
      message: "New password must be different from the old password",
      path: ["newPassword"],
    },
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Profile form: empty optional fields are cleared (sent as null); phone can be left as it is
const optionalText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .refine(
      (value) => !value || (value.length >= min && value.length <= max),
      `${label} must be ${min}-${max} characters long`,
    );

export const profileSchema = z.object({
  name: nameSchema,
  phone: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^\+?[0-9]{10,15}$/.test(value),
      "Phone number must be 10-15 digits",
    ),
  occupation: optionalText("Occupation", 2, 60),
  gender: z.custom<Gender | "">(),
  address: optionalText("Address", 5, 200),
});

export type ProfileValues = z.infer<typeof profileSchema>;
