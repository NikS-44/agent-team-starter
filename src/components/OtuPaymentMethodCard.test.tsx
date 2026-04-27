import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test/utils";
import { OtuPaymentMethodCard } from "./OtuPaymentMethodCard";

const pm = {
  id: "660e8400-e29b-41d4-a716-446655440001",
  userId: "550e8400-e29b-41d4-a716-446655440001",
  brand: "visa" as const,
  cardNumber: "4242424242424242",
  cvv: "123",
  label: "OTU — vendor checkout A",
  expMonth: 12,
  expYear: 2030,
};

describe("OtuPaymentMethodCard", () => {
  it("masks PAN, CVV, and expiry until Show", () => {
    renderWithProviders(
      <OtuPaymentMethodCard
        pm={pm}
        copiedId={null}
        onCopy={vi.fn<(id: string, cardNumber: string) => void>()}
      />
    );

    expect(screen.getByText("•••• •••• •••• ••••")).toBeInTheDocument();
    expect(screen.getByText("•••", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("••/••")).toBeInTheDocument();
    expect(screen.queryByText("4242 4242 4242 4242")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /copy card number/i })).not.toBeInTheDocument();
  });

  it("Show reveals values and Copy; Hide masks again", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn<(id: string, cardNumber: string) => void>();
    renderWithProviders(<OtuPaymentMethodCard pm={pm} copiedId={null} onCopy={onCopy} />);

    await user.click(screen.getByRole("button", { name: /^show$/i }));

    expect(screen.getByText("4242 4242 4242 4242")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("12/30")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /copy card number/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^hide$/i }));

    expect(screen.queryByText("4242 4242 4242 4242")).not.toBeInTheDocument();
    expect(screen.getByText("•••• •••• •••• ••••")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /copy card number/i })).not.toBeInTheDocument();
  });
});
