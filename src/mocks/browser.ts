import { setupWorker } from "msw/browser";

// Dev: `/api` is proxied to the local Hono + SQLite server. The worker stays active for
// stricter unhandled-request behavior; we register no request handlers so fetches use the real API.
export const worker = setupWorker();
