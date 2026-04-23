import { Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export function App() {
  const darkMode = useUiStore((s) => s.darkMode);

  return (
    <div
      data-testid="app-root"
      className={cn("min-h-svh w-full", darkMode && "dark")}
    >
      <AppShell>
        <Outlet />
      </AppShell>
    </div>
  );
}
