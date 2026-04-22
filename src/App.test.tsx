import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { useUiStore } from "./store/uiStore";
import { renderWithProviders } from "./test/utils";

describe("App dark mode", () => {
  beforeEach(() => {
    useUiStore.setState({ darkMode: false });
  });

  it("does not apply the 'dark' class initially", () => {
    renderWithProviders(<App />);
    const wrapper = screen.getByTestId("app-root");
    expect(wrapper).not.toHaveClass("dark");
  });

  it("adds the 'dark' class when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    const button = screen.getByRole("button", { name: /toggle dark mode/i });
    await user.click(button);
    const wrapper = screen.getByTestId("app-root");
    expect(wrapper).toHaveClass("dark");
  });

  it("removes the 'dark' class when the toggle button is clicked twice", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    const button = screen.getByRole("button", { name: /toggle dark mode/i });
    await user.click(button);
    await user.click(button);
    const wrapper = screen.getByTestId("app-root");
    expect(wrapper).not.toHaveClass("dark");
  });
});
