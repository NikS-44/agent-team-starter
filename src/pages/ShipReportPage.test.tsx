import { renderWithRouter } from "@/test/utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../mocks/server";

describe("ShipReportPage", () => {
  it("shows an error when ship-verify returns a server error", async () => {
    server.use(http.get("/api/ship-verify", () => new HttpResponse(null, { status: 500 })));
    renderWithRouter({ initialPath: "/ship-report" });
    await waitFor(() => {
      expect(screen.getByText(/could not reach.*ship-verify/i)).toBeInTheDocument();
    });
  });

  it("shows database check failed when ok is false", async () => {
    server.use(
      http.get("/api/ship-verify", () =>
        HttpResponse.json({
          ok: false,
          checkedAt: "2026-01-01T00:00:00.000Z",
          database: {
            dialect: "sqlite",
            usersTableReadable: true,
            usersRowCount: 0,
            drizzleMigrationsCount: 0,
          },
        })
      )
    );
    renderWithRouter({ initialPath: "/ship-report" });
    await waitFor(() => {
      expect(screen.getByTestId("ship-verify-status")).toHaveTextContent(/database check failed/i);
    });
  });

  it("expands the shipping checklist accordion", async () => {
    const user = userEvent.setup();
    renderWithRouter({ initialPath: "/ship-report" });
    await waitFor(() => expect(screen.getByTestId("ship-verify-status")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /shipping checklist/i }));
    await waitFor(() => {
      expect(screen.getByText(/build & static gates/i)).toBeVisible();
    });
  });
});
