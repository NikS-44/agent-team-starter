import type { User } from "../src/api/users.schemas";

/** Shared source of truth for MSW tests and SQLite seeding. */
export const seedUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
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
