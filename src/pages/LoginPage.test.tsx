import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { useUiStore } from "../store/uiStore";
import { renderWithRouter } from "../test/utils";

describe("LoginPage", () => {
  beforeEach(() => {
    useUiStore.setState({ darkMode: false });
  });

  it("renders the logged-out form at /login", async () => {
    renderWithRouter({ initialPath: "/login" });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument()
    );
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
  });

  it("shows loading and error states for the current session request", async () => {
    server.use(
      http.get("/api/auth", async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithRouter({ initialPath: "/login" });

    expect(await screen.findByText(/checking sign-in status/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/could not load sign-in status/i)
    );
  });

  it("shows validation errors for an empty name and invalid email", async () => {
    const user = userEvent.setup();
    renderWithRouter({ initialPath: "/login" });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument()
    );
    await user.type(screen.getByLabelText(/^email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("submits with the Enter key and trims whitespace-only names as invalid", async () => {
    const user = userEvent.setup();
    renderWithRouter({ initialPath: "/login" });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument()
    );
    await user.type(screen.getByLabelText(/^name/i), "   ");
    await user.type(screen.getByLabelText(/^email/i), "space@example.com{Enter}");

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  it("disables the submit button while login is pending", async () => {
    const user = userEvent.setup();
    let session: { name: string; email: string } | null = null;
    server.use(
      http.get("/api/auth", () => HttpResponse.json(session)),
      http.post("/api/auth", async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        session = { name: "Slow Login", email: "slow@example.com" };
        return HttpResponse.json(session);
      })
    );
    renderWithRouter({ initialPath: "/login" });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument()
    );
    await user.type(screen.getByLabelText(/^name/i), "Slow Login");
    await user.type(screen.getByLabelText(/^email/i), "slow@example.com");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
    expect(await screen.findByRole("heading", { name: /signed in/i })).toBeInTheDocument();
  });

  it("shows an alert when login fails", async () => {
    const user = userEvent.setup();
    server.use(http.post("/api/auth", () => new HttpResponse(null, { status: 500 })));
    renderWithRouter({ initialPath: "/login" });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument()
    );
    await user.type(screen.getByLabelText(/^name/i), "Server Error");
    await user.type(screen.getByLabelText(/^email/i), "server@example.com");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not sign in/i);
  });

  it("stores login details and focuses the signed-in summary", async () => {
    const user = userEvent.setup();
    renderWithRouter({ initialPath: "/login" });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument()
    );
    await user.type(screen.getByLabelText(/^name/i), "Margaret Hamilton");
    await user.type(screen.getByLabelText(/^email/i), "margaret@example.com");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    const summary = await screen.findByRole("heading", { name: /signed in/i });
    expect(summary).toHaveFocus();
    expect(screen.getByText("Margaret Hamilton")).toBeInTheDocument();
    expect(screen.getByText("margaret@example.com")).toBeInTheDocument();
    expect(screen.getByText(/signed in as margaret hamilton/i)).toBeInTheDocument();
  });

  it("logs out and returns focus to the name field", async () => {
    const user = userEvent.setup();
    renderWithRouter({ initialPath: "/login" });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument()
    );
    await user.type(screen.getByLabelText(/^name/i), "Barbara Liskov");
    await user.type(screen.getByLabelText(/^email/i), "barbara@example.com");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));
    await screen.findByRole("heading", { name: /signed in/i });

    await user.click(screen.getByRole("button", { name: /^log out$/i }));

    const nameField = await screen.findByLabelText(/^name/i);
    expect(nameField).toHaveFocus();
    expect(screen.queryByText("Barbara Liskov")).not.toBeInTheDocument();
  });
});
