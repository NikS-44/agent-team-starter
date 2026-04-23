import type { User } from "@/api/users";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { SortableListDemo } from "@/components/SortableListDemo";
import { UserCard } from "@/components/UserCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DirectionProvider } from "@/components/ui/direction";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  CalendarIcon,
  Check,
  ChevronRight,
  FileIcon,
  FolderIcon,
  LayoutGrid,
  Mail,
  Search,
  Settings,
} from "lucide-react";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const SECTIONS = [
  { id: "buttons", label: "Buttons" },
  { id: "data-display", label: "Data & display" },
  { id: "forms", label: "Forms" },
  { id: "feedback", label: "Feedback" },
  { id: "overlays", label: "Overlays" },
  { id: "navigation", label: "Navigation" },
  { id: "layout", label: "Layout" },
  { id: "sortable", label: "Sortable" },
  { id: "app", label: "App components" },
] as const;

const chartData = [
  { month: "Jan", total: 186 },
  { month: "Feb", total: 305 },
  { month: "Mar", total: 237 },
  { month: "Apr", total: 273 },
  { month: "May", total: 209 },
  { month: "Jun", total: 214 },
];

const chartConfig = {
  total: { label: "Total", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

/** Base UI filters the `items` array by `label` for `{ value, label }` shapes. Static `<ComboboxItem>`s without `items` only match the raw `value` (e.g. "sf"), so typing a city name never filtered. */
const COMBO_CITY_ITEMS: { value: string; label: string }[] = [
  { value: "sf", label: "San Francisco" },
  { value: "nyc", label: "New York" },
  { value: "lon", label: "London" },
  { value: "tky", label: "Tokyo" },
];

const demoUser: User = {
  id: "00000000-0000-4000-8000-000000000099",
  name: "Component Demo",
  email: "components@example.com",
  role: "member",
};

function DemoSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-4", className)}>
      <header className="space-y-1.5 border-b border-border/60 pb-3">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="rounded-xl border border-border/70 bg-background/80 p-4 shadow-sm sm:p-5 md:p-6">
        {children}
      </div>
    </section>
  );
}

