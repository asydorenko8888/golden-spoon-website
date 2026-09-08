import Image from "next/image";
import Container from "@/components/ui/Container";
import { OliveBranch, OliveSprig } from "@/components/ui/Ornaments";

export default function ContactHero({ content }) {
  return (
    <section className="relative bg-ivory lg:h-[calc((100vh-var(--header-height))*0.72)] lg:max-h-[calc((100vh-var(--header-height))*0.72)]">
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
          className="object-cover object-[center_40%]"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] overflow-hidden lg:block"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, #000 0%, #000 36%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.15) 86%, transparent 100%)",
            maskImage:
              "linear-gradient(90deg, #000 0%, #000 36%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.15) 86%, transparent 100%)",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 left-0 h-full w-[161.29%]">
            <Image
              src={content.image.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-110 object-cover object-[center_40%] blur-2xl"
            />
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ivory from-[12%] via-ivory/85 to-ivory/10 sm:via-ivory/75 lg:hidden"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--ivory) 0%, var(--ivory) 12%, color-mix(in srgb, var(--ivory) 75%, transparent) 32%, transparent 58%)",
          }}
          aria-hidden="true"
        />
      </div>

      <Container className="relative z-[1] flex min-h-[16.5rem] items-center py-8 sm:min-h-[20rem] md:py-14 lg:h-full lg:min-h-0 lg:items-start lg:pt-12 lg:pb-0">
        <div className="max-w-[28rem] lg:flex lg:h-full lg:flex-col">
          <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
            {content.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-[2.45rem] leading-[0.98] font-medium tracking-[-0.01em] text-ink uppercase sm:text-5xl lg:text-[clamp(52.8px,4.32vw,67.2px)] lg:leading-[0.95]">
            <span className="block">{content.heading[0]}</span>
            <span className="block">{content.heading[1]}</span>
          </h1>
          <div className="mt-4 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-10 bg-gold/70" />
            <OliveSprig className="h-4 w-7 text-[#7C8060]" />
            <span className="h-px w-10 bg-gold/70" />
          </div>
          <p className="mt-4 text-[0.95rem] leading-6 text-ink lg:text-[18px] lg:leading-[1.55]">
            {content.copy}
          </p>
          <div
            className="relative z-[2] hidden justify-center lg:flex lg:flex-1 lg:items-center"
            data-olive-branch="contact-hero"
            aria-hidden="true"
          >
            <OliveBranch className="h-[136px] w-[230px] text-[#8A8060] opacity-50" />
          </div>
        </div>
      </Container>
    </section>
  );
}
