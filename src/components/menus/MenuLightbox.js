"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export default function MenuLightbox({ image, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#2c2a26]/82"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed top-4 right-4 z-[2] flex h-12 w-12 items-center justify-center rounded-full bg-[#2c2a26]/70 text-[2rem] leading-none text-ivory hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        ×
      </button>

      <div className="flex min-h-full items-start justify-center px-3 py-16 sm:px-8 sm:py-12">
        <figure
          onClick={(event) => event.stopPropagation()}
          className="w-[min(92vw,44rem)] max-w-[90vw] border border-gold/25 bg-[#f6f0e2] p-2 sm:p-2.5"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            quality={90}
            sizes="90vw"
            className="h-auto w-full object-contain"
          />
        </figure>
      </div>
    </div>,
    document.body,
  );
}
