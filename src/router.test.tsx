import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  });

  it("renders AboutPage at /about", async () => {
    renderWithRouter({ initialPath: "/about" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /about this demo/i })).toBeInTheDocument()
    );
  });

  it("renders LoginPage at /login", async () => {
    renderWithRouter({ initialPath: "/login" });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute("aria-current", "page");
    });
  });

  it("renders ComponentsDemoPage at /components-demo", async () => {
    renderWithRouter({ initialPath: "/components-demo" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /component library/i })).toBeInTheDocument()
    );
    expect(screen.getByRole("heading", { name: /sortable list/i })).toBeInTheDocument();
  });

  it("renders DashboardDemoPage at /dashboard-demo", async () => {
    const user = userEvent.setup();
    renderWithRouter({ initialPath: "/dashboard-demo" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /dashboard demo/i })).toBeInTheDocument()
    );
    await user.click(screen.getByRole("row", { name: /Asha Chen/i }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Asha Chen" })).toBeInTheDocument();
    });
  });

  it("renders ShipReportPage at /ship-report", async () => {
    renderWithRouter({ initialPath: "/ship-report" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /ship report/i })).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /backend & database/i })).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByTestId("ship-verify-status")).toHaveTextContent(/all checks passed/i)
    );
  });

  it("shows committed branch evidence images when that ship report is selected", async () => {
    const user = userEvent.setup();
    renderWithRouter({ initialPath: "/ship-report" });
    await waitFor(() =>
      expect(screen.getByTestId("ship-verify-status")).toHaveTextContent(/all checks passed/i)
    );
    await user.click(screen.getByRole("button", { name: /select ship report/i }));
    const option = await screen.findByRole("menuitemradio", {
      name: /local evidence \(template\)/i,
    });
    await user.click(option);
    await waitFor(() => expect(screen.getByTestId("ship-branch-evidence")).toBeInTheDocument());
    expect(screen.getByRole("img", { name: /full-page capture: baseline/i })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /full-page capture: feature branch/i })
    ).toBeInTheDocument();
  });
});
