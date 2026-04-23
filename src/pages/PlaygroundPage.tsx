import { ArrowRight, Layers } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PlaygroundSortable } from "@/components/PlaygroundSortable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaygroundPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
        <p className="text-sm text-muted-foreground">
          Reserved for experiments — drag-and-drop, charts, and UI spikes.
        </p>
      </div>
      <PlaygroundSortable />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="size-5" aria-hidden />
              <CardTitle>Component library</CardTitle>
            </div>
            <CardDescription>All shadcn components are in the project — compose here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use this route to build demos without touching production flows.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>Users CRUD lives on another route.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/users">
                Go to Users
                <ArrowRight className="ms-1 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
