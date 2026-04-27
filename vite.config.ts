import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { VITEST_COVERAGE_EXCLUDE, VITEST_COVERAGE_INCLUDE } from "./src/coverage/coverageScope";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type VendorChunkRule = readonly [chunkName: string, matches: (id: string) => boolean];

/** Leaf-ish `node_modules` splits — data-driven to keep Fallow CRAP off this helper. */
const VENDOR_CHUNK_RULES: VendorChunkRule[] = [
  ["vendor-recharts", (id) => id.includes("recharts")],
  ["vendor-tanstack-router", (id) => id.includes("@tanstack/react-router")],
  ["vendor-tanstack-query", (id) => id.includes("@tanstack/react-query")],
  ["vendor-icons", (id) => id.includes("lucide-react")],
  ["vendor-dnd", (id) => id.includes("@dnd-kit")],
  ["vendor-embla", (id) => id.includes("embla-carousel")],
  ["vendor-resizable-panels", (id) => id.includes("react-resizable-panels")],
  ["vendor-radix", (id) => id.includes("radix-ui") || id.includes("@radix-ui")],
  ["vendor-zod", (id) => id.includes("zod")],
  ["vendor-date-fns", (id) => id.includes("date-fns")],
];

function manualChunks(id: string): string | undefined {
  if (!id.includes("node_modules")) {
    return;
  }
  for (const [chunkName, matches] of VENDOR_CHUNK_RULES) {
    if (matches(id)) {
      return chunkName;
    }
  }
  return;
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": { target: "http://127.0.0.1:8787", changeOrigin: true },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test/localStorage-polyfill.ts", "src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "scripts/patch-coverage/*.test.ts"],
    css: false,
    coverage: {
      provider: "v8",
      /**
       * Vitest runs in jsdom; gate covers client app source only. Server/db/scripts
       * are validated via their own tests or drizzle-db-verify, not this suite.
       * Excludes shadcn `components/ui` and the components-demo page (huge, rarely exercised in unit tests).
       * Globs: `src/coverage/coverageScope.ts` (shared with patch-coverage reports).
       */
      include: [...VITEST_COVERAGE_INCLUDE],
      exclude: [...VITEST_COVERAGE_EXCLUDE],
      reportsDirectory: "coverage",
      reporter: ["text", "json-summary", "lcov"],
      reportOnFailure: true,
      thresholds: {
        /** Primary gates; kept slightly below recent suite totals to allow small drift (e.g. lightbox/pages). */
        lines: 88,
        statements: 88,
        functions: 78,
        branches: 76,
      },
    },
  },
});
