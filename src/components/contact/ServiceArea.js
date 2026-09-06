import Image from "next/image";
import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";

export default function ServiceArea({ content }) {
  return (
    <section className="border-t border-ink/10 bg-ivory">
      <Container className="py-6 md:py-9 lg:py-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-x-[8%]">
          <figure className="min-w-0">
            <div
              data-image-slot={content.image.slot}
              className="relative aspect-[16/10] overflow-hidden bg-[#d7cfb8]"
            >
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover object-[center_48%]"
              />
            </div>
          </figure>

          <div className="relative mt-6 max-w-[34rem] lg:mt-0 lg:max-w-none">
            <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-[1.85rem] leading-[1.08] font-medium tracking-tight text-ink uppercase sm:text-[2.15rem] lg:text-[2.35rem]">
              <span className="block">{content.heading[0]}</span>
              <span className="block">{content.heading[1]}</span>
            </h2>
            <div className="mt-3 flex items-center gap-3" aria-hidden="true">
              <span className="h-px w-10 bg-gold/70" />
              <OliveSprig className="h-4 w-7 text-[#7C8060]" />
              <span className="h-px w-10 bg-gold/70" />
            </div>
            <p className="mt-4 text-[0.95rem] leading-7 text-ink lg:text-[15px] lg:leading-[1.7]">
              {content.copy}
            </p>
            <p className="mt-3 text-[0.92rem] leading-6 text-ink-soft lg:text-[14.5px] lg:leading-[1.6]">
              {content.support}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
