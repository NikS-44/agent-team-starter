import { useAuthSession, useLogout } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ClipboardList,
  Info,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  Moon,
  PanelsTopLeft,
  Sun,
  Users,
} from "lucide-react";
import * as React from "react";

const mainNav: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[] =
  [
    { to: "/users", label: "Users", icon: Users },
    { to: "/login", label: "Login", icon: LogIn },
    { to: "/playground", label: "Playground", icon: LayoutGrid },
    { to: "/components-demo", label: "Components", icon: PanelsTopLeft },
    { to: "/dashboard-demo", label: "Dashboard", icon: LayoutDashboard },
    { to: "/ship-report", label: "Ship report", icon: ClipboardList },
    { to: "/about", label: "About", icon: Info },
  ];

function AuthControls() {
  const { data: session, isPending, isError } = useAuthSession();
  const logoutMutation = useLogout();

  if (isPending) {
    return <span className="text-xs text-muted-foreground">Loading auth...</span>;
  }

  if (isError) {
    return <span className="text-xs text-destructive">Sign-in unavailable</span>;
  }

  if (!session) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        Current user: {session.name}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          void logoutMutation.mutateAsync();
        }}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const darkMode = useUiStore((s) => s.darkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
          <p className="px-2 text-sm font-semibold tracking-tight">Agent Team</p>
          <p className="px-2 text-xs text-sidebar-foreground/70">Demo template</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.to === "/"
                      ? pathname === "/"
                      : pathname === item.to || pathname.startsWith(`${item.to}/`);
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link to={item.to} aria-current={isActive ? "page" : undefined}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header
          className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-2 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-4"
          role="banner"
        >
          <SidebarTrigger className="md:-ml-1" />
          <div className="ml-auto flex items-center gap-2">
            <AuthControls />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              aria-pressed={darkMode}
              className="shrink-0"
            >
              {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </header>
        <div
          className={cn("min-h-svh max-w-full flex-1 p-4 md:p-6", "bg-background text-foreground")}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
