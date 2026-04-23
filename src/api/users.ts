import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

const UsersResponseSchema = z.array(UserSchema);

export type User = z.infer<typeof UserSchema>;

export const queryKeys = {
  users: {
    all: () => ["users"] as const,
  },
} as const;

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return UsersResponseSchema.parse(json);
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: fetchUsers,
  });
}
