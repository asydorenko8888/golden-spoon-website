import Image from "next/image";
import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";

export default function MenuIntro({ content }) {
  return (
    <section className="bg-ivory">
      <Container className="pt-8 pb-0 lg:pt-5">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-12">
          <div className="max-w-[40rem]">
            <h2 className="font-serif text-[1.55rem] leading-[1.12] font-medium tracking-tight break-words text-ink uppercase sm:text-[1.95rem] lg:text-[2.58rem]">
              <span className="block">{content.heading[0]}</span>
              <span className="block">{content.heading[1]}</span>
            </h2>
            <div className="mt-3 flex items-center gap-3" aria-hidden="true">
              <span className="h-px w-10 bg-gold/70" />
              <OliveSprig className="h-4 w-7 text-[#7C8060]" />
              <span className="h-px w-10 bg-gold/70" />
            </div>
            <p className="mt-8 text-[0.9rem] leading-6 text-ink lg:text-[17.4px] lg:leading-[1.55]">
              {content.copy}
            </p>
            <p className="mt-4 font-serif text-[1.02rem] leading-7 text-ink-soft italic lg:text-[1.14rem] lg:leading-[1.55]">
              {content.priceGuidance}
            </p>
          </div>
          <div className="hidden min-w-0 lg:block">
            <Image
              src="/images/menus/menu-fan.png"
              alt="Golden Spoon Classic Celebration, Premium Celebration, and Yacht Collection menu cards."
              width={1536}
              height={1024}
              className="h-auto w-full object-contain"
              sizes="(min-width: 1024px) 40vw, 0px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
