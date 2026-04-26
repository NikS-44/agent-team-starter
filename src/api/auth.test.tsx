import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { server } from "../mocks/server";
import { createTestQueryClient } from "../test/utils";
import {
  fetchAuthSession,
  login,
  logout,
  queryKeys,
  useAuthSession,
  useLogin,
  useLogout,
} from "./auth";

function wrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("queryKeys.auth.current", () => {
  it("returns the readonly tuple ['auth', 'current']", () => {
    expect(queryKeys.auth.current()).toEqual(["auth", "current"]);
  });
});

describe("fetchAuthSession", () => {
  it("returns null when no auth session is stored", async () => {
    expect(await fetchAuthSession()).toBeNull();
  });

  it("returns a parsed auth session when one is stored", async () => {
    await login({ name: "Ada Lovelace", email: "ada@example.com" });

    await expect(fetchAuthSession()).resolves.toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
  });

  it("throws on a non-ok response", async () => {
    server.use(http.get("/api/auth", () => new HttpResponse(null, { status: 500 })));

    await expect(fetchAuthSession()).rejects.toThrow(/HTTP 500/);
  });

  it("throws a ZodError when the server returns malformed data", async () => {
    server.use(http.get("/api/auth", () => HttpResponse.json({ name: "Missing email" })));

    await expect(fetchAuthSession()).rejects.toBeInstanceOf(ZodError);
  });
});

describe("login", () => {
  it("stores and returns the submitted name and email", async () => {
    await expect(login({ name: "Grace Hopper", email: "grace@example.com" })).resolves.toEqual({
      name: "Grace Hopper",
      email: "grace@example.com",
    });
  });

  it("rejects an empty name before sending the request", async () => {
    await expect(login({ name: "", email: "valid@example.com" })).rejects.toBeInstanceOf(ZodError);
  });

  it("rejects whitespace-only names before sending the request", async () => {
    await expect(login({ name: "   ", email: "valid@example.com" })).rejects.toBeInstanceOf(
      ZodError
    );
  });

  it("rejects an invalid email before sending the request", async () => {
    await expect(login({ name: "Valid", email: "not-an-email" })).rejects.toBeInstanceOf(ZodError);
  });

  it("rejects an empty email before sending the request", async () => {
    await expect(login({ name: "Valid", email: "" })).rejects.toBeInstanceOf(ZodError);
  });

  it("throws on a non-ok response", async () => {
    server.use(http.post("/api/auth", () => new HttpResponse(null, { status: 500 })));

    await expect(login({ name: "Server Error", email: "server@example.com" })).rejects.toThrow(
      /HTTP 500/
    );
  });

  it("throws a ZodError when the server returns a malformed success body", async () => {
    server.use(http.post("/api/auth", () => HttpResponse.json({ email: "broken@example.com" })));

    await expect(login({ name: "Broken", email: "broken@example.com" })).rejects.toBeInstanceOf(
      ZodError
    );
  });
});

describe("logout", () => {
  it("succeeds even when no auth session exists", async () => {
    await expect(logout()).resolves.toBeUndefined();
  });

  it("throws on a non-ok response", async () => {
    server.use(http.delete("/api/auth", () => new HttpResponse(null, { status: 500 })));

    await expect(logout()).rejects.toThrow(/HTTP 500/);
  });

  it("clears a stored auth session", async () => {
    await login({ name: "Linus Torvalds", email: "linus@example.com" });
    await logout();

    await expect(fetchAuthSession()).resolves.toBeNull();
  });
});

describe("useAuthSession", () => {
  it("starts in a loading state and resolves with null", async () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useAuthSession(), { wrapper: wrapper(queryClient) });

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  it("enters an error state when the server returns a 500", async () => {
    server.use(http.get("/api/auth", () => new HttpResponse(null, { status: 500 })));
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useAuthSession(), { wrapper: wrapper(queryClient) });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("enters an error state when the server returns malformed data", async () => {
    server.use(http.get("/api/auth", () => HttpResponse.json({ name: "Missing email" })));
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useAuthSession(), { wrapper: wrapper(queryClient) });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(ZodError);
  });
});

describe("auth mutations", () => {
  it("refetches the current auth session after login", async () => {
    const queryClient = createTestQueryClient();
    await queryClient.prefetchQuery({
      queryKey: queryKeys.auth.current(),
      queryFn: fetchAuthSession,
    });
    const { result } = renderHook(() => useLogin(), { wrapper: wrapper(queryClient) });

    await result.current.mutateAsync({ name: "Katherine Johnson", email: "kj@example.com" });

    const session = await queryClient.fetchQuery({
      queryKey: queryKeys.auth.current(),
      queryFn: fetchAuthSession,
    });
    expect(session).toEqual({ name: "Katherine Johnson", email: "kj@example.com" });
  });

  it("refetches the current auth session after logout", async () => {
    const queryClient = createTestQueryClient();
    await login({ name: "Alan Turing", email: "alan@example.com" });
    await queryClient.prefetchQuery({
      queryKey: queryKeys.auth.current(),
      queryFn: fetchAuthSession,
    });
    const { result } = renderHook(() => useLogout(), { wrapper: wrapper(queryClient) });

    await result.current.mutateAsync();

    const session = await queryClient.fetchQuery({
      queryKey: queryKeys.auth.current(),
      queryFn: fetchAuthSession,
    });
    expect(session).toBeNull();
  });
});
