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
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /playground/i })).toBeInTheDocument()
    );
    expect(screen.getByRole("link", { name: /open in component library/i })).toHaveAttribute(
      "href",
      "/components-demo#sortable"
    );
  });

  it("renders AboutPage at /about", async () => {
    renderWithRouter({ initialPath: "/about" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /about this demo/i })).toBeInTheDocument()
    );
  });

  it("renders ComponentsDemoPage at /components-demo", async () => {
    renderWithRouter({ initialPath: "/components-demo" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /component library/i })).toBeInTheDocument()
    );
    expect(screen.getByRole("heading", { name: /sortable list/i })).toBeInTheDocument();
  });

  it("renders DashboardDemoPage at /dashboard-demo", async () => {
    renderWithRouter({ initialPath: "/dashboard-demo" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /dashboard demo/i })).toBeInTheDocument()
    );
  });

  it("renders ShipReportPage at /ship-report", async () => {
    renderWithRouter({ initialPath: "/ship-report" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /ship report/i })).toBeInTheDocument()
    );
  });
});
