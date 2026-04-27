import type { PaymentMethod } from "@/api/paymentMethods.schemas";
import { Button } from "@/components/ui/button";
import { formatPanGroups, maskPanFully } from "@/lib/maskCardNumber";
import { cn } from "@/lib/utils";
import { useState } from "react";

const brandFaceClass: Record<PaymentMethod["brand"], string> = {
  visa: cn(
    "border-l-[3px] border-l-sky-500/55",
    "bg-gradient-to-br from-sky-50/90 via-card to-card",
    "dark:from-sky-950/45 dark:via-card dark:to-card dark:border-l-sky-400/45"
  ),
  mastercard: cn(
    "border-l-[3px] border-l-orange-500/50",
    "bg-gradient-to-br from-orange-50/80 via-card to-card",
    "dark:from-orange-950/35 dark:via-card dark:to-card dark:border-l-orange-400/40"
  ),
  amex: cn(
    "border-l-[3px] border-l-emerald-600/50",
    "bg-gradient-to-br from-emerald-50/75 via-card to-card",
    "dark:from-emerald-950/40 dark:via-card dark:to-card dark:border-l-emerald-400/40"
  ),
  unknown: cn(
    "border-l-[3px] border-l-muted-foreground/30",
    "bg-gradient-to-br from-muted/50 via-card to-card",
    "dark:from-muted/25 dark:via-card dark:to-card"
  ),
};

interface OtuPaymentMethodCardProps {
  pm: PaymentMethod;
  copiedId: string | null;
  onCopy: (id: string, cardNumber: string) => void;
}

function cardExpiryShort(pm: PaymentMethod): string | null {
  if (pm.expMonth == null || pm.expYear == null) return null;
  const yy = String(pm.expYear).slice(-2);
  return `${String(pm.expMonth).padStart(2, "0")}/${yy}`;
}

function maskCvv(cvv: string): string {
  return cvv.replace(/\d/g, "•");
}

export function OtuPaymentMethodCard({ pm, copiedId, onCopy }: OtuPaymentMethodCardProps) {
  const exp = cardExpiryShort(pm);
  const [sensitiveVisible, setSensitiveVisible] = useState(false);

  const expDisplay = exp == null ? "—" : sensitiveVisible ? exp : "••/••";

  const cvvDisplay = sensitiveVisible ? pm.cvv : maskCvv(pm.cvv);

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
          "aspect-[1.586] max-h-[220px] min-h-[180px]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
          brandFaceClass[pm.brand]
        )}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_90%_at_100%_0%,var(--muted-foreground)_0%,transparent_58%)] opacity-[0.14] dark:opacity-[0.09]"
          aria-hidden
        />
        <div className="relative flex h-full flex-col p-4 pt-3.5">
          <div className="flex items-start justify-between gap-2">
            <div
              className="h-7 w-10 shrink-0 rounded-md border border-amber-700/15 bg-gradient-to-br from-amber-100 to-amber-200/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:border-amber-500/20 dark:from-amber-900/70 dark:to-amber-950/90 dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]"
              aria-hidden
            />
            <span className="rounded-full border border-border/80 bg-secondary/80 px-2 py-0.5 text-xs font-medium capitalize text-secondary-foreground">
              {pm.brand}
            </span>
          </div>

          {pm.label ? (
            <p className="text-muted-foreground mt-2 truncate text-xs">{pm.label}</p>
          ) : null}

          <div className="mt-auto space-y-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <p className="min-w-0 flex-1 font-mono text-[clamp(0.8rem,2.8vw,1rem)] leading-snug tracking-[0.12em] text-foreground">
                {sensitiveVisible ? formatPanGroups(pm.cardNumber) : maskPanFully(pm.cardNumber)}
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-foreground h-auto shrink-0 px-1 py-0 text-sm font-medium underline-offset-4 hover:underline"
                aria-expanded={sensitiveVisible}
                aria-controls={`otu-card-sensitive-${pm.id}`}
                onClick={() => setSensitiveVisible((v) => !v)}
              >
                {sensitiveVisible ? "Hide" : "Show"}
              </Button>
            </div>

            <div
              id={`otu-card-sensitive-${pm.id}`}
              className="flex items-end justify-between gap-4"
              aria-live="polite"
            >
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                  Expires
                </p>
                <p className="font-mono text-sm font-medium tabular-nums text-foreground">
                  {expDisplay}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                  CVV
                </p>
                <p className="font-mono text-sm font-medium tabular-nums text-foreground">
                  {cvvDisplay}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sensitiveVisible ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => void onCopy(pm.id, pm.cardNumber)}
        >
          {copiedId === pm.id ? "Copied" : "Copy card number"}
        </Button>
      ) : null}
    </div>
  );
}
