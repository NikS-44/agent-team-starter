import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { App } from "./App";
import { UsersPage } from "./pages/UsersPage";

const rootRoute = createRootRoute({ component: App });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    // Redirect root to /users as the default page
    // oxlint-disable-next-line consistent-return -- TanStack Router expects thrown redirect, not return value
    throw redirect({ to: "/users" });
  },
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: UsersPage,
});

const routeTree = rootRoute.addChildren([indexRoute, usersRoute]);

export function createAppRouter(opts?: { initialPath?: string }) {
  return createRouter({
    routeTree,
    history: opts?.initialPath
      ? createMemoryHistory({ initialEntries: [opts.initialPath] })
      : undefined,
  });
}

// Singleton for main.tsx production use
export const router = createAppRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
