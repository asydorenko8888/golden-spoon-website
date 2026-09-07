import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";

export default function CustomMenu({ content }) {
  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-ivory">
      <Image
        src="/images/brand/botanical-accent.png"
        alt=""
        width={112}
        height={267}
        className="pointer-events-none absolute top-[-8%] -right-10 z-0 hidden h-[112%] w-auto -scale-x-100 opacity-[0.12] lg:block"
      />
      <Container className="relative z-[1] py-7 md:py-9 lg:py-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-x-[8%]">
          <div className="relative max-w-[34rem] lg:max-w-none">
            <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-[1.85rem] leading-[1.08] font-medium tracking-tight text-ink uppercase sm:text-[2.15rem] lg:text-[2.82rem]">
              <span className="block">{content.heading[0]}</span>
              <span className="block">{content.heading[1]}</span>
            </h2>
            <div className="mt-3 flex items-center gap-3" aria-hidden="true">
              <span className="h-px w-10 bg-gold/70" />
              <OliveSprig className="h-4 w-7 text-[#7C8060]" />
              <span className="h-px w-10 bg-gold/70" />
            </div>
            <p className="mt-4 text-[0.95rem] leading-7 text-ink lg:text-[18px] lg:leading-[1.7]">
              {content.copy}
            </p>
            <div className="mt-6">
              <Button
                href={content.cta.href}
                variant="goldOutline"
                className="lg:h-10 lg:min-h-10"
              >
                {content.cta.label}
              </Button>
            </div>
          </div>
          <figure className="mt-6 min-w-0 lg:mt-0">
            <div
              data-image-slot={content.image.slot}
              className="relative aspect-[16/10] overflow-hidden bg-[#d7cfb8]"
            >
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}
