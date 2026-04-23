import { BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">About this demo</h1>
        <p className="text-sm text-muted-foreground">
          Interview / portfolio template — shadcn/ui, TanStack Router, and a responsive shell.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" aria-hidden />
            <CardTitle>Stack</CardTitle>
          </div>
          <CardDescription>What ships in the box</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>React 18, Vite, TanStack Query + Router, shadcn/ui (Nova), Tailwind v4, SQLite + Drizzle API.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="size-5" aria-hidden />
            <CardTitle>Customize</CardTitle>
          </div>
          <CardDescription>Fast theming for demos</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Tweak <code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/styles/demo-overrides.css</code> for
            accents and radii; keep generated theme tokens in one place.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
