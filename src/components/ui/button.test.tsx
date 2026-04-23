import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("applies a pointer cursor for click affordance", () => {
    render(<Button type="button">Action</Button>);
    expect(screen.getByRole("button", { name: "Action" })).toHaveClass("cursor-pointer");
  });
});
