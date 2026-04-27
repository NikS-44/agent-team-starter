import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import * as React from "react";

export type LightboxSlide = { src: string; alt: string; caption: string };

export type LightboxState = { slides: LightboxSlide[]; index: number } | null;

export function useShipReportLightbox() {
  const [lightbox, setLightbox] = React.useState<LightboxState>(null);

  const lightboxSlide =
    lightbox && lightbox.slides.length > 0
      ? lightbox.slides[Math.min(lightbox.index, lightbox.slides.length - 1)]
      : null;

  const lightboxOpen = lightboxSlide !== null;
  const canPrev = lightbox !== null && lightbox.index > 0;
  const canNext = lightbox !== null && lightbox.index < lightbox.slides.length - 1;

  const goPrev = React.useCallback(() => {
    setLightbox((prev) => (prev && prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev));
  }, []);

  const goNext = React.useCallback(() => {
    setLightbox((prev) =>
      prev && prev.index < prev.slides.length - 1 ? { ...prev, index: prev.index + 1 } : prev
    );
  }, []);

  React.useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, lightboxOpen]);

  return {
    lightbox,
    setLightbox,
    lightboxSlide,
    lightboxOpen,
    canPrev,
    canNext,
    goPrev,
    goNext,
  };
}

type ShipReportImageLightboxProps = {
  lightbox: LightboxState;
  lightboxSlide: LightboxSlide | null;
  lightboxOpen: boolean;
  canPrev: boolean;
  canNext: boolean;
  goPrev: () => void;
  goNext: () => void;
  onDismiss: () => void;
};

export function ShipReportImageLightbox({
  lightbox,
  lightboxSlide,
  lightboxOpen,
  canPrev,
  canNext,
  goPrev,
  goNext,
  onDismiss,
}: ShipReportImageLightboxProps) {
  return (
    <Dialog
      open={lightboxOpen}
      onOpenChange={(o) => {
        if (!o) onDismiss();
      }}
    >
      <DialogContent
        overlayClassName="cursor-pointer bg-black/75 supports-backdrop-filter:backdrop-blur-sm"
        showCloseButton={false}
        className={cn(
          "!flex h-[min(100dvh-1.5rem,100vh-1.5rem)] w-[min(100vw-1.5rem,100%)]",
          // DialogContent defaults include sm:max-w-sm; override on sm+ so the image can use the viewport.
          "!max-w-[min(100vw-1.5rem,100%)] sm:!max-w-[min(100vw-1.5rem,100%)]",
          "min-h-0 flex-col gap-0 overflow-hidden border-0 bg-zinc-950/40 p-3 shadow-none ring-0 sm:p-4 md:p-5",
          "cursor-pointer"
        )}
        onClick={(e) => {
          if ((e.target as HTMLElement | null)?.tagName === "IMG") return;
          const el = e.target as HTMLElement | null;
          if (el?.closest?.("[data-lightbox-control]")) return;
          onDismiss();
        }}
      >
        {lightboxSlide && lightbox ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>{lightboxSlide.caption}</DialogTitle>
              <DialogDescription>
                Full-size screenshot. Arrow keys or on-screen controls to move between images; Esc
                or backdrop click to close.
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="secondary"
                data-lightbox-control
                className="absolute top-2 right-2 z-20 size-9 cursor-pointer rounded-full border-0 bg-zinc-900/80 text-zinc-100 shadow-lg hover:bg-zinc-800 sm:top-3 sm:right-3"
                aria-label="Close lightbox"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
            {lightbox.slides.length > 1 ? (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  data-lightbox-control
                  disabled={!canPrev}
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute top-1/2 left-2 z-20 size-10 -translate-y-1/2 rounded-full border-0 bg-zinc-900/80 text-zinc-100 shadow-lg hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-30 sm:left-3"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  data-lightbox-control
                  disabled={!canNext}
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute top-1/2 right-2 z-20 size-10 -translate-y-1/2 rounded-full border-0 bg-zinc-900/80 text-zinc-100 shadow-lg hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-30 sm:right-3"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </>
            ) : null}
            <div className="flex min-h-0 w-full min-w-0 flex-1 items-center justify-center overflow-hidden p-0.5">
              <img
                src={lightboxSlide.src}
                alt={lightboxSlide.alt}
                className="h-full w-full min-h-0 min-w-0 cursor-default object-contain object-center"
              />
            </div>
            <p className="shrink-0 pt-2 text-center text-sm text-zinc-200 sm:pt-3">
              {lightbox.slides.length > 1 ? (
                <span className="text-zinc-400">
                  {lightbox.index + 1} / {lightbox.slides.length}
                  {" · "}
                </span>
              ) : null}
              {lightboxSlide.caption}
            </p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
