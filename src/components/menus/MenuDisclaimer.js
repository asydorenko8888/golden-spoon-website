import Container from "@/components/ui/Container";

export default function MenuDisclaimer({ copy }) {
  return (
    <section className="bg-ivory">
      <Container className="menus-container pt-[4.5rem] pb-10 lg:pt-24 lg:pb-12">
        <p className="mx-auto max-w-[40rem] text-center font-serif text-[1.02rem] leading-7 text-ink-soft italic lg:text-[1.14rem] lg:leading-[1.55]">
          {copy}
        </p>
      </Container>
    </section>
  );
}
