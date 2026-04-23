import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

export const CreateUserBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["admin", "member"]),
});

export const UsersListSchema = z.array(UserSchema);

/** Same fields as create; used for PUT/PATCH bodies. */
export const UpdateUserBodySchema = CreateUserBodySchema;

export type User = z.infer<typeof UserSchema>;
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;
