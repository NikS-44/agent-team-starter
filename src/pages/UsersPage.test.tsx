import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../mocks/server";
import { useUiStore } from "../store/uiStore";
import { renderWithProviders } from "../test/utils";
import { UsersPage } from "./UsersPage";

describe("UsersPage", () => {
  beforeEach(() => {
    useUiStore.setState({ darkMode: false });
    vi.stubGlobal("confirm", () => true);
  });

  it("shows the loading skeleton while fetching", () => {
    renderWithProviders(<UsersPage />);
    expect(screen.getAllByTestId("skeleton-item").length).toBeGreaterThan(0);
  });

  it("renders all 4 users from the fixture after load", async () => {
    renderWithProviders(<UsersPage />);
    await waitFor(() => {
      expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    });
    expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    expect(screen.getByText("Bob Member")).toBeInTheDocument();
    expect(screen.getByText("Carol Admin")).toBeInTheDocument();
    expect(screen.getByText("Dan Member")).toBeInTheDocument();
  });

  it("updates a user from the card editor", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />);
    await waitFor(() => {
      expect(screen.getByText("Bob Member")).toBeInTheDocument();
    });
    const editButtons = screen.getAllByRole("button", { name: /^edit$/i });
    await user.click(editButtons[1] ?? editButtons[0]);
    const form = await screen.findByRole("form", { name: "Edit user Bob Member" });
    const nameField = within(form).getByLabelText(/^name/i);
    await user.clear(nameField);
    await user.type(nameField, "Bobby");
    await user.click(within(form).getByRole("button", { name: /^save$/i }));
    await waitFor(() => {
      expect(screen.getByText("Bobby")).toBeInTheDocument();
    });
  });

  it("removes a user when delete is confirmed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />);
    await waitFor(() => {
      expect(screen.getByText("Dan Member")).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByRole("button", { name: /^delete$/i });
    await user.click(deleteButtons[deleteButtons.length - 1] ?? deleteButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText("Dan Member")).not.toBeInTheDocument();
    });
  });

  it("adds a user from the form and shows them in the list", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />);
    await waitFor(() => {
      expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    });
    await user.type(screen.getByLabelText(/^name/i), "Eve New");
    await user.type(screen.getByLabelText(/^email/i), "eve@example.com");
    await user.selectOptions(screen.getByLabelText(/^role/i), "admin");
    await user.click(screen.getByRole("button", { name: /add user/i }));
    await waitFor(() => {
      expect(screen.getByText("Eve New")).toBeInTheDocument();
    });
    expect(screen.getByText("eve@example.com")).toBeInTheDocument();
  });

  it("shows an error message when the API returns a 500", async () => {
    server.use(http.get("/api/users", () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<UsersPage />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("shows an empty state when the API returns an empty array", async () => {
    server.use(http.get("/api/users", () => HttpResponse.json([])));
    renderWithProviders(<UsersPage />);
    await waitFor(() => {
      expect(screen.getByText(/no users yet/i)).toBeInTheDocument();
    });
  });
});
