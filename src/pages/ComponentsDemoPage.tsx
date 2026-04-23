import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, LayoutDashboard, PanelTop, Sparkles } from "lucide-react";
import { AllComponentsShowcase } from "./components-demo/AllComponentsShowcase";

export function ComponentsDemoPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Design system
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Component library
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Live examples of everything in{" "}
              <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                @/components/ui
              </code>
              . Use the jump list to move quickly — every control here is real, not a screenshot.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:justify-end">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link to="/dashboard-demo">
                <LayoutDashboard className="size-4" aria-hidden />
                Dashboard demo
              </Link>
            </Button>
            <Button asChild variant="default" size="sm" className="gap-1.5">
              <Link to="/playground">
                <Sparkles className="size-4" aria-hidden />
                Playground
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
          <Card className="h-full border-dashed shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="size-4 text-primary" aria-hidden />
                <CardTitle className="text-base">How to use this page</CardTitle>
              </div>
              <CardDescription className="text-pretty">
                Pick a section from the list below, or search to narrow it. Open overlays and menus
                to see motion and focus states. The{" "}
                <span className="text-foreground">Sortable</span> section shows drag-and-reorder.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground">
              <p className="flex gap-2">
                <span className="font-mono text-xs text-foreground">1</span>
                Filter or click a section link — the page scrolls smoothly to that group.
              </p>
              <p className="flex gap-2">
                <span className="font-mono text-xs text-foreground">2</span>
                Interact with inputs, dialogs, and charts; check the browser console stays clean
                while you explore.
              </p>
              <p className="flex gap-2">
                <span className="font-mono text-xs text-foreground">3</span>
                Compare with a full layout on{" "}
                <span className="text-foreground">Dashboard demo</span> or ship checks on{" "}
                <Link
                  to="/ship-report"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Ship report
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="h-full shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <PanelTop className="size-4 text-primary" aria-hidden />
                <CardTitle className="text-base">Same shell as the product</CardTitle>
              </div>
              <CardDescription>
                The left rail and header use the same sidebar primitives as the rest of the app, so
                what you see here matches other routes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-0">
              <Button asChild variant="secondary" size="sm">
                <Link to="/users">Users</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link to="/ship-report">Ship report</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
                  shadcn docs
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div
        id="component-showcase-start"
        className="scroll-mt-6 rounded-2xl border border-border/80 bg-card/40 p-3 shadow-sm ring-1 ring-border/40 sm:p-4 md:p-6"
      >
        <AllComponentsShowcase />
      </div>
    </div>
  );
}
