import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { useUiStore } from "../store/uiStore";
import { renderWithProviders } from "../test/utils";
import { UsersPage } from "./UsersPage";

describe("UsersPage", () => {
  beforeEach(() => {
    useUiStore.setState({ darkMode: false });
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
      expect(screen.getByText(/no users found\./i)).toBeInTheDocument();
    });
  });
});
