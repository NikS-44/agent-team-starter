import { usePaymentMethods } from "@/api/paymentMethods";
import { OtuPaymentMethodCard } from "@/components/OtuPaymentMethodCard";
import { Button } from "@/components/ui/button";
import { DEMO_ALICE_USER_ID } from "@/demo/constants";
import { Link, getRouteApi } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

const routeApi = getRouteApi("/users/$userId/payment-methods");

export function UserPaymentMethodsPage() {
  const { userId } = routeApi.useParams();
  const { data, isPending, isError, error } = usePaymentMethods(userId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    if (!copiedId) return;
    const t = globalThis.setTimeout(() => setCopiedId(null), 2000);
    return () => globalThis.clearTimeout(t);
  }, [copiedId]);

  const onCopy = useCallback(async (id: string, cardNumber: string) => {
    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(cardNumber);
      setCopiedId(id);
    } catch {
      setCopyFailed(true);
    }
  }, []);

  if (isPending) {
    return <p className="text-muted-foreground">Loading payment methods…</p>;
  }

  if (isError) {
    return (
      <div role="alert" className="text-destructive">
        {error instanceof Error ? error.message : "Failed to load payment methods."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">One-time use cards</h1>
          <p className="text-muted-foreground text-sm">
            Full numbers for issued cards. Production should encrypt at rest and meet PCI controls.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/users">Back to users</Link>
        </Button>
      </div>

      <p className="sr-only" aria-live="polite">
        {copiedId ? "Card number copied to clipboard." : ""}
      </p>
      {copyFailed ? (
        <p role="alert" className="text-destructive text-sm">
          Clipboard unavailable. Copy the number manually.
        </p>
      ) : null}

      {data.length === 0 ? (
        <p className="text-muted-foreground">No cards for this user.</p>
      ) : (
        <ul className="flex flex-col gap-4" aria-label="Payment methods">
          {data.map((pm) => (
            <li key={pm.id}>
              <OtuPaymentMethodCard pm={pm} copiedId={copiedId} onCopy={onCopy} />
            </li>
          ))}
        </ul>
      )}

      {userId === DEMO_ALICE_USER_ID ? (
        <p className="text-muted-foreground text-xs">
          Demo seed data — same rows as local SQLite when using default seeds.
        </p>
      ) : null}
    </div>
  );
}
