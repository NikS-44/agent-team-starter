import { renderWithRouter } from "@/test/utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("DashboardDemoPage", () => {
  it("opens the member detail dialog when a table row is activated with Enter", async () => {
    const user = userEvent.setup();
    renderWithRouter({ initialPath: "/dashboard-demo" });
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /dashboard demo/i })).toBeInTheDocument()
    );
    const row = screen.getByRole("row", { name: /Nina P/i });
    row.focus();
    await user.keyboard("{Enter}");
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Nina P." })).toBeInTheDocument();
    });
  });
});
