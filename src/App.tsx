import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import { Outlet } from "@tanstack/react-router";

export function App() {
  const darkMode = useUiStore((s) => s.darkMode);

  return (
    <div data-testid="app-root" className={cn("min-h-svh w-full", darkMode && "dark")}>
      <AppShell>
        <Outlet />
      </AppShell>
    </div>
  );
}
