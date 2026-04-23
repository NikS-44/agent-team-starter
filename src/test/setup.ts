import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { resetUserHandlersState } from "../mocks/handlers";
import { server } from "../mocks/server";

// jsdom does not implement window.scrollTo — stub it to suppress "not implemented" noise
// from TanStack Router's scroll-restoration module in tests.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = function scrollIntoView() {};

// Charts (Recharts) and resizable panels use ResizeObserver; jsdom does not provide it.
window.ResizeObserver = class ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};

// Recharts (and some scroll helpers) use IntersectionObserver; jsdom does not provide it.
const intersectionObserver = class {
  root: Element | null = null;
  rootMargin = "";
  readonly thresholds = [0] as const;
  // TS 5.9+ IntersectionObserver includes scrollMargin (CSS anchor).
  readonly scrollMargin = "";
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
} as unknown as typeof window.IntersectionObserver;
window.IntersectionObserver = intersectionObserver;

// shadcn Sidebar + useIsMobile use matchMedia; jsdom does not provide it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  },
});

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  resetUserHandlersState();
  server.resetHandlers();
});
afterAll(() => server.close());
