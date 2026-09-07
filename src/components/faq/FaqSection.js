import Container from "@/components/ui/Container";
import FaqAccordion from "@/components/faq/FaqAccordion";

export default function FaqSection({ intro, items }) {
  return (
    <section className="bg-ivory">
      <Container className="pt-7 pb-8 lg:pt-8 lg:pb-10">
        <div className="max-w-[40rem]">
          <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
            {intro.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-[1.7rem] leading-[1.12] font-medium tracking-tight text-ink uppercase sm:text-[1.95rem] lg:text-[2.58rem]">
            {intro.heading}
          </h2>
          <p className="mt-3 text-[0.9rem] leading-6 text-ink lg:text-[17.4px] lg:leading-[1.55]">
            {intro.copy}
          </p>
        </div>

        <div className="mt-6 lg:mt-7">
          <FaqAccordion items={items} />
        </div>
      </Container>
    </section>
  );
}
