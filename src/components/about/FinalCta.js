import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { site } from "@/data/siteContent";

export default function FinalCta({ content }) {
  return (
    <section className="bg-ivory">
      <Container className="py-8 text-center md:py-14 lg:py-7">
        <p className="text-[0.816rem] font-medium tracking-[0.26em] text-gold uppercase">
          {content.eyebrow}
        </p>
        <h2 className="mx-auto mt-3 max-w-[36rem] font-serif text-[2.22rem] leading-[1.12] font-medium tracking-tight text-ink uppercase sm:text-[2.58rem] lg:mt-2 lg:text-[2.82rem]">
          {content.heading}
        </h2>
        <div className="mt-5 md:mt-7 lg:mt-5">
          <Button
            href={content.href ?? site.cta.inquireShort.href}
            variant="goldOutline"
            className="lg:h-10 lg:min-h-10 lg:min-w-[6.75rem]"
          >
            {content.label ?? site.cta.inquireShort.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
