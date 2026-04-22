import { http, HttpResponse } from "msw";

export const userFixtures = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Alice Admin",
    email: "alice@example.com",
    role: "admin" as const,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Bob Member",
    email: "bob@example.com",
    role: "member" as const,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Carol Admin",
    email: "carol@example.com",
    role: "admin" as const,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Dan Member",
    email: "dan@example.com",
    role: "member" as const,
  },
];

export const handlers = [http.get("/api/users", () => HttpResponse.json(userFixtures))];
