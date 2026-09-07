import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { IconArrow, OliveSprig } from "@/components/ui/Ornaments";

export default function About({ content }) {
  return (
    <section className="relative overflow-hidden bg-ivory lg:h-[calc(100vh-var(--header-height))] lg:min-h-0 lg:max-h-[calc(100vh-var(--header-height))] lg:scroll-mt-[var(--header-height)]">
      <Image
        src="/images/brand/botanical-accent.png"
        alt=""
        width={112}
        height={267}
        className="pointer-events-none absolute top-[-8%] left-0 z-0 hidden h-[115%] w-auto opacity-[0.12] lg:block"
      />

      <Container className="relative z-[1] pt-4 pb-7 md:py-12 lg:flex lg:h-full lg:min-h-0 lg:items-center lg:py-8">
        <div className="lg:grid lg:h-full lg:min-h-0 lg:w-full lg:grid-cols-2 lg:items-center lg:gap-x-[84px] xl:gap-x-[100px]">
          <div className="relative max-w-[34rem]">
            <p className="text-[0.816rem] font-medium tracking-[0.26em] text-gold uppercase">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-[2.58rem] leading-[1.05] font-medium tracking-tight text-ink sm:text-[2.94rem] lg:text-[3.3rem]">
              <span className="block">{content.heading[0]}</span>
              <span className="block">{content.heading[1]}</span>
            </h2>
            <div
              className="mt-3 flex items-center gap-3 md:mt-4"
              aria-hidden="true"
            >
              <span className="h-px w-10 bg-gold/70" />
              <OliveSprig className="h-4 w-7 text-[#7C8060]" />
              <span className="h-px w-10 bg-gold/70" />
            </div>
            <div className="mt-4 space-y-3 text-[1.14rem] leading-7 text-ink md:mt-5 md:space-y-4 lg:text-[18px] lg:leading-[1.7]">
              {content.copy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
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

          <figure className="relative mt-5 md:mt-8 lg:mt-0 lg:h-full">
            <div
              data-image-slot={content.image.slot}
              className="relative aspect-[4/3] overflow-hidden bg-[#d7cfb8] sm:aspect-[16/11] lg:aspect-auto lg:h-full"
            >
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
              <p className="pointer-events-none absolute top-5 right-5 max-w-[11rem] text-right font-script text-[1.74rem] leading-[1.15] text-gold sm:top-7 sm:right-7 sm:text-[1.98rem] lg:text-[clamp(26.4px,2.16vw,36px)]">
                <span className="block">“{content.quote[0]}</span>
                <span className="block">{content.quote[1]}</span>
                <span className="block">{content.quote[2]}”</span>
              </p>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}
