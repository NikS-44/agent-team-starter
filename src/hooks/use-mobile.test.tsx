import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("returns true when the viewport is narrower than the mobile breakpoint", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 400 });
    const { result } = renderHook(() => useIsMobile());
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("updates when the matchMedia change event fires", async () => {
    let changeHandler: (() => void) | undefined;
    window.matchMedia = vi.fn<(query: string) => MediaQueryList>().mockImplementation(() => {
      return {
        matches: false,
        media: "(max-width: 767px)",
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_: string, fn: () => void) => {
          changeHandler = fn;
        },
        removeEventListener: () => {},
        dispatchEvent: () => false,
      } as unknown as MediaQueryList;
    });

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 400 });
    const { result } = renderHook(() => useIsMobile());
    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
    act(() => {
      changeHandler?.();
    });
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});
