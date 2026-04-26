import { useShipVerify } from "@/api/shipVerify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { LOCAL_VERIFICATION_REPORTS } from "@/data/localVerificationReports";
import type { LocalVerificationReport } from "@/data/localVerificationReports";
import { DEFAULT_SHIP_REPORT_ID, SHIP_REPORTS } from "@/data/shipReports";
import type { ShipReportBranchEvidence } from "@/data/shipReportsTypes";
import { buildClaudeNewChatLink, buildCursorDeeplinks } from "@/lib/shipDeeplinks";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Database,
  ExternalLink,
  ImageIcon,
  ListChecks,
  Maximize2,
  MessageCircle,
  Network,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import * as React from "react";

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
  "Happy path: click / fill / type; take_screenshot (MCP → verification/…); commit proof under public/screenshots/<slug>/ for ship-report.",
  "Network: no unexpected 4xx/5xx for app API calls.",
  "Error or empty state: one screenshot; console still clean of uncaught errors.",
] as const;

function reportById(id: string) {
  return SHIP_REPORTS.find((r) => r.id === id) ?? SHIP_REPORTS[0];
}

type LightboxState =
  | { kind: "gallery"; index: number }
  | { kind: "branch"; src: string; caption: string }
  | null;

function ShipBranchEvidenceSection({
  evidence,
  onOpenBranchImage,
}: {
  evidence: ShipReportBranchEvidence;
  onOpenBranchImage: (src: string, caption: string) => void;
}) {
  return (
    <section
      className="space-y-4 rounded-2xl border border-border/80 bg-card/30 p-4 sm:p-6"
      aria-labelledby="branch-evidence-heading"
      data-testid="ship-branch-evidence"
    >
      <h3 id="branch-evidence-heading" className="text-sm font-medium text-foreground">
        Baseline vs branch (committed screenshots)
      </h3>
      <p className="text-sm text-muted-foreground">
        Full-page captures from the same route: left is{" "}
        <span className="font-medium text-foreground">{evidence.baseLabel}</span>, right is{" "}
        <span className="font-medium text-foreground">{evidence.headLabel}</span>. Click an image to
        zoom. Paths live under <code className="rounded bg-muted px-1 py-0.5 text-xs">public/</code>{" "}
        so they ship in git and PR diffs.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <figure className="space-y-2">
          <figcaption className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {evidence.baseLabel}
          </figcaption>
          <button
            type="button"
            onClick={() => onOpenBranchImage(evidence.beforeSrc, evidence.baseLabel)}
            aria-label={`Open full size: ${evidence.baseLabel}`}
            className={cn(
              "group w-full overflow-hidden rounded-xl border border-border/80 bg-muted/20 text-left shadow-sm",
              "transition hover:border-primary/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <span className="relative block w-full">
              <img
                src={evidence.beforeSrc}
                alt={`Full-page capture: ${evidence.baseLabel}`}
                className="max-h-[min(75vh,56rem)] w-full object-contain object-top"
                loading="lazy"
                decoding="async"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                <span className="flex size-10 items-center justify-center rounded-full bg-background/95 opacity-0 shadow ring-1 ring-border/80 transition group-hover:opacity-100">
                  <Maximize2 className="size-5 text-foreground" aria-hidden />
                </span>
              </span>
            </span>
          </button>
        </figure>
        <figure className="space-y-2">
          <figcaption className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {evidence.headLabel}
          </figcaption>
          <button
            type="button"
            onClick={() => onOpenBranchImage(evidence.afterSrc, evidence.headLabel)}
            aria-label={`Open full size: ${evidence.headLabel}`}
            className={cn(
              "group w-full overflow-hidden rounded-xl border border-border/80 bg-muted/20 text-left shadow-sm",
              "transition hover:border-primary/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <span className="relative block w-full">
              <img
                src={evidence.afterSrc}
                alt={`Full-page capture: ${evidence.headLabel}`}
                className="max-h-[min(75vh,56rem)] w-full object-contain object-top"
                loading="lazy"
                decoding="async"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                <span className="flex size-10 items-center justify-center rounded-full bg-background/95 opacity-0 shadow ring-1 ring-border/80 transition group-hover:opacity-100">
                  <Maximize2 className="size-5 text-foreground" aria-hidden />
                </span>
              </span>
            </span>
          </button>
        </figure>
      </div>
    </section>
  );
}

function ShipBackendVerifyCard() {
  const { data, isPending, isError, error } = useShipVerify();

  return (
    <Card className="border-border/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="size-5" aria-hidden />
          <CardTitle role="heading" aria-level={2}>
            Backend &amp; database
          </CardTitle>
        </div>
        <CardDescription>
          Live snapshot from the API and SQLite (same request path as the browser). After backend or
          schema work, open this page with the dev stack running and confirm{" "}
          <code className="text-xs">GET /api/ship-verify</code> returns{" "}
          <code className="text-xs">200</code> and the counts match what you expect. Chrome DevTools
          MCP can use this route for network + screenshot evidence without extra curl steps.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPending ? <p className="text-sm text-muted-foreground">Checking database…</p> : null}
        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not reach /api/ship-verify</AlertTitle>
            <AlertDescription className="text-xs">
              {error instanceof Error ? error.message : "Unknown error"}
            </AlertDescription>
          </Alert>
        ) : null}
        {data ? (
          <div className="space-y-2 text-sm" data-testid="ship-verify-panel">
            <p data-testid="ship-verify-status" className="flex items-center gap-2 font-medium">
              {data.ok ? (
                <>
                  <CheckCircle2 className="size-4 text-primary" aria-hidden />
                  All checks passed
                </>
              ) : (
                <>
                  <Circle className="size-4 text-destructive" aria-hidden />
                  Database check failed
                </>
              )}
            </p>
            <dl className="grid grid-cols-1 gap-2 text-muted-foreground sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Users rows
                </dt>
                <dd className="font-mono text-foreground">{data.database.usersRowCount}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Drizzle migrations (journal)
                </dt>
                <dd className="font-mono text-foreground">
                  {data.database.drizzleMigrationsCount ?? "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Checked at
                </dt>
                <dd className="font-mono text-xs text-foreground">{data.checkedAt}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function LocalVerificationReportCard({ report }: { report: LocalVerificationReport }) {
  const createdDate = report.createdAt ? new Date(report.createdAt) : null;
  const createdLabel =
    createdDate && !Number.isNaN(createdDate.getTime()) ? createdDate.toLocaleString() : undefined;

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base">{report.title}</CardTitle>
        <CardDescription>
          <code className="text-xs">verification/{report.id}/</code>
          {report.summary ? ` — ${report.summary}` : null}
          {createdLabel ? (
            <>
              {" "}
              <span className="text-muted-foreground">Created {createdLabel}</span>
            </>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {report.images.length > 0 ? (
          <ul className="grid list-none grid-cols-1 gap-3 sm:grid-cols-2">
            {report.images.map((image) => (
              <li key={image.path}>
                <figure className="overflow-hidden rounded-xl border border-border/80 bg-muted/20">
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="aspect-[16/10] w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="space-y-1 p-2.5">
                    <span className="block text-xs font-medium text-foreground">
                      {image.caption}
                    </span>
                    <code className="block break-all text-[0.7rem] text-muted-foreground">
                      {image.path}
                    </code>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}
        {report.artifacts.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {report.artifacts.map((artifact) => (
              <li
                key={artifact.path}
                className="rounded-lg border border-border/70 bg-muted/20 p-3"
              >
                <div className="font-medium text-foreground">{artifact.name}</div>
                <code className="break-all text-xs text-muted-foreground">{artifact.path}</code>
                {artifact.preview ? (
                  <pre className="mt-2 max-h-24 overflow-auto rounded bg-background/80 p-2 text-xs">
                    {artifact.preview}
                  </pre>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}

function LocalVerificationSection() {
  const [selectedReportId, setSelectedReportId] = React.useState(
    LOCAL_VERIFICATION_REPORTS[0]?.id ?? ""
  );
  const selectedReport =
    LOCAL_VERIFICATION_REPORTS.find((localReport) => localReport.id === selectedReportId) ??
    LOCAL_VERIFICATION_REPORTS[0];

  return (
    <section className="space-y-4" aria-labelledby="local-verification-heading">
      <div className="space-y-2">
        <h2 id="local-verification-heading" className="text-lg font-semibold tracking-tight">
          Local verification
        </h2>
        <p className="text-sm text-muted-foreground">
          Screenshots and notes are discovered from{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">verification/&lt;slug&gt;/</code>{" "}
          at dev/build time, so ignored local evidence can be reviewed in-app without committing
          PNGs. Add an optional{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">report.json</code> with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">title</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">summary</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">createdAt</code> to label and sort
          a run. Timestamped reports load newest first.
        </p>
      </div>
      {selectedReport ? (
        <div className="space-y-4" data-testid="local-verification-reports">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Verification folder
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full min-w-0 justify-between gap-2 sm:w-[min(100%,22rem)]"
                  aria-label="Select local verification folder"
                >
                  <span className="truncate">{selectedReport.title}</span>
                  <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[min(100vw-2rem,24rem)]">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Local verification folders
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedReport.id}
                  onValueChange={(value) => {
                    if (value) setSelectedReportId(value);
                  }}
                >
                  {LOCAL_VERIFICATION_REPORTS.map((localReport) => (
                    <DropdownMenuRadioItem
                      key={localReport.id}
                      value={localReport.id}
                      className="text-start"
                    >
                      {localReport.title}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <LocalVerificationReportCard report={selectedReport} />
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No local verification artifacts found. Capture screenshots under{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">verification/&lt;slug&gt;/</code>{" "}
            and reload this page to surface them here.
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export function ShipReportPage() {
  const [reportId, setReportId] = React.useState<string>(DEFAULT_SHIP_REPORT_ID);
  const [lightbox, setLightbox] = React.useState<LightboxState>(null);

  const report = reportById(reportId);
  const openGalleryImage = lightbox?.kind === "gallery" ? report.images[lightbox.index] : undefined;
  const openBranch =
    lightbox?.kind === "branch" ? { src: lightbox.src, caption: lightbox.caption } : undefined;
  const lightboxPayload =
    openGalleryImage !== undefined
      ? {
          src: openGalleryImage.src,
          alt: openGalleryImage.alt,
          caption: openGalleryImage.caption,
        }
      : openBranch !== undefined
        ? {
            src: openBranch.src,
            alt: openBranch.caption,
            caption: openBranch.caption,
          }
        : null;
  const lightboxOpen = lightboxPayload !== null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Ship report
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Pick a ship run, read what was built, open screenshots in a lightbox, and use{" "}
          <strong className="font-medium text-foreground">Open in Cursor</strong> /{" "}
          <strong className="font-medium text-foreground">Open in Claude</strong> to reprompt the
          same angle with full context. Deeplinks pre-fill a message; you still review before
          sending.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Current report
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full min-w-0 justify-between gap-2 sm:w-[min(100%,20rem)]"
                aria-label="Select ship report"
              >
                <span className="truncate">{report.menuLabel}</span>
                <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[min(100vw-2rem,22rem)]">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Shipped work & evidence
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={reportId}
                onValueChange={(v) => {
                  if (v) {
                    setReportId(v);
                    setLightbox(null);
                  }
                }}
              >
                {SHIP_REPORTS.map((r) => (
                  <DropdownMenuRadioItem key={r.id} value={r.id} className="text-start">
                    {r.menuLabel}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ShipBackendVerifyCard />

      <LocalVerificationSection />

      <section
        className="space-y-4 rounded-2xl border border-border/80 bg-card/30 p-4 sm:p-6"
        aria-labelledby="ship-report-title"
      >
        <h2 id="ship-report-title" className="text-lg font-semibold tracking-tight sm:text-xl">
          {report.title}
        </h2>
        {report.prUrl ? (
          <p className="text-sm text-muted-foreground">
            <a
              href={report.prUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-2 hover:underline"
            >
              View pull request
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </p>
        ) : null}
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {report.summary.map((p, i) => (
            <p key={i} className="text-pretty text-foreground/90">
              {p.split(/(\*\*[^*]+\*\*)/g).map((chunk, chunkIdx) => {
                if (chunk.startsWith("**") && chunk.endsWith("**")) {
                  return (
                    <strong key={chunkIdx} className="font-medium text-foreground">
                      {chunk.slice(2, -2)}
                    </strong>
                  );
                }
                return chunk;
              })}
            </p>
          ))}
        </div>
      </section>

      {report.branchEvidence ? (
        <ShipBranchEvidenceSection
          evidence={report.branchEvidence}
          onOpenBranchImage={(src, caption) => setLightbox({ kind: "branch", src, caption })}
        />
      ) : null}

      {report.images.length > 0 ? (
        <section className="space-y-3" aria-labelledby="screenshot-heading">
          <h3 id="screenshot-heading" className="text-sm font-medium text-foreground">
            Screenshots
          </h3>
          <p className="text-sm text-muted-foreground">
            Click a thumb to open the lightbox (Esc or ✕ to close).
          </p>
          <ul className="grid list-none grid-cols-1 gap-3 sm:grid-cols-2">
            {report.images.map((img, i) => (
              <li key={img.src}>
                <button
                  type="button"
                  onClick={() => setLightbox({ kind: "gallery", index: i })}
                  aria-label={`Open full size: ${img.caption}`}
                  className={cn(
                    "group w-full overflow-hidden rounded-xl border border-border/80 bg-muted/20 text-left shadow-sm",
                    "transition hover:border-primary/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  <span className="relative block aspect-[16/10] w-full">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/25">
                      <span className="flex size-10 items-center justify-center rounded-full bg-background/95 opacity-0 shadow ring-1 ring-border/80 transition group-hover:opacity-100">
                        <Maximize2 className="size-5 text-foreground" aria-hidden />
                      </span>
                    </span>
                  </span>
                  <span className="block p-2.5 text-xs font-medium leading-snug text-foreground">
                    {img.caption}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Dialog
        open={lightboxOpen}
        onOpenChange={(o) => {
          if (!o) setLightbox(null);
        }}
      >
        <DialogContent
          overlayClassName="cursor-pointer bg-black/75 supports-backdrop-filter:backdrop-blur-sm"
          showCloseButton={false}
          className={cn(
            /* Keep default position: fixed (do not add "relative" — it overrides fixed and the panel scrolls in-document). */
            /* Override: grid + sm:max-w-sm so the panel can be nearly full screen with padding. */
            "!flex h-[min(100dvh-1.5rem,100vh-1.5rem)] w-[min(100vw-1.5rem,100%)] !max-w-[min(100vw-1.5rem,100%)]",
            "min-h-0 flex-col gap-0 overflow-hidden border-0 bg-zinc-950/40 p-3 shadow-none ring-0 sm:p-4 md:p-5",
            "cursor-pointer"
          )}
          onClick={(e) => {
            if ((e.target as HTMLElement | null)?.tagName === "IMG") return;
            setLightbox(null);
          }}
        >
          {lightboxPayload ? (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{lightboxPayload.caption}</DialogTitle>
                <DialogDescription>
                  Full-size screenshot. Use close control or Esc to leave.
                </DialogDescription>
              </DialogHeader>
              <DialogClose asChild>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  className="absolute top-2 right-2 z-20 size-9 cursor-pointer rounded-full border-0 bg-zinc-900/80 text-zinc-100 shadow-lg hover:bg-zinc-800 sm:top-3 sm:right-3"
                  aria-label="Close lightbox"
                >
                  <X className="size-4" />
                </Button>
              </DialogClose>
              <div className="flex min-h-0 w-full min-w-0 flex-1 items-center justify-center overflow-auto p-0.5">
                <img
                  src={lightboxPayload.src}
                  alt={lightboxPayload.alt}
                  className="h-auto max-h-full w-full max-w-full cursor-default object-contain object-center"
                />
              </div>
              <p className="shrink-0 pt-2 text-center text-sm text-zinc-200 sm:pt-3">
                {lightboxPayload.caption}
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {report.reprompts.length > 0 ? (
        <section className="space-y-3" aria-labelledby="reprompt-heading">
          <h3
            id="reprompt-heading"
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <Sparkles className="size-4 text-primary" aria-hidden />
            Reprompt angles
          </h3>
          <p className="text-sm text-muted-foreground">
            Each link opens a pre-filled message so you can iterate on a slice of the work without
            rewriting context. Cursor: use <span className="text-foreground">app</span> if the
            desktop client is installed; web works everywhere. Claude: opens claude.ai with the text
            in the composer.
          </p>
          <ul className="space-y-3">
            {report.reprompts.map((item) => {
              const c = buildCursorDeeplinks(item.prompt);
              const claude = buildClaudeNewChatLink(item.prompt);
              return (
                <li key={item.id}>
                  <Card className="border-border/80">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{item.label}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <blockquote className="rounded-lg border border-dashed border-border/80 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </blockquote>
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Button type="button" size="sm" variant="default" asChild>
                          <a href={c.web} target="_blank" rel="noreferrer" className="gap-1.5">
                            <MessageCircle className="size-3.5" aria-hidden />
                            Cursor (web)
                            <ExternalLink className="size-3" aria-hidden />
                          </a>
                        </Button>
                        <Button type="button" size="sm" variant="secondary" asChild>
                          <a href={c.app} className="gap-1.5">
                            Cursor (app)
                            <ExternalLink className="size-3" aria-hidden />
                          </a>
                        </Button>
                        <Button type="button" size="sm" variant="outline" asChild>
                          <a href={claude} target="_blank" rel="noreferrer" className="gap-1.5">
                            Claude
                            <ExternalLink className="size-3" aria-hidden />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <Accordion type="single" collapsible className="rounded-xl border border-border/60">
        <AccordionItem value="checklist" className="border-b-0 px-1">
          <AccordionTrigger className="px-3 py-3 text-sm font-medium hover:no-underline sm:px-4">
            <span className="flex items-center gap-2">
              <ListChecks className="size-4" aria-hidden />
              Shipping checklist (from CLAUDE.md)
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 px-3 pb-4 sm:px-4">
            <Alert>
              <ListChecks className="size-4" />
              <AlertTitle>Feature route</AlertTitle>
              <AlertDescription>
                This page lives at <code className="text-xs">/ship-report</code> — shell navigation
                and route wiring should keep working when you add ships.
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
                  <ListChecks className="size-5" aria-hidden />
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
                  <span className="text-muted-foreground">MCP scratch folder (gitignored):</span>
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    verification/&lt;branch-or-ticket&gt;/
                  </code>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Commit <strong className="font-medium text-foreground">before</strong> /{" "}
                  <strong className="font-medium text-foreground">after</strong> captures under{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    public/screenshots/&lt;slug&gt;/
                  </code>{" "}
                  and wire <code className="rounded bg-muted px-1">branchEvidence</code> in{" "}
                  <code className="rounded bg-muted px-1">shipReports.ts</code> (image-only; use the
                  PR for code diff). Gallery-only shots still use{" "}
                  <code className="rounded bg-muted px-1">public/ship-reports/…</code> +{" "}
                  <code className="rounded bg-muted px-1">images[]</code>.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Network className="size-5" aria-hidden />
                  <CardTitle>PR blurb (paste into description)</CardTitle>
                </div>
                <CardDescription>Template — replace italic placeholders.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-3 text-xs leading-relaxed">
                  {`## Summary
_What changed_

## Routes / URLs
- /ship-report
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/users" className="font-medium text-primary underline-offset-2 hover:underline">
          Open Users
        </Link>{" "}
        for a quick API + MSW smoke test after changes.
      </p>
    </div>
  );
}
