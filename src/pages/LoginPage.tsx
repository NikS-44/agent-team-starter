import { useAuthSession, useLogin, useLogout } from "@/api/auth";
import { LoginBodySchema } from "@/api/auth.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type FormEvent, useEffect, useRef, useState } from "react";

type FieldErrors = Partial<Record<"name" | "email", string>>;

function firstFieldErrors(errors: ReturnType<typeof LoginBodySchema.safeParse>): FieldErrors {
  if (errors.success) return {};
  const flattened = errors.error.flatten().fieldErrors;
  return {
    name: flattened.name?.[0],
    email: flattened.email?.[0],
  };
}

export function LoginPage() {
  const { data: session, isPending: isSessionPending, isError: isSessionError } = useAuthSession();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [focusSummaryAfterLogin, setFocusSummaryAfterLogin] = useState(false);
  const [focusNameAfterLogout, setFocusNameAfterLogout] = useState(false);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session && focusSummaryAfterLogin) {
      summaryRef.current?.focus();
      setFocusSummaryAfterLogin(false);
    }
  }, [focusSummaryAfterLogin, session]);

  useEffect(() => {
    if (!session && focusNameAfterLogout && !isSessionPending) {
      nameRef.current?.focus();
      setFocusNameAfterLogout(false);
    }
  }, [focusNameAfterLogout, isSessionPending, session]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.reset();
    const parsed = LoginBodySchema.safeParse({ name, email });
    if (!parsed.success) {
      setFieldErrors(firstFieldErrors(parsed));
      return;
    }

    setFieldErrors({});
    try {
      await loginMutation.mutateAsync(parsed.data);
      setFocusSummaryAfterLogin(true);
    } catch {
      // TanStack Query stores the error for rendering below.
    }
  }

  async function onLogout() {
    try {
      await logoutMutation.mutateAsync();
      setName("");
      setEmail("");
      setFocusNameAfterLogout(true);
    } catch {
      // The mutation state owns logout error handling.
    }
  }

  if (isSessionPending) {
    return <p className="text-sm text-muted-foreground">Checking sign-in status...</p>;
  }

  if (isSessionError) {
    return (
      <div role="alert" className="rounded-md border border-destructive/40 p-4 text-destructive">
        Could not load sign-in status.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      {session ? (
        <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h1 ref={summaryRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight">
            Signed in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {session.name}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="font-medium">Name</dt>
              <dd>{session.name}</dd>
            </div>
            <div>
              <dt className="font-medium">Email</dt>
              <dd>{session.email}</dd>
            </div>
          </dl>
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => {
              void onLogout();
            }}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Log out"}
          </Button>
        </section>
      ) : (
        <form
          noValidate
          aria-label="Sign in"
          className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
          onSubmit={(event) => {
            void onSubmit(event);
          }}
        >
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Store your name and email in the local SQLite database.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="login-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                ref={nameRef}
                id="login-name"
                name="name"
                autoComplete="name"
                value={name}
                aria-invalid={fieldErrors.name ? true : undefined}
                aria-describedby={fieldErrors.name ? "login-name-error" : undefined}
                onChange={(event) => setName(event.target.value)}
              />
              {fieldErrors.name ? (
                <p id="login-name-error" className="mt-1 text-sm text-destructive">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="login-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="login-email"
                name="email"
                type="text"
                inputMode="email"
                autoComplete="email"
                value={email}
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
              {fieldErrors.email ? (
                <p id="login-email-error" className="mt-1 text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>
          </div>
          {loginMutation.isError ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              Could not sign in:{" "}
              {loginMutation.error instanceof Error ? loginMutation.error.message : "Unknown error"}
            </p>
          ) : null}
          <Button type="submit" className="mt-6" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      )}
    </div>
  );
}
