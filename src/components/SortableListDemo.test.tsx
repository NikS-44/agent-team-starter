import { renderWithProviders } from "@/test/utils";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SortableListDemo, reorderSortableDemoItems } from "./SortableListDemo";

describe("reorderSortableDemoItems", () => {
  const items = [
    { id: "1", label: "a" },
    { id: "2", label: "b" },
    { id: "3", label: "c" },
  ];

  it("returns the previous order when over is null", () => {
    expect(reorderSortableDemoItems(items, { active: { id: "1" }, over: null })).toBe(items);
  });

  it("returns the previous order when active equals over", () => {
    expect(reorderSortableDemoItems(items, { active: { id: "2" }, over: { id: "2" } })).toBe(items);
  });

  it("returns the previous order when an id is missing from the list", () => {
    expect(reorderSortableDemoItems(items, { active: { id: "x" }, over: { id: "1" } })).toEqual(
      items
    );
    expect(reorderSortableDemoItems(items, { active: { id: "1" }, over: { id: "x" } })).toEqual(
      items
    );
  });

  it("moves the active item before the over item", () => {
    const next = reorderSortableDemoItems(items, { active: { id: "3" }, over: { id: "1" } });
    expect(next.map((i) => i.id)).toEqual(["3", "1", "2"]);
  });
});

describe("SortableListDemo", () => {
  it("renders a labeled sortable task list", () => {
    renderWithProviders(<SortableListDemo />);
    expect(screen.getByRole("list", { name: /sortable task list/i })).toBeInTheDocument();
    expect(screen.getByText("Plan the feature")).toBeInTheDocument();
  });
});
