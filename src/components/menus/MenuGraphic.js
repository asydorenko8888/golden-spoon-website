"use client";

import { useState } from "react";
import Image from "next/image";
import MenuLightbox from "@/components/menus/MenuLightbox";

const PREVIEW_SIZES = "(min-width: 1024px) 405px, 100vw";

export default function MenuGraphic({ image, priority = false, className = "" }) {
  const [open, setOpen] = useState(false);
  const ratio =
    image.width && image.height ? `${image.width} / ${image.height}` : undefined;

  return (
    <>
      <figure
        className={`menu-preview-card ${className}`}
        style={ratio ? { "--menu-image-ratio": ratio } : undefined}
      >
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
