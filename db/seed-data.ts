import type { PaymentMethod } from "../src/api/paymentMethods.schemas";
import type { User } from "../src/api/users.schemas";
import { DEMO_ALICE_USER_ID } from "../src/demo/constants";

/** OTU / issued test PANs (Stripe-style test numbers; not real cards). */
export const seedPaymentMethods: PaymentMethod[] = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    userId: DEMO_ALICE_USER_ID,
    brand: "visa",
    cardNumber: "4242424242424242",
    cvv: "123",
    label: "OTU — vendor checkout A",
    expMonth: 12,
    expYear: 2030,
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    userId: DEMO_ALICE_USER_ID,
    brand: "mastercard",
    cardNumber: "5555555555554444",
    cvv: "456",
    label: "OTU — vendor checkout B",
    expMonth: 6,
    expYear: 2029,
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440003",
    userId: "550e8400-e29b-41d4-a716-446655440002",
    brand: "visa",
    cardNumber: "4000000000000077",
    cvv: "789",
    label: "OTU — Bob",
    expMonth: 3,
    expYear: 2028,
  },
];

/** Shared source of truth for MSW tests and SQLite seeding. */
export const seedUsers: User[] = [
  {
    id: DEMO_ALICE_USER_ID,
    name: "Alice Admin",
    email: "alice@example.com",
    role: "admin",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Bob Member",
    email: "bob@example.com",
    role: "member",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Carol Admin",
    email: "carol@example.com",
    role: "admin",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Dan Member",
    email: "dan@example.com",
    role: "member",
  },
];
