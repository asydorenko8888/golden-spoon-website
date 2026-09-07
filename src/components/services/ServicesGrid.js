import Image from "next/image";
import Container from "@/components/ui/Container";

export default function ServicesGrid({ items }) {
  return (
    <section className="bg-ivory">
      <Container className="py-8 md:py-9 lg:pt-7 lg:pb-8">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-8">
          {items.map((item) => (
            <li key={item.number} className="min-w-0">
              <div
                data-image-slot={item.image.slot}
                className="relative aspect-[3/2] w-full overflow-hidden bg-[#d7cfb8]"
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="mt-3 flex gap-3 lg:mt-3.5">
                <p className="shrink-0 font-serif text-[1.15rem] leading-none text-gold lg:text-[1.38rem]">
                  <span className="md:hidden">{Number(item.number)}</span>
                  <span className="hidden md:inline">{item.number}</span>
                </p>
                <div className="min-w-0">
                  <h2 className="font-serif text-[1rem] leading-[1.15] font-medium tracking-tight text-ink uppercase lg:text-[1.26rem]">
                    {item.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <p className="mt-1.5 text-[0.78rem] leading-[1.45] text-ink-soft lg:text-[15.6px] lg:leading-[1.5]">
                    {item.copy}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
