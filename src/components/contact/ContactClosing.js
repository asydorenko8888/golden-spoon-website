import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";

export default function ContactClosing({ content }) {
  return (
    <section className="border-t border-ink/10 bg-ivory-warm">
      <Container className="py-6 text-center md:py-9 lg:py-8">
        <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
          {content.eyebrow}
        </p>
        <h2 className="mx-auto mt-2 max-w-[36rem] font-serif text-[1.7rem] leading-[1.12] font-medium tracking-tight text-ink uppercase sm:text-[1.95rem] lg:text-[2.58rem]">
          <span className="block">{content.heading[0]}</span>
          <span className="block">{content.heading[1]}</span>
        </h2>
        <div className="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-10 bg-gold/70" />
          <OliveSprig className="h-4 w-7 text-[#7C8060]" />
          <span className="h-px w-10 bg-gold/70" />
        </div>
      </Container>
    </section>
  );
}
