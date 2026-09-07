"use client";

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

function lightboxId(index) {
  return `gallery-image-${index}`;
}

export default function EditorialGallery({ images }) {
  return (
    <section id="gallery" className="bg-ivory">
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
                <a
                  href={`#${lightboxId(index)}`}
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
                </a>
              </li>
            );
          })}
        </ul>
      </Container>

      {images.map((image, index) => (
        <div
          key={`lightbox-${image.id ?? image.slot ?? index}`}
          id={lightboxId(index)}
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          className="fixed inset-0 z-[100] hidden items-center justify-center bg-ink/80 px-5 py-16 target:flex"
        >
          <a
            href="#gallery"
            className="absolute inset-0"
            aria-label="Close"
          />
          <a
            href="#gallery"
            className="absolute top-4 right-5 z-[1] flex h-10 w-10 items-center justify-center text-[2rem] leading-none text-ivory"
            aria-label="Close"
          >
            ×
          </a>
          <img
            src={image.src}
            alt={image.alt}
            className="relative z-[1] max-h-[min(82vh,820px)] max-w-[min(92vw,1080px)] object-contain"
          />
        </div>
      ))}
    </section>
  );
}
