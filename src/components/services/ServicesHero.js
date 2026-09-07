import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";

export default function ServicesHero({ content }) {
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
          className="object-cover object-[center_center]"
        />
      </div>

      <Container className="relative z-[1] flex min-h-[16.5rem] items-center py-8 sm:min-h-[20rem] md:py-14 lg:box-border lg:h-full lg:min-h-0 lg:items-start lg:pt-[4.75rem] lg:pb-8">
        <div className="max-w-[28rem]">
          <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
            {content.eyebrow}
          </p>
          <h1 className="mt-2.5 font-serif text-[2.15rem] leading-[1.02] font-medium tracking-[-0.01em] text-ink uppercase sm:text-[2.45rem] lg:text-[clamp(43.2px,3.72vw,57.6px)] lg:leading-[1.02]">
            <span className="block">{content.heading[0]}</span>
            <span className="block">{content.heading[1]}</span>
          </h1>
          <div className="mt-3 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-10 bg-gold/70" />
            <OliveSprig className="h-4 w-7 text-[#7C8060]" />
            <span className="h-px w-10 bg-gold/70" />
          </div>
          <p className="mt-4 text-[0.95rem] leading-6 font-medium text-ink lg:text-[18px] lg:leading-[1.5]">
            {content.lead}
          </p>
          <p className="mt-2.5 text-[0.9rem] leading-6 text-ink lg:text-[17.4px] lg:leading-[1.55]">
            {content.copy}
          </p>
          <div className="mt-5 pb-4 md:pb-8 lg:pb-0">
            <Button
              href={content.cta.href}
              variant="gold"
              className="lg:h-10 lg:min-h-10"
            >
              {content.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
