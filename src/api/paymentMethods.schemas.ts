import { z } from "zod";

const PaymentMethodBrandSchema = z.enum(["visa", "mastercard", "amex", "unknown"]);

/** 12–19 digits per ISO/IEC 7812; Luhn optional for tests (issuer-generated OTU may vary). */
const CardNumberSchema = z.string().regex(/^\d{12,19}$/, "card number must be 12–19 digits");

const CvvSchema = z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits");

const PaymentMethodSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  brand: PaymentMethodBrandSchema,
  cardNumber: CardNumberSchema,
  cvv: CvvSchema,
  label: z.string().nullable(),
  expMonth: z.number().int().min(1).max(12).nullable(),
  expYear: z.number().int().min(2000).max(2100).nullable(),
});

export const PaymentMethodsListSchema = z.array(PaymentMethodSchema);

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
