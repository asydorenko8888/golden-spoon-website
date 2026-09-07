import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { IconArrow, OliveSprig } from "@/components/ui/Ornaments";

export default function SelectedServices({ content }) {
  const previewItems = content.items.filter(
    (item) => item.image.slot !== "service-cocktail",
  );

  return (
    <section className="relative overflow-hidden bg-ivory lg:scroll-mt-[var(--header-height)]">
      <Image
        src="/images/brand/botanical-accent.png"
        alt=""
        width={112}
        height={267}
        className="pointer-events-none absolute top-[-4%] -right-10 z-0 hidden h-[108%] w-auto -scale-x-100 opacity-[0.1] lg:block"
      />

      <Container className="relative z-[1] pt-5 pb-4 md:py-9 lg:pt-1 lg:pb-8">
        <div className="mx-auto max-w-[40rem] text-center">
          <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
            {content.eyebrow}
          </p>
          <h2 className="mt-1.5 font-serif text-[1.45rem] leading-[1.12] font-medium tracking-tight text-ink md:text-[2rem] lg:text-[2.58rem]">
            {content.heading}
          </h2>
          <p className="mt-1.5 font-script text-[1.35rem] leading-[1.15] text-gold sm:text-[1.5rem] lg:text-[clamp(24px,1.8vw,31.2px)]">
            {content.script}
          </p>
          <div
            className="mt-2.5 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span className="h-px w-8 bg-gold/70" />
            <OliveSprig className="h-3.5 w-6 text-[#7C8060]" />
            <span className="h-px w-8 bg-gold/70" />
          </div>
          <p className="mx-auto mt-2.5 max-w-[32rem] text-[0.85rem] leading-6 text-ink lg:-mt-1 lg:text-[16.8px] lg:leading-[1.55]">
            {content.copy}
          </p>
        </div>

        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 lg:mt-[18px] lg:grid-cols-3 lg:gap-x-10 lg:gap-y-0">
          {previewItems.map((item) => (
            <li key={item.image.slot} className="min-w-0">
              <div
                data-image-slot={item.image.slot}
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#d7cfb8]"
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 33vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <h3 className="mt-3 text-center font-serif text-[1rem] leading-snug font-medium text-ink lg:mt-3.5 lg:text-[1.26rem]">
                {item.title}
              </h3>
              <p className="mt-1 text-center text-[0.75rem] leading-[1.4] text-ink-soft lg:text-[15px] lg:leading-[1.45]">
                {item.copy}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-center md:mt-8 lg:mt-10">
          <Button
            href={content.cta.href}
            variant="goldOutline"
            className="gap-3 lg:h-10 lg:min-h-10"
          >
            {content.cta.label}
            <IconArrow className="h-2.5 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
