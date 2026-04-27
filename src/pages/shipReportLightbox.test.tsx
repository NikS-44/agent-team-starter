import { act, render, renderHook, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  type LightboxSlide,
  ShipReportImageLightbox,
  useShipReportLightbox,
} from "./shipReportLightbox";

const slides: LightboxSlide[] = [
  { src: "/a.png", alt: "A", caption: "First" },
  { src: "/b.png", alt: "B", caption: "Second" },
];

function pressKey(key: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("useShipReportLightbox", () => {
  it("starts closed with no slide", () => {
    const { result } = renderHook(() => useShipReportLightbox());
    expect(result.current.lightbox).toBeNull();
    expect(result.current.lightboxSlide).toBeNull();
    expect(result.current.lightboxOpen).toBe(false);
    expect(result.current.canPrev).toBe(false);
    expect(result.current.canNext).toBe(false);
  });

  it("clamps the index when it is past the last slide", () => {
    const { result } = renderHook(() => useShipReportLightbox());
    act(() => {
      result.current.setLightbox({ slides, index: 99 });
    });
    expect(result.current.lightboxSlide?.caption).toBe("Second");
  });

  it("goes to the previous and next slide when both exist", () => {
    const { result } = renderHook(() => useShipReportLightbox());
    act(() => {
      result.current.setLightbox({ slides, index: 1 });
    });
    expect(result.current.canPrev).toBe(true);
    expect(result.current.canNext).toBe(false);
    act(() => {
      result.current.goPrev();
    });
    expect(result.current.lightbox?.index).toBe(0);
    act(() => {
      result.current.goNext();
    });
    expect(result.current.lightbox?.index).toBe(1);
  });

  it("does not move past the first or last slide", () => {
    const { result } = renderHook(() => useShipReportLightbox());
    act(() => {
      result.current.setLightbox({ slides, index: 0 });
    });
    act(() => {
      result.current.goPrev();
    });
    expect(result.current.lightbox?.index).toBe(0);
    act(() => {
      result.current.goNext();
      result.current.goNext();
    });
    expect(result.current.lightbox?.index).toBe(1);
  });

  it("moves between slides with ArrowLeft and ArrowRight when open", () => {
    const { result } = renderHook(() => useShipReportLightbox());
    act(() => {
      result.current.setLightbox({ slides, index: 1 });
    });
    act(() => {
      pressKey("ArrowLeft");
    });
    expect(result.current.lightbox?.index).toBe(0);
    act(() => {
      pressKey("ArrowRight");
    });
    expect(result.current.lightbox?.index).toBe(1);
  });
});

describe("ShipReportImageLightbox", () => {
  it("renders nothing when there is no slide", () => {
    const noop = () => {};
    const { container } = render(
      <ShipReportImageLightbox
        lightbox={null}
        lightboxSlide={null}
        lightboxOpen={false}
        canPrev={false}
        canNext={false}
        goPrev={noop}
        goNext={noop}
        onDismiss={noop}
      />
    );
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it("opens the dialog, shows nav for multiple slides, and dismisses from the backdrop", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn<() => void>();
    render(
      <ShipReportImageLightbox
        lightbox={{ slides, index: 0 }}
        lightboxSlide={slides[0] ?? null}
        lightboxOpen
        canPrev={false}
        canNext
        goPrev={() => {}}
        goNext={() => {}}
        onDismiss={onDismiss}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next image/i })).toBeInTheDocument();
    await user.click(screen.getByRole("img", { name: "A" }));
    expect(onDismiss).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByText("First", { selector: "p" }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("invokes onDismiss from the close button", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn<() => void>();
    render(
      <ShipReportImageLightbox
        lightbox={{ slides, index: 0 }}
        lightboxSlide={slides[0] ?? null}
        lightboxOpen
        canPrev={false}
        canNext={false}
        goPrev={() => {}}
        goNext={() => {}}
        onDismiss={onDismiss}
      />
    );
    await user.click(screen.getByRole("button", { name: /close lightbox/i }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("omits prev/next controls for a single slide", () => {
    render(
      <ShipReportImageLightbox
        lightbox={{ slides: [slides[0]!], index: 0 }}
        lightboxSlide={slides[0] ?? null}
        lightboxOpen
        canPrev={false}
        canNext={false}
        goPrev={() => {}}
        goNext={() => {}}
        onDismiss={() => {}}
      />
    );
    expect(screen.queryByRole("button", { name: /previous image/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /next image/i })).not.toBeInTheDocument();
  });
});
