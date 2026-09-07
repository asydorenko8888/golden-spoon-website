import Image from "next/image";
import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";

function MenuBlock({ item, imageLeft }) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-x-[8%]">
      <div
        className={`relative max-w-[34rem] lg:max-w-none ${
          imageLeft ? "lg:order-2" : ""
        }`}
      >
        <p className="font-serif text-[1.15rem] leading-none text-gold lg:text-[1.38rem]">
          <span className="md:hidden">{Number(item.number)}</span>
          <span className="hidden md:inline">{item.number}</span>
        </p>
        <h3 className="mt-2 font-serif text-[1.7rem] leading-[1.08] font-medium tracking-tight text-ink uppercase sm:text-[1.95rem] lg:text-[2.58rem]">
          {item.title}
        </h3>
        <div className="mt-3 flex items-center gap-3" aria-hidden="true">
          <span className="h-px w-10 bg-gold/70" />
          <OliveSprig className="h-4 w-7 text-[#7C8060]" />
          <span className="h-px w-10 bg-gold/70" />
        </div>
        {item.note ? (
          <p className="mt-3.5 text-[0.95rem] leading-7 text-ink-soft md:mt-4 lg:text-[18px] lg:leading-[1.7]">
            {item.note}
          </p>
        ) : (
          <div className="mt-3.5 space-y-3 md:mt-5" aria-hidden="true">
            <span className="block h-px w-full max-w-[18rem] bg-ink/10" />
            <span className="block h-px w-full max-w-[15rem] bg-ink/10" />
            <span className="block h-px w-full max-w-[16.5rem] bg-ink/10" />
          </div>
        )}
      </div>

      <figure
        className={`mt-5 min-w-0 md:mt-6 lg:mt-0 ${
          imageLeft ? "lg:order-1" : ""
        }`}
      >
        <div
          data-image-slot={item.image.slot}
          className="relative aspect-[16/10] overflow-hidden bg-[#d7cfb8]"
        >
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </figure>
    </div>
  );
}

export default function MenuCollections({ content }) {
  return (
    <section className="bg-ivory">
      <Container className="pt-7 pb-8 lg:pt-8 lg:pb-10">
        <div className="max-w-[40rem]">
          <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
            {content.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-[1.7rem] leading-[1.12] font-medium tracking-tight text-ink uppercase sm:text-[1.95rem] lg:text-[2.58rem]">
            <span className="lg:block">{content.heading[0]} </span>
            <span className="lg:block">{content.heading[1]}</span>
          </h2>
          <p className="mt-3 text-[0.9rem] leading-6 text-ink lg:text-[17.4px] lg:leading-[1.55]">
            {content.copy}
          </p>
        </div>

        <div className="mt-6 space-y-7 md:mt-8 md:space-y-10 lg:mt-10 lg:space-y-12">
          {content.items.map((item, index) => (
            <MenuBlock key={item.title} item={item} imageLeft={index % 2 === 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}
