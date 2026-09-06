"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";

export default function MatchedStoryImage({ image }) {
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    const first = document.querySelector('[data-image-slot="about-story"]');
    const box = boxRef.current;
    if (!first || !box) return undefined;

    const apply = () => {
      const rect = first.getBoundingClientRect();
      box.style.width = `${rect.width}px`;
      box.style.height = `${rect.height}px`;
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(first);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      data-image-slot={image.slot}
      className="relative ml-auto aspect-[16/10] w-full overflow-hidden bg-[#d7cfb8] lg:aspect-auto"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 46vw, 100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
