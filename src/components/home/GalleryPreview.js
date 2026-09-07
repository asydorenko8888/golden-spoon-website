import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { IconArrow, OliveSprig } from "@/components/ui/Ornaments";

export default function GalleryPreview({ content }) {
  const [hero, ...supporting] = content.images;

  return (
    <section className="relative overflow-hidden bg-ivory lg:h-[calc(100vh-var(--header-height))] lg:min-h-0 lg:max-h-[calc(100vh-var(--header-height))] lg:scroll-mt-[var(--header-height)]">
      <Image
        src="/images/brand/botanical-accent.png"
        alt=""
        width={112}
        height={267}
        className="pointer-events-none absolute top-[-6%] -right-10 z-0 hidden h-[112%] w-auto -scale-x-100 opacity-[0.1] lg:block"
      />

      <Container className="relative z-[1] pt-5 pb-8 md:py-10 lg:flex lg:h-full lg:min-h-0 lg:items-center lg:py-7">
        <div className="flex flex-col lg:grid lg:h-full lg:min-h-0 lg:w-full lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-center lg:gap-x-12 xl:gap-x-14">
          <div className="order-2 mt-5 grid aspect-[5/4] grid-cols-[1.15fr_0.85fr] grid-rows-3 gap-[3px] md:order-1 md:mt-0 lg:aspect-auto lg:h-full lg:min-h-0">
            <div
              data-image-slot={hero.slot}
              className="relative row-span-3 min-h-0 overflow-hidden bg-[#d7cfb8]"
            >
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                sizes="(min-width: 1024px) 36vw, 70vw"
                className="object-cover object-center"
              />
            </div>
            {supporting.map((image) => (
              <div
                key={image.slot}
                data-image-slot={image.slot}
                className="relative min-h-0 overflow-hidden bg-[#d7cfb8]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 40vw"
                  className={`object-cover ${
                    image.slot === "gallery-preview-3"
                      ? "max-md:object-[center_top] md:object-[center_top]"
                      : (image.object ?? "object-center")
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="relative max-w-[26rem] max-md:contents md:order-2 md:mt-8 lg:mt-0">
            <div className="order-1">
              <p className="text-[0.816rem] font-medium tracking-[0.26em] text-gold uppercase">
                {content.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-[2.22rem] leading-[1.08] font-medium tracking-tight text-ink sm:text-[2.58rem] lg:text-[2.94rem]">
                {content.heading}
              </h2>
              <div
                className="mt-3 flex items-center gap-3 md:mt-4"
                aria-hidden="true"
              >
                <span className="h-px w-10 bg-gold/70" />
                <OliveSprig className="h-4 w-7 text-[#7C8060]" />
                <span className="h-px w-10 bg-gold/70" />
              </div>
            </div>
            <div className="order-3 mt-5 md:mt-0">
              <p className="mt-0 text-[1.14rem] leading-7 text-ink md:mt-5 lg:text-[18px] lg:leading-[1.7]">
                {content.copy}
              </p>
              <div className="mt-5 md:mt-7">
                <Button
                  href={content.cta.href}
                  variant="goldOutline"
                  className="gap-3 lg:h-10 lg:min-h-10"
                >
                  {content.cta.label}
                  <IconArrow className="h-2.5 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
