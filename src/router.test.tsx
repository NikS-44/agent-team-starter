import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "./store/uiStore";
import { renderWithRouter } from "./test/utils";

describe("router", () => {
  beforeEach(() => {
    useUiStore.setState({ darkMode: false });
  });

  it("renders UsersPage at /users", async () => {
    renderWithRouter({ initialPath: "/users" });
    await waitFor(() => expect(screen.getByText("Alice Admin")).toBeInTheDocument());
  });

  it("redirects / to /users", async () => {
    renderWithRouter({ initialPath: "/" });
    await waitFor(() => expect(screen.getByText("Alice Admin")).toBeInTheDocument());
  });

  it("renders PlaygroundPage at /playground", async () => {
    renderWithRouter({ initialPath: "/playground" });
    await waitFor(() => expect(screen.getByRole("heading", { name: /playground/i })).toBeInTheDocument());
    expect(screen.getByText("Sortable list")).toBeInTheDocument();
  });

  it("renders AboutPage at /about", async () => {
    renderWithRouter({ initialPath: "/about" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /about this demo/i })).toBeInTheDocument()
    );
  });
});
