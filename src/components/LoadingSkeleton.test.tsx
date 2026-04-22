import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSkeleton } from "./LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders exactly 3 skeleton items", () => {
    render(<LoadingSkeleton />);
    const items = screen.getAllByTestId("skeleton-item");
    expect(items).toHaveLength(3);
  });

  it("applies the animate-pulse class to each skeleton item", () => {
    render(<LoadingSkeleton />);
    const items = screen.getAllByTestId("skeleton-item");
    for (const item of items) {
      expect(item).toHaveClass("animate-pulse");
    }
  });
});
