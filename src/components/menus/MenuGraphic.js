"use client";

import { useState } from "react";
import Image from "next/image";
import MenuLightbox from "@/components/menus/MenuLightbox";

const PREVIEW_SIZES = "(min-width: 1024px) 405px, 420px";

export default function MenuGraphic({ image, priority = false, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <figure className={`menu-preview-card ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View full size: ${image.alt}`}
          className="menu-preview-frame group"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes={PREVIEW_SIZES}
            className="menu-preview-image"
          />
        </button>
      </figure>
      {open ? (
        <MenuLightbox image={image} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
