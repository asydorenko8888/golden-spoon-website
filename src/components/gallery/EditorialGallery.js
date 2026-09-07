"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";

const mobileItem = {
  "gallery-yacht-sunset": "max-md:order-1 max-md:col-span-2",
  "gallery-victoria": "max-md:order-2 max-md:col-span-1",
  "gallery-uzvar": "max-md:order-3 max-md:col-span-1",
  "gallery-baby-shower": "max-md:order-4 max-md:col-span-2",
  "gallery-promo": "max-md:order-5 max-md:col-span-1",
  "gallery-attendees": "max-md:order-6 max-md:col-span-1",
  "gallery-mannequins": "max-md:order-7 max-md:col-span-1",
  "gallery-yacht-portrait": "max-md:order-8 max-md:col-span-1",
  "gallery-grazing": "max-md:order-9 max-md:col-span-2",
};

const mobileFrame = {
  "gallery-yacht-sunset": "max-md:aspect-[16/10] max-md:h-auto",
  "gallery-victoria": "max-md:aspect-[4/5] max-md:h-auto",
  "gallery-uzvar": "max-md:aspect-[4/5] max-md:h-auto",
  "gallery-baby-shower": "max-md:aspect-[16/10] max-md:h-auto",
  "gallery-promo": "max-md:aspect-[4/5] max-md:h-auto",
  "gallery-attendees": "max-md:aspect-[4/5] max-md:h-auto",
  "gallery-mannequins": "max-md:aspect-[4/5] max-md:h-auto",
  "gallery-yacht-portrait": "max-md:aspect-[4/5] max-md:h-auto",
  "gallery-grazing": "max-md:aspect-[16/10] max-md:h-auto",
};

const mobileObject = {
  "gallery-victoria": "max-md:object-[center_top]",
  "gallery-promo": "max-md:object-center",
  "gallery-attendees": "max-md:object-[center_22%]",
  "gallery-yacht-portrait": "max-md:object-[center_18%]",
};

export default function EditorialGallery({ images }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (active === null) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") {
        setActive((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setActive((current) => (current - 1 + images.length) % images.length);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [active, images.length]);

  const current = active !== null ? images[active] : null;

  return (
    <section className="bg-ivory">
      <Container className="pt-7 pb-8 max-md:!px-4 lg:pt-7 lg:pb-9">
        <ul className="grid grid-cols-2 gap-1.5 max-md:auto-rows-auto lg:grid-cols-12">
          {images.map((image, index) => {
            const itemClass = mobileItem[image.slot] ?? "max-md:col-span-1";
            const frameClass = mobileFrame[image.slot] ?? "max-md:aspect-[4/5] max-md:h-auto";
            const objectClass = mobileObject[image.slot] ?? "";
            const isFull = itemClass.includes("max-md:col-span-2");

            return (
              <li
                key={image.id ?? image.slot}
                className={`min-w-0 ${image.desktop} ${itemClass}`}
              >
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className={`relative block w-full overflow-hidden bg-[#d7cfb8] ${image.mobile} ${frameClass} lg:h-full`}
                  aria-label={`View ${image.alt}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={
                      isFull
                        ? "(min-width: 1024px) 50vw, 100vw"
                        : "(min-width: 1024px) 50vw, 50vw"
                    }
                    className={`object-cover transition-transform duration-700 ease-out hover:scale-[1.02] ${image.object} ${objectClass}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </Container>

      {current ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 px-5"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-[0.68rem] font-medium tracking-[0.22em] text-ivory uppercase lg:text-[0.816rem]"
            onClick={() => setActive(null)}
          >
            Close
          </button>
          <button
            type="button"
            className="absolute left-4 text-ivory lg:left-8"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              setActive((currentIndex) => (currentIndex - 1 + images.length) % images.length);
            }}
          >
            ←
          </button>
          <div
            className="relative h-[78vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            className="absolute right-4 text-ivory lg:right-8"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              setActive((currentIndex) => (currentIndex + 1) % images.length);
            }}
          >
            →
          </button>
        </div>
      ) : null}
    </section>
  );
}
