import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function GalleryCta({ content }) {
  return (
    <section className="border-t border-ink/10 bg-ivory-warm">
      <Container className="py-6 text-center md:py-9 lg:py-8">
        <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase">
          {content.eyebrow}
        </p>
        <h2 className="mx-auto mt-2 max-w-[36rem] font-serif text-[1.7rem] leading-[1.12] font-medium tracking-tight text-ink uppercase sm:text-[1.95rem] lg:text-[2.15rem]">
          {content.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-[32rem] text-[0.9rem] leading-6 text-ink lg:text-[14.5px] lg:leading-[1.55]">
          {content.copy}
        </p>
        <div className="mt-5">
          <Button
            href={content.button.href}
            variant="goldOutline"
            className="lg:h-10 lg:min-h-10"
          >
            {content.button.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
