import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, LayoutGrid, MoreHorizontal, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const kpi = [
  { label: "Active projects", value: "24", delta: "+12% vs last week", positive: true },
  { label: "Tasks completed", value: "1,204", delta: "+4%", positive: true },
  { label: "Avg. response (h)", value: "2.4", delta: "−0.3h", positive: true },
  { label: "Open issues", value: "7", delta: "+2 new", positive: false },
] as const;

const chartData = [
  { week: "W1", throughput: 42 },
  { week: "W2", throughput: 38 },
  { week: "W3", throughput: 55 },
  { week: "W4", throughput: 48 },
  { week: "W5", throughput: 61 },
  { week: "W6", throughput: 57 },
];

const chartConfig = {
  throughput: { label: "Throughput", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const team = [
  { name: "Asha Chen", role: "Engineering", done: 92 },
  { name: "Marcus I.", role: "Design", done: 78 },
  { name: "Nina P.", role: "Product", done: 65 },
];

export function DashboardDemoPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard demo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sample layout using cards, charts, tabs, and a data table. Not wired to real metrics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="gap-1.5" size="sm">
            <Link to="/components-demo">
              <LayoutGrid className="size-4" aria-hidden />
              Component library
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpi.map((k) => (
          <Card key={k.label}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle>
              <span
                className={cn(
                  "text-xs font-medium",
                  k.positive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                )}
              >
                {k.delta}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>Weekly throughput</CardTitle>
                <CardDescription>Bar chart on the shared chart primitives</CardDescription>
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className={cn("size-8", "hover:bg-gray-200/90 dark:hover:bg-gray-700")}
                aria-label="More"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full min-w-0">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} tickMargin={8} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="throughput" fill="var(--color-throughput)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health</CardTitle>
            <CardDescription>Indicative progress (mock)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deployment pipeline</span>
                <span className="text-muted-foreground">88%</span>
              </div>
              <Progress value={88} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test coverage</span>
                <span className="text-muted-foreground">72%</span>
              </div>
              <Progress value={72} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Docs freshness</span>
                <span className="text-muted-foreground">54%</span>
              </div>
              <Progress value={54} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team overview</CardTitle>
          <CardDescription>
            Sortable, filterable UIs are composed from the same table + tabs you see here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="size-4" aria-hidden />
                Last updated just now
              </div>
            </div>
            <TabsContent value="table" className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Tasks done</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8">
                            <AvatarFallback>
                              {m.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{m.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{m.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{m.done}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              className={cn(
                                "size-8",
                                "hover:bg-gray-200/90 dark:hover:bg-gray-700"
                              )}
                              aria-label="Row actions"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Assign</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="cards" className="grid gap-3 sm:grid-cols-2">
              {team.map((m) => (
                <div
                  key={m.name}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.role}</p>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">{m.done} done</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          Need every control in isolation?
          <Link
            to="/components-demo"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Open the full component library
            <ArrowUpRight className="inline size-3.5" aria-hidden />
          </Link>
        </span>
      </p>
    </div>
  );
}
