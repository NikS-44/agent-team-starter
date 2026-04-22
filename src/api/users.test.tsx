import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { server } from "../mocks/server";
import { createTestQueryClient } from "../test/utils";
import { fetchUsers, queryKeys, useUsers } from "./users";

function wrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("queryKeys.users.all", () => {
  it("returns the readonly tuple ['users']", () => {
    const key = queryKeys.users.all();
    expect(key).toEqual(["users"]);
  });
});

describe("fetchUsers", () => {
  it("returns a parsed array of users on success", async () => {
    const users = await fetchUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      role: expect.stringMatching(/^(admin|member)$/),
    });
  });

  it("throws an error on a non-ok response", async () => {
    server.use(http.get("/api/users", () => new HttpResponse(null, { status: 500 })));
    await expect(fetchUsers()).rejects.toThrow(/HTTP 500/);
  });

  it("throws a ZodError when the server returns malformed data", async () => {
    server.use(http.get("/api/users", () => HttpResponse.json({ broken: true })));
    await expect(fetchUsers()).rejects.toBeInstanceOf(ZodError);
  });
});

describe("useUsers", () => {
  it("starts in a loading state and resolves with data", async () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUsers(), { wrapper: wrapper(queryClient) });

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data?.length).toBeGreaterThan(0);
  });

  it("enters error state when the server returns a 500", async () => {
    server.use(http.get("/api/users", () => new HttpResponse(null, { status: 500 })));
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUsers(), { wrapper: wrapper(queryClient) });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toMatch(/HTTP 500/);
  });
});
