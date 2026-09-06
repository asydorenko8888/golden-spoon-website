import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function ServicesCta({ content }) {
  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-ivory-warm">
      <Image
        src="/images/brand/botanical-accent.png"
        alt=""
        width={112}
        height={267}
        className="pointer-events-none absolute top-[-18%] left-0 z-0 hidden h-[140%] w-auto opacity-[0.12] lg:block"
      />
      <Container className="relative z-[1] flex flex-col items-center gap-4 py-6 text-center md:items-start md:gap-5 md:py-9 md:text-left lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-8">
        <div>
          <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase">
            {content.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-[1.7rem] leading-[1.1] font-medium tracking-tight text-ink uppercase sm:text-[1.95rem] lg:text-[2.15rem]">
            {content.heading}
          </h2>
        </div>
        <Button
          href={content.button.href}
          variant="goldOutline"
          className="shrink-0 lg:h-10 lg:min-h-10"
        >
          {content.button.label}
        </Button>
      </Container>
    </section>
  );
}
