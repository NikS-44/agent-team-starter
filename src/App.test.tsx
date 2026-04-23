import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "./store/uiStore";
import { renderWithRouter } from "./test/utils";

describe("App dark mode", () => {
  beforeEach(() => {
    useUiStore.setState({ darkMode: false });
  });

  it("does not apply the 'dark' class initially", async () => {
    renderWithRouter();
    // Wait for router to settle (redirect fires synchronously but router renders async)
    await waitFor(() => expect(screen.getByTestId("app-root")).toBeInTheDocument());
    expect(screen.getByTestId("app-root")).not.toHaveClass("dark");
  });

  it("adds the 'dark' class when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /toggle dark mode/i })).toBeInTheDocument()
    );
    await user.click(screen.getByRole("button", { name: /toggle dark mode/i }));
    expect(screen.getByTestId("app-root")).toHaveClass("dark");
  });

  it("removes the 'dark' class when the toggle button is clicked twice", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /toggle dark mode/i })).toBeInTheDocument()
    );
    const btn = screen.getByRole("button", { name: /toggle dark mode/i });
    await user.click(btn);
    await user.click(btn);
    expect(screen.getByTestId("app-root")).not.toHaveClass("dark");
  });
});
