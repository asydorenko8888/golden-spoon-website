import Image from "next/image";
import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";

export default function Experience({ content }) {
  return (
    <section className="relative overflow-hidden bg-ivory lg:h-[calc(100vh-var(--header-height))] lg:min-h-0 lg:max-h-[calc(100vh-var(--header-height))] lg:scroll-mt-[var(--header-height)]">
      <Image
        src="/images/brand/botanical-accent.png"
        alt=""
        width={112}
        height={267}
        className="pointer-events-none absolute top-[-6%] -right-10 z-0 hidden h-[112%] w-auto -scale-x-100 opacity-[0.15] lg:block"
      />

      <Container className="pt-8 pb-5 md:py-14 lg:flex lg:h-full lg:min-h-0 lg:items-center lg:py-[30px]">
        <div className="lg:grid lg:h-full lg:min-h-0 lg:w-full lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-x-14 xl:gap-x-16">
          <figure className="relative mx-auto max-w-[34rem] lg:mx-0 lg:h-full lg:max-w-none lg:-translate-x-6">
            <div
              data-image-slot={content.image.slot}
              className="relative aspect-[4/5] overflow-hidden bg-[#d7cfb8] sm:aspect-[3/4] lg:aspect-auto lg:h-full"
            >
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </figure>

          <div className="relative z-[1] mt-5 max-w-[34rem] md:mt-8 lg:mt-0 lg:max-w-[32rem]">
            <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
              {content.eyebrow}
            </p>
            <h2 className="mt-1.5 font-serif text-[2.75rem] leading-none font-medium tracking-tight text-ink sm:text-5xl lg:text-[4.5rem]">
              {content.heading}
            </h2>
            <p className="mt-2.5 font-script text-[1.45rem] leading-[1.15] text-gold sm:text-[1.65rem] lg:mt-3 lg:text-[clamp(26.4px,2.16vw,33.6px)]">
              {content.script}
            </p>

            <div
              className="mt-4 flex items-center gap-3 lg:mt-5"
              aria-hidden="true"
            >
              <span className="h-px w-10 bg-gold/70" />
              <OliveSprig className="h-4 w-7 text-[#7C8060]" />
              <span className="h-px w-10 bg-gold/70" />
            </div>

            <p className="mt-5 text-[0.95rem] leading-7 text-ink lg:mt-5 lg:text-[18px] lg:leading-[1.7]">
              {content.copy}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
