import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  ImageIcon,
  ListChecks,
  Network,
  Terminal,
} from "lucide-react";

const buildGate = [
  "pnpm typecheck",
  "pnpm test",
  "pnpm lint",
  "pnpm build",
  "pnpm fallow audit → pass or warn (never fail)",
] as const;

const browserGate = [
  "Start dev server and open this page plus any new or changed routes.",
  "list_console_messages — no errors; only expected warnings.",
  "Happy path: click / fill / type; take_screenshot (save under verification/… with filePath).",
  "Network: no unexpected 4xx/5xx for app API calls.",
  "Error or empty state: one screenshot; console still clean of uncaught errors.",
] as const;

export function ShipReportPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ship verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          In-app checklist for the handoff before a PR. Pair with the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">chrome-devtools-verify</code>{" "}
          project skill and screenshots under{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">verification/</code>.
        </p>
      </div>

      <Alert>
        <ListChecks className="size-4" />
        <AlertTitle>Feature route</AlertTitle>
        <AlertDescription>
          This page lives at <code className="text-xs">/ship-report</code> — if you can read this in
          the running app, shell routing and <code className="text-xs">AppShell</code> navigation
          are working for the ship workflow.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Terminal className="size-5" aria-hidden />
            <CardTitle>Build & static gates</CardTitle>
          </div>
          <CardDescription>From CLAUDE.md — run locally and in CI.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {buildGate.map((line) => (
              <li key={line} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span className="font-mono text-xs sm:text-sm">{line}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5" aria-hidden />
            <CardTitle>Browser verification (Chrome DevTools MCP)</CardTitle>
          </div>
          <CardDescription>
            After the build is green, capture evidence in a real browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {browserGate.map((line, i) => (
              <li key={i} className="flex gap-2">
                <Circle className="mt-0.5 size-4 shrink-0 text-border" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <ImageIcon className="size-4 text-muted-foreground" aria-hidden />
            <span className="text-muted-foreground">Artifact folder:</span>
            <code className="rounded bg-muted px-2 py-1 text-xs">
              verification/&lt;branch-or-ticket&gt;/
            </code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="size-5" aria-hidden />
            <CardTitle>PR report blurb (paste into description)</CardTitle>
          </div>
          <CardDescription>Template for agents — replace italic placeholders.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-3 text-xs leading-relaxed">
            {`## Summary
_What changed_

## Routes / URLs
- /ship-report (verification)
- _your feature paths_

## Verification
- Dev server: _http://localhost:_____
- Screenshots: attached (happy + error path)
- Console: clean / _notes_
- Fallow: pass|warn
`}
          </pre>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/users" className="font-medium text-primary underline-offset-2 hover:underline">
          Open Users
        </Link>{" "}
        for a quick API + MSW smoke test after changes.
      </p>
    </div>
  );
}
