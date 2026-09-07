import Image from "next/image";
import Container from "@/components/ui/Container";

export default function AboutHero({ content }) {
  return (
    <section className="relative overflow-hidden bg-ivory lg:h-[calc((100vh-var(--header-height))*0.72)] lg:max-h-[calc((100vh-var(--header-height))*0.72)]">
      <div
        data-image-slot={content.image.slot}
        className="absolute inset-0 overflow-hidden bg-[#d7cfb8]"
      >
        <Image
          src={content.image.src}
          alt={content.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ivory from-[12%] via-ivory/85 to-ivory/10 sm:via-ivory/75 lg:to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container className="relative z-[1] flex min-h-[16.5rem] items-center py-8 sm:min-h-[20rem] md:py-14 lg:h-full lg:min-h-0 lg:items-start lg:pt-[4.75rem] lg:pb-0">
        <div className="max-w-[28rem]">
          <p className="text-[0.816rem] font-medium tracking-[0.26em] text-gold uppercase">
            {content.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-[2.94rem] leading-[0.98] font-medium tracking-[-0.01em] text-ink uppercase sm:text-[3.6rem] lg:text-[clamp(52.8px,4.32vw,67.2px)] lg:leading-[0.95]">
            <span className="block">{content.heading[0]}</span>
            <span className="block">{content.heading[1]}</span>
          </h1>
          <span
            className="mt-4 block h-px w-12 bg-gold/70"
            aria-hidden="true"
          />
          <p className="mt-4 text-[1.14rem] leading-6 text-ink lg:text-[18px] lg:leading-[1.55]">
            <span className="block">{content.copy[0]}</span>
            <span className="block">{content.copy[1]}</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
