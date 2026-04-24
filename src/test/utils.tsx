import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { type RenderOptions, type RenderResult, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { createAppRouter } from "../router";

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 0, gcTime: 0, staleTime: Number.POSITIVE_INFINITY },
      mutations: { retry: 0 },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { queryClient?: QueryClient }
): RenderResult & { queryClient: QueryClient } {
  const queryClient = options?.queryClient ?? createTestQueryClient();
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    );
  }
  const result = render(ui, { wrapper: Wrapper, ...options });
  return { ...result, queryClient };
}

// Renders the full router (App layout + matched route) inside QueryClientProvider.
// Defaults to /users so the redirect at / does not fire in tests.
export function renderWithRouter(opts?: {
  initialPath?: string;
  queryClient?: QueryClient;
}): RenderResult & { queryClient: QueryClient } {
  const queryClient = opts?.queryClient ?? createTestQueryClient();
  const testRouter = createAppRouter({ initialPath: opts?.initialPath ?? "/users" });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={testRouter} />
      </TooltipProvider>
    </QueryClientProvider>
  );
  return { ...result, queryClient };
}
