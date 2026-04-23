import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { server } from "../mocks/server";
import { createTestQueryClient } from "../test/utils";
import {
  createUser,
  deleteUser,
  fetchUsers,
  queryKeys,
  useCreateUser,
  useUsers,
  updateUser,
} from "./users";

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

describe("createUser", () => {
  it("returns the created user on 201", async () => {
    const created = await createUser({
      name: "Eve",
      email: "eve2@example.com",
      role: "member",
    });
    expect(created.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(created).toMatchObject({
      name: "Eve",
      email: "eve2@example.com",
      role: "member",
    });
  });

  it("throws on duplicate email (409)", async () => {
    await expect(
      createUser({ name: "X", email: "alice@example.com", role: "member" })
    ).rejects.toThrow(/already exists/i);
  });
});

describe("updateUser", () => {
  it("returns the updated user on success", async () => {
    const alice = (await fetchUsers()).find((u) => u.email === "alice@example.com");
    expect(alice).toBeDefined();
    const updated = await updateUser(alice!.id, {
      name: "Alice A.",
      email: "alice@example.com",
      role: "admin",
    });
    expect(updated).toMatchObject({ name: "Alice A.", email: "alice@example.com", role: "admin" });
  });

  it("throws on duplicate email (409)", async () => {
    const bob = (await fetchUsers()).find((u) => u.email === "bob@example.com");
    const alice = (await fetchUsers()).find((u) => u.email === "alice@example.com");
    expect(bob).toBeDefined();
    expect(alice).toBeDefined();
    await expect(
      updateUser(bob!.id, { name: "Bob", email: "alice@example.com", role: "member" })
    ).rejects.toThrow(/already exists/i);
  });

  it("throws on missing user (404)", async () => {
    const fake = "00000000-0000-4000-8000-000000000000";
    await expect(
      updateUser(fake, { name: "N", email: "n@example.com", role: "member" })
    ).rejects.toThrow(/not found/i);
  });
});

describe("deleteUser", () => {
  it("succeeds with 204", async () => {
    const before = await fetchUsers();
    const victim = before.find((u) => u.email === "dan@example.com");
    expect(victim).toBeDefined();
    await expect(deleteUser(victim!.id)).resolves.toBeUndefined();
    const after = await fetchUsers();
    expect(after.some((u) => u.id === victim!.id)).toBe(false);
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

describe("useCreateUser", () => {
  it("refetches the users list after a successful create", async () => {
    const queryClient = createTestQueryClient();
    await queryClient.prefetchQuery({ queryKey: queryKeys.users.all(), queryFn: fetchUsers });
    const { result: createResult } = renderHook(() => useCreateUser(), {
      wrapper: wrapper(queryClient),
    });

    await createResult.current.mutateAsync({
      name: "Fay",
      email: "fay@example.com",
      role: "admin",
    });

    const list = await queryClient.fetchQuery({ queryKey: queryKeys.users.all(), queryFn: fetchUsers });
    expect(list.some((u) => u.name === "Fay")).toBe(true);
  });
});
