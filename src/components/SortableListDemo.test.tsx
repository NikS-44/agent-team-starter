import { renderWithProviders } from "@/test/utils";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SortableListDemo } from "./SortableListDemo";

describe("SortableListDemo", () => {
  it("renders a labeled sortable task list", () => {
    renderWithProviders(<SortableListDemo />);
    expect(screen.getByRole("list", { name: /sortable task list/i })).toBeInTheDocument();
    expect(screen.getByText("Plan the feature")).toBeInTheDocument();
  });
});
