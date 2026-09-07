import Container from "@/components/ui/Container";
import { OliveSprig } from "@/components/ui/Ornaments";
import InquiryForm from "@/components/contact/InquiryForm";

export default function InquirySection({ content }) {
  return (
    <section
      id="inquiry-form"
      className="relative scroll-mt-[var(--header-height)] bg-ivory"
    >
      <span id="inquiry" className="absolute top-0" aria-hidden="true" />
      <Container className="pt-7 pb-8 lg:pt-8 lg:pb-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-x-[8%]">
          <div className="flex max-w-[34rem] flex-col lg:max-w-none">
            <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-[1.85rem] leading-[1.08] font-medium tracking-tight text-ink uppercase sm:text-[2.15rem] lg:text-[2.82rem]">
              <span className="block">{content.heading[0]}</span>
              <span className="block">{content.heading[1]}</span>
            </h2>
            <div className="mt-3 flex items-center gap-3" aria-hidden="true">
              <span className="h-px w-10 bg-gold/70" />
              <OliveSprig className="h-4 w-7 text-[#7C8060]" />
              <span className="h-px w-10 bg-gold/70" />
            </div>
            <p className="mt-4 text-[0.95rem] leading-7 text-ink lg:text-[18px] lg:leading-[1.7]">
              {content.copy}
            </p>
            <p className="mt-5 text-[0.9rem] leading-6 text-ink-soft italic lg:mt-auto lg:pt-8 lg:text-[17.4px]">
              {content.note}
            </p>
          </div>

          <div className="mt-5 min-w-0 md:mt-8 lg:mt-0">
            <InquiryForm
              eventTypes={content.eventTypes}
              success={content.success}
              labels={content.form?.labels}
              messagePlaceholder={content.form?.messagePlaceholder}
              submitLabel={content.form?.submitLabel}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
