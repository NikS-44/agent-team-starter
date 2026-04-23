import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateUserBody,
  CreateUserBodySchema,
  type UpdateUserBody,
  type User,
  UserSchema,
  UsersListSchema,
} from "./users.schemas";

// fallow-ignore-next-line unused-type
export type { CreateUserBody, UpdateUserBody, User } from "./users.schemas";

// fallow-ignore-next-line unused-export
export { CreateUserBodySchema, UpdateUserBodySchema, UserSchema } from "./users.schemas";

export const queryKeys = {
  users: {
    all: () => ["users"] as const,
  },
  shipVerify: {
    all: () => ["ship-verify"] as const,
  },
} as const;

function messageFromErrorResponse(res: Response, errText: string): string {
  let message = errText || `HTTP ${res.status}`;
  try {
    const j = JSON.parse(errText) as { error?: string };
    if (j.error) message = j.error;
  } catch {
    // keep message
  }
  return message;
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return UsersListSchema.parse(json);
}

export async function createUser(body: CreateUserBody): Promise<User> {
  const parsed = CreateUserBodySchema.parse(body);
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(messageFromErrorResponse(res, errText));
  }
  return UserSchema.parse(await res.json());
}

export async function updateUser(id: string, body: UpdateUserBody): Promise<User> {
  const parsed = CreateUserBodySchema.parse(body);
  const res = await fetch(`/api/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(messageFromErrorResponse(res, errText));
  }
  return UserSchema.parse(await res.json());
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (res.status === 204) return;
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(messageFromErrorResponse(res, errText));
  }
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: fetchUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserBody }) => updateUser(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}
