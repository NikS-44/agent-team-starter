import { useQuery } from "@tanstack/react-query";
import { type PaymentMethod, PaymentMethodsListSchema } from "./paymentMethods.schemas";

export const queryKeys = {
  paymentMethods: {
    byUser: (userId: string) => ["payment-methods", userId] as const,
  },
} as const;

export async function fetchPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  const res = await fetch(`/api/users/${encodeURIComponent(userId)}/payment-methods`);
  if (res.status === 404) {
    const errText = await res.text();
    let message = "User not found.";
    try {
      const j = JSON.parse(errText) as { error?: string };
      if (j.error) message = j.error;
    } catch {
      // keep default
    }
    throw new Error(message);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return PaymentMethodsListSchema.parse(json);
}

export function usePaymentMethods(userId: string) {
  return useQuery({
    queryKey: queryKeys.paymentMethods.byUser(userId),
    queryFn: () => fetchPaymentMethods(userId),
    enabled: Boolean(userId),
  });
}
