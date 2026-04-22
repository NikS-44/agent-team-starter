import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { User } from "../api/users";
import { UserCard } from "./UserCard";

const adminUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Alice Admin",
  email: "alice@example.com",
  role: "admin",
};

const memberUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440002",
  name: "Bob Member",
  email: "bob@example.com",
  role: "member",
};

describe("UserCard", () => {
  it("renders the user's name, email and role", () => {
    render(<UserCard user={adminUser} />);
    expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("shows an 'admin' badge for an admin user", () => {
    render(<UserCard user={adminUser} />);
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("shows a 'member' badge for a member user", () => {
    render(<UserCard user={memberUser} />);
    expect(screen.getByText("member")).toBeInTheDocument();
  });
});
