import { z } from "zod";

export const AuthSessionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name must be 80 characters or fewer"),
  email: z.string().trim().email("Enter a valid email").max(254, "Email is too long"),
});

export const AuthSessionResponseSchema = AuthSessionSchema.nullable();
export const LoginBodySchema = AuthSessionSchema;

export type AuthSession = z.infer<typeof AuthSessionSchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;
