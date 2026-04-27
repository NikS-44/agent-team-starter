import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { DEMO_ALICE_USER_ID } from "../demo/constants";
import { server } from "../mocks/server";
import { createTestQueryClient } from "../test/utils";
import { fetchPaymentMethods, queryKeys, usePaymentMethods } from "./paymentMethods";

function wrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("queryKeys.paymentMethods.byUser", () => {
  it("scopes by user id", () => {
    expect(queryKeys.paymentMethods.byUser("abc")).toEqual(["payment-methods", "abc"]);
  });
});

describe("fetchPaymentMethods", () => {
  it("returns parsed payment methods", async () => {
    const list = await fetchPaymentMethods(DEMO_ALICE_USER_ID);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toMatchObject({
      id: expect.any(String),
      userId: DEMO_ALICE_USER_ID,
      brand: expect.stringMatching(/^(visa|mastercard|amex|unknown)$/),
      cardNumber: expect.stringMatching(/^\d{12,19}$/),
      cvv: expect.stringMatching(/^\d{3,4}$/),
    });
  });

  it("throws on 500", async () => {
    server.use(
      http.get("/api/users/:userId/payment-methods", () => new HttpResponse(null, { status: 500 }))
    );
    await expect(fetchPaymentMethods(DEMO_ALICE_USER_ID)).rejects.toThrow(/HTTP 500/);
  });

  it("throws on 404", async () => {
    const missing = "00000000-0000-4000-8000-000000000099";
    await expect(fetchPaymentMethods(missing)).rejects.toThrow(/not found/i);
  });

  it("throws ZodError on malformed JSON", async () => {
    server.use(
      http.get("/api/users/:userId/payment-methods", () => HttpResponse.json([{ broken: true }]))
    );
    await expect(fetchPaymentMethods(DEMO_ALICE_USER_ID)).rejects.toBeInstanceOf(ZodError);
  });
});

describe("usePaymentMethods", () => {
  it("resolves with data", async () => {
    const qc = createTestQueryClient();
    const { result } = renderHook(() => usePaymentMethods(DEMO_ALICE_USER_ID), {
      wrapper: wrapper(qc),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.length).toBeGreaterThan(0);
  });
});
