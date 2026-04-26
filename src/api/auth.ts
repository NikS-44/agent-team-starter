import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AuthSession,
  AuthSessionResponseSchema,
  AuthSessionSchema,
  type LoginBody,
  LoginBodySchema,
} from "./auth.schemas";
import { queryKeys } from "./queryKeys";

export { queryKeys };

function messageFromErrorResponse(res: Response, errText: string): string {
  let message = errText || `HTTP ${res.status}`;
  try {
    const parsed = JSON.parse(errText) as { error?: string };
    if (parsed.error) message = parsed.error;
  } catch {
    // Keep the HTTP fallback when the server does not return JSON.
  }
  return message;
}

export async function fetchAuthSession(): Promise<AuthSession | null> {
  const res = await fetch("/api/auth");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return AuthSessionResponseSchema.parse(await res.json());
}

export async function login(body: LoginBody): Promise<AuthSession> {
  const parsed = LoginBodySchema.parse(body);
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(messageFromErrorResponse(res, errText));
  }
  return AuthSessionSchema.parse(await res.json());
}

export async function logout(): Promise<void> {
  const res = await fetch("/api/auth", { method: "DELETE" });
  if (res.status === 204) return;
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(messageFromErrorResponse(res, errText));
  }
}

export function useAuthSession() {
  return useQuery({
    queryKey: queryKeys.auth.current(),
    queryFn: fetchAuthSession,
    retry: 0,
    staleTime: 30_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.current() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.current() });
    },
  });
}
