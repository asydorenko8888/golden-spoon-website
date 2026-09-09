"use client";

import { useEffect, useRef } from "react";

export default function EventLightbox({ photos, index, onClose, onNavigate }) {
  const touchStartX = useRef(null);
  const closeRef = useRef(null);
  const photo = photos[index];
  const hasMultiple = photos.length > 1;

  useEffect(() => {
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (!hasMultiple) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onNavigate(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate(1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasMultiple, onClose, onNavigate]);

  function onTouchStart(event) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event) {
    if (touchStartX.current == null || !hasMultiple) return;

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 50) return;
    onNavigate(delta < 0 ? 1 : -1);
  }

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt_text || "Event photo"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/88 px-4 py-16 sm:px-12"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-[2] flex h-12 w-12 items-center justify-center bg-transparent text-[2.2rem] leading-none text-ivory sm:top-4 sm:right-5"
      >
        ×
      </button>

      {hasMultiple ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(-1);
          }}
          aria-label="Previous photo"
          className="absolute top-1/2 left-1 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-transparent text-[1.85rem] leading-none text-ivory sm:left-3 sm:h-14 sm:w-14 sm:text-[2.1rem]"
        >
          ←
        </button>
      ) : null}

      {hasMultiple ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(1);
          }}
          aria-label="Next photo"
          className="absolute top-1/2 right-1 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-transparent text-[1.85rem] leading-none text-ivory sm:right-3 sm:h-14 sm:w-14 sm:text-[2.1rem]"
        >
          →
        </button>
      ) : null}

      <img
        src={photo.image_url}
        alt={photo.alt_text}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative z-[1] max-h-[min(88vh,900px)] max-w-[min(92vw,1100px)] object-contain"
      />
    </div>
  );
}