export function AllComponentsShowcase() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [otp, setOtp] = React.useState("");
  const [slider, setSlider] = React.useState([50]);
  const [comboboxValue, setComboboxValue] = React.useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = React.useState("");

  const filteredSections = React.useMemo(() => {
    const q = sectionFilter.trim().toLowerCase();
    if (!q) return [...SECTIONS];
    return SECTIONS.filter(
      (s) => s.label.toLowerCase().includes(q) || s.id.replace(/-/g, " ").includes(q)
    );
  }, [sectionFilter]);

  return (
    <div className="space-y-10 md:space-y-12">
      <nav
        aria-label="On this page"
        className="sticky top-0 z-10 -mx-1 space-y-3 border-b border-border/80 bg-background/95 pb-4 pt-1 backdrop-blur supports-backdrop-filter:bg-background/80 md:-mx-2 md:px-1"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Jump to section</p>
            <p className="text-xs text-muted-foreground">Filter links, then click to scroll</p>
          </div>
          <div className="relative w-full min-w-0 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="component-library-section-filter"
              type="search"
              placeholder="Filter sections…"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="h-9 ps-9"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex min-h-9 flex-wrap gap-1.5">
          {filteredSections.length > 0 ? (
            filteredSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted"
              >
                {s.label}
              </a>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No sections match.{" "}
              <button
                type="button"
                className="font-medium text-primary underline-offset-2 hover:underline"
                onClick={() => setSectionFilter("")}
              >
                Clear filter
              </button>
            </p>
          )}
        </div>
      </nav>

      <DemoSection
        id="buttons"
        title="Buttons & groups"
        description="Button variants, icon buttons, and grouped actions."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button">Default</Button>
            <Button type="button" variant="secondary">
              Secondary
            </Button>
            <Button type="button" variant="outline">
              Outline
            </Button>
            <Button type="button" variant="ghost">
              Ghost
            </Button>
            <Button type="button" variant="link">
              Link
            </Button>
            <Button type="button" variant="destructive">
              Destructive
            </Button>
            <Button type="button" size="icon" aria-label="Settings">
              <Settings className="size-4" />
            </Button>
          </div>
          <ButtonGroup>
            <Button type="button" variant="outline" size="sm">
              Left
            </Button>
            <Button type="button" variant="outline" size="sm">
              Center
            </Button>
            <Button type="button" variant="outline" size="sm">
              Right
            </Button>
          </ButtonGroup>
          <div className="flex flex-wrap gap-2">
            <Toggle aria-label="Toggle bold" type="button" variant="outline" size="sm" pressed>
              B
            </Toggle>
            <ToggleGroup type="single" defaultValue="left" size="sm" variant="outline">
              <ToggleGroupItem value="left" aria-label="Left aligned">
                Left
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Center aligned">
                Center
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right aligned">
                Right
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </DemoSection>

      <Separator />

      <DemoSection
        id="data-display"
        title="Data & display"
        description="Present content, state, and lightweight visualization."
      >
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" alt="Demo" />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">Avatar, badge, and kbd: Save</div>
            <KbdGroup>
              <Kbd>⌘</Kbd>+<Kbd>S</Kbd>
            </KbdGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card</CardTitle>
                <CardDescription>With footer actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Card content area.</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button type="button" size="sm" variant="secondary">
                  Cancel
                </Button>
                <Button type="button" size="sm">
                  Continue
                </Button>
              </CardFooter>
            </Card>
            <div className="space-y-2">
              <p className="text-sm font-medium">Aspect ratio 16/9</p>
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border bg-muted">
                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                  Media
                </div>
              </AspectRatio>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Skeleton</p>
            <div className="flex items-center space-x-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Progress</p>
            <Progress value={66} className="w-full max-w-sm" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Table</p>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableCaption>Sample data</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Alpha</TableCell>
                    <TableCell>
                      <Badge variant="outline">ok</Badge>
                    </TableCell>
                    <TableCell className="text-right">42</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Beta</TableCell>
                    <TableCell>
                      <Badge variant="secondary">sync</Badge>
                    </TableCell>
                    <TableCell className="text-right">18</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Chart</p>
            <ChartContainer config={chartConfig} className="h-48 w-full min-w-0 sm:max-w-md">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>

          <Empty className="min-h-32">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileIcon className="text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No files</EmptyTitle>
              <EmptyDescription>Empty state copy for null results.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type="button" size="sm" variant="outline">
                Add file
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </DemoSection>

      <Separator />

      <DemoSection
        id="forms"
        title="Forms & input"
        description="Text fields, choice controls, and composite inputs."
      >
        <div className="space-y-8">
          <FieldSet className="space-y-4">
            <FieldLegend variant="label">Field set</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" autoComplete="off" placeholder="you@example.com" />
                <FieldDescription>We will never share your email.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Notes</FieldLabel>
                <Textarea rows={2} placeholder="Short note…" />
              </Field>
            </FieldGroup>
            <FieldSeparator>Or</FieldSeparator>
            <Field>
              <FieldLabel>Legacy field error</FieldLabel>
              <Input defaultValue="bad" aria-invalid className="border-destructive" />
              <FieldError>Sample validation message</FieldError>
            </Field>
          </FieldSet>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-input-group">Input group</Label>
              <InputGroup>
                <InputGroupAddon>
                  <Search className="size-4" aria-hidden />
                </InputGroupAddon>
                <InputGroupInput id="demo-input-group" placeholder="Search…" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>12 results</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Native select</p>
              <NativeSelect defaultValue="a">
                <NativeSelectOption value="a">Option A</NativeSelectOption>
                <NativeSelectOption value="b">Option B</NativeSelectOption>
                <NativeSelectOptGroup label="Group">
                  <NativeSelectOption value="c">Option C</NativeSelectOption>
                </NativeSelectOptGroup>
              </NativeSelect>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Select (Radix)</p>
            <Select defaultValue="m1">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m1">Light</SelectItem>
                <SelectItem value="m2">Dark</SelectItem>
                <SelectItem value="m3">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Combobox</p>
            <Combobox
              value={comboboxValue}
              onValueChange={setComboboxValue}
              items={COMBO_CITY_ITEMS}
              autoHighlight
            >
              <ComboboxInput
                placeholder="Type to filter by city name…"
                showClear
                className="w-72"
              />
              <ComboboxContent>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item.value}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
                <ComboboxEmpty>No matching city.</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="c1" defaultChecked />
              <Label htmlFor="c1">Checkbox</Label>
            </div>
            <div className="space-y-2">
              <Label>Radio</Label>
              <RadioGroup defaultValue="a" className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="a" id="r1" />
                  <Label htmlFor="r1">A</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="b" id="r2" />
                  <Label htmlFor="r2">B</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="sw" />
              <Label htmlFor="sw">Switch</Label>
            </div>
            <div className="w-48 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Slider</span>
                <span className="text-muted-foreground">{slider[0]}</span>
              </div>
              <Slider value={slider} onValueChange={setSlider} max={100} step={1} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">One-time code</p>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Calendar</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
              />
              <p className="text-sm text-muted-foreground">
                Selected: {date?.toDateString() ?? "none"}
              </p>
            </div>
          </div>
        </div>
      </DemoSection>

      <Separator />

      <DemoSection
        id="feedback"
        title="Feedback"
        description="Inline alerts, modals, and asynchronous indicators."
      >
        <div className="space-y-4">
          <Alert>
            <Mail className="size-4" />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>Default alert for lightweight messaging.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Destructive</AlertTitle>
            <AlertDescription>Something may need your attention.</AlertDescription>
          </Alert>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              Loading
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  Open alert dialog
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>This only dismisses the dialog.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <AlertDialogAction type="button">Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                toast("Event created", {
                  description: "Sonner toasts are wired in the app shell.",
                });
              }}
            >
              Show toast
            </Button>
          </div>
        </div>
      </DemoSection>

      <Separator />

      <DemoSection
        id="overlays"
        title="Overlays & disclosure"
        description="Stacked UI and progressive disclosure."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  Dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog</DialogTitle>
                  <DialogDescription>Modal content goes here.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" size="sm">
                    OK
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  Sheet
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet</SheetTitle>
                  <SheetDescription>Side panel pattern.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <Drawer>
              <DrawerTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  Drawer
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer</DrawerTitle>
                  <DrawerDescription>Great on small viewports.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button type="button" variant="outline" size="sm">
                      Close
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  Popover
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 text-sm" align="start">
                Popover content with form-like density.
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="sm">
                  Tooltip
                </Button>
              </TooltipTrigger>
              <TooltipContent>Helper text on focus/hover</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button type="button" variant="link" size="sm" className="h-auto p-0">
                  Hover card
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 text-sm">
                Preview for profiles or inline docs.
              </HoverCardContent>
            </HoverCard>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="flex h-20 w-40 items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                  Right-click here
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>
                  <FolderIcon className="size-4" />
                  Open
                </ContextMenuItem>
                <ContextMenuItem disabled>Disabled</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Command palette (inline surface)</p>
            <Command className="max-w-lg border shadow-sm">
              <CommandInput placeholder="Type a command…" />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>
                    <CalendarIcon className="size-4" />
                    Calendar
                  </CommandItem>
                  <CommandItem>
                    <Activity className="size-4" />
                    Status
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Files">
                  <CommandItem>
                    <FileIcon className="size-4" />
                    README.md
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <Accordion type="single" collapsible className="w-full max-w-lg border-b">
            <AccordionItem value="a">
              <AccordionTrigger>Accordion item one</AccordionTrigger>
              <AccordionContent>Content for the first item.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Accordion item two</AccordionTrigger>
              <AccordionContent>Content for the second item.</AccordionContent>
            </AccordionItem>
          </Accordion>

          <Collapsible className="w-full max-w-lg space-y-2">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">Collapsible</p>
              <CollapsibleTrigger asChild>
                <Button type="button" size="sm" variant="ghost">
                  Toggle
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="rounded-lg border p-3 text-sm text-muted-foreground">
              Extra information appears here when opened.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DemoSection>

      <Separator />

      <DemoSection
        id="navigation"
        title="Navigation & menus"
        description="Breadcrumbs, tab strips, and menu surfaces."
      >
        <div className="space-y-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components-demo">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Demo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Tabs defaultValue="t1" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="t1">First</TabsTrigger>
              <TabsTrigger value="t2">Second</TabsTrigger>
            </TabsList>
            <TabsContent value="t1" className="text-sm text-muted-foreground">
              First panel content.
            </TabsContent>
            <TabsContent value="t2" className="text-sm text-muted-foreground">
              Second panel content.
            </TabsContent>
          </Tabs>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="space-y-2">
            <p className="text-sm font-medium">Menubar</p>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New
                    <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>Open</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Quit</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Copy</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Navigation menu (viewport off)</p>
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-56 gap-1 p-2">
                      <li>
                        <NavigationMenuLink
                          className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none hover:bg-muted"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          <div className="font-medium">Features</div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">Sub copy.</p>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="inline-flex h-9 w-max items-center rounded-lg px-2.5 py-1.5 text-sm font-medium hover:bg-muted"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Docs
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Dropdown menu</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" aria-label="Open menu">
                  <LayoutGrid className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel inset>Role</DropdownMenuLabel>
                <DropdownMenuRadioGroup value="a">
                  <DropdownMenuRadioItem value="a">Member</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="b">Admin</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DemoSection>

      <Separator />

      <DemoSection
        id="layout"
        title="Layout & motion"
        description="Resizable areas, scroll regions, carousel, and text direction."
      >
        <div className="space-y-8">
          <ItemGroup>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <Check className="text-primary" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Item list pattern</ItemTitle>
                <ItemDescription>Group related rows for feeds or pickers.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button type="button" size="icon-sm" variant="ghost" aria-label="Open">
                  <ChevronRight className="size-4" />
                </Button>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Muted row</ItemTitle>
                <ItemDescription>Smaller list density.</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>

          <DirectionProvider dir="rtl">
            <p className="max-w-md rounded-lg border p-3 text-end text-sm">
              RTL preview — DirectionProvider + logical CSS.
            </p>
          </DirectionProvider>

          <div>
            <p className="mb-2 text-sm font-medium">Resizable</p>
            <ResizablePanelGroup
              orientation="horizontal"
              className="min-h-28 max-w-xl rounded-lg border"
            >
              <ResizablePanel
                defaultSize={40}
                className="flex items-center justify-center p-2 text-sm"
              >
                A
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={60}
                className="flex items-center justify-center p-2 text-sm"
              >
                B
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Scroll area</p>
            <ScrollArea className="h-32 max-w-sm rounded-md border p-2">
              <p className="pr-2 text-sm leading-relaxed text-muted-foreground">
                {Array.from({ length: 12 })
                  .map((_, i) => `Line ${i + 1} — long scrollable copy for the scroll area demo. `)
                  .join("")}
              </p>
            </ScrollArea>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Carousel</p>
            <div className="px-8">
              <Carousel className="max-w-sm">
                <CarouselContent>
                  {["One", "Two", "Three"].map((s) => (
                    <CarouselItem key={s}>
                      <div className="flex h-32 items-center justify-center rounded-lg border bg-muted p-2 text-sm">
                        Slide {s}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious type="button" />
                <CarouselNext type="button" />
              </Carousel>
            </div>
          </div>
        </div>
      </DemoSection>

      <Separator />

      <DemoSection
        id="sortable"
        title="Sortable list"
        description="Vertical reorder with pointer and keyboard. Built with @dnd-kit/sortable alongside shadcn-styled rows."
      >
        <div className="max-w-md space-y-3">
          <p className="text-sm text-muted-foreground">
            Drag the grip to reorder. Same pattern as list boards and priority queues.
          </p>
          <SortableListDemo />
        </div>
      </DemoSection>

      <Separator />

      <DemoSection
        id="app"
        title="App components"
        description="Reusable app-level building blocks. Sidebar chrome lives in the shell."
      >
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            The app navigation uses the same{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Sidebar</code> family as the
            left rail. For drag-and-play experiments, use{" "}
            <a className="font-medium text-primary underline underline-offset-2" href="/playground">
              Playground
            </a>
            .
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Loading skeleton (list row)</p>
            <LoadingSkeleton />
          </div>
          <div className="max-w-md space-y-2">
            <p className="text-sm font-medium">User card (MSW in dev)</p>
            <UserCard user={demoUser} />
          </div>
        </div>
      </DemoSection>

      <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
        <p className="text-sm text-muted-foreground">End of the component library tour.</p>
        <a
          href="#component-showcase-start"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
        >
          <ArrowUp className="size-4" aria-hidden />
          Back to intro
        </a>
      </div>
    </div>
  );
}
