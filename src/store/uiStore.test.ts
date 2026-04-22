import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "./uiStore";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({ darkMode: false });
  });

  it("has darkMode=false as the initial state", () => {
    expect(useUiStore.getState().darkMode).toBe(false);
  });

  it("toggleDarkMode flips darkMode to true", () => {
    useUiStore.getState().toggleDarkMode();
    expect(useUiStore.getState().darkMode).toBe(true);
  });

  it("calling toggleDarkMode twice returns darkMode to false", () => {
    useUiStore.getState().toggleDarkMode();
    useUiStore.getState().toggleDarkMode();
    expect(useUiStore.getState().darkMode).toBe(false);
  });
});
