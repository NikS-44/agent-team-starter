import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { resetUserHandlersState } from "../mocks/handlers";
import { server } from "../mocks/server";

// jsdom does not implement window.scrollTo — stub it to suppress "not implemented" noise
// from TanStack Router's scroll-restoration module in tests.
window.scrollTo = () => {};

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
