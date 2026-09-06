import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";
import MatchedStoryImage from "@/components/about/MatchedStoryImage";

export default function OurApproach({ content }) {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <Image
        src="/images/brand/botanical-accent.png"
        alt=""
        width={112}
        height={267}
        className="pointer-events-none absolute top-[-8%] left-0 z-0 hidden h-[112%] w-auto opacity-[0.12] lg:block"
      />

      <Container className="relative z-[1] py-8 md:py-14 lg:py-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-x-[8%]">
          <div className="relative max-w-[34rem] lg:max-w-none">
            <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-[2.15rem] leading-[1.05] font-medium tracking-tight text-ink uppercase sm:text-[2.45rem] lg:mt-1.5 lg:text-[2.75rem]">
              <span className="block">{content.heading[0]}</span>
              <span className="block">{content.heading[1]}</span>
            </h2>
            <div className="mt-3 flex items-center gap-3 md:mt-4 lg:mt-2.5" aria-hidden="true">
              <span className="h-px w-10 bg-gold/70" />
              <OliveSprig className="h-4 w-7 text-[#7C8060]" />
              <span className="h-px w-10 bg-gold/70" />
            </div>
            <div className="mt-4 space-y-3 text-[0.95rem] leading-7 text-ink md:mt-5 md:space-y-4 lg:mt-4 lg:space-y-3 lg:text-[15px] lg:leading-[1.7]">
              {content.copy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-5 md:mt-7 lg:mt-5">
              <Button
                href={content.cta.href}
                variant="goldOutline"
                className="lg:h-10 lg:min-h-10"
              >
                {content.cta.label}
              </Button>
            </div>
          </div>

          <figure className="mt-5 min-w-0 md:mt-8 lg:mt-0 lg:flex lg:items-center lg:justify-end">
            <MatchedStoryImage image={content.image} />
          </figure>
        </div>
      </Container>
    </section>
  );
}
