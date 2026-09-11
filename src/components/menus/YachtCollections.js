import Container from "@/components/ui/Container";
import MenuGraphic from "@/components/menus/MenuGraphic";

export default function YachtCollections({ content }) {
  return (
    <section className="bg-ivory">
      <Container className="menus-container pt-12">
        <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
          {content.eyebrow}
        </p>
        <p className="mt-4 max-w-[40rem] text-[0.88rem] leading-6 text-ink-soft lg:text-[16.2px] lg:leading-[1.55]">
          {content.attendantNote}
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-14 lg:grid-cols-3 lg:items-start lg:gap-[var(--menu-preview-gap)]">
          {content.collections.map((item, index) => (
            <li
              key={item.id}
              className="mx-auto w-full max-w-full min-w-0 lg:w-[var(--menu-preview-width)]"
            >
              <p className="font-serif text-[0.95rem] leading-[1.15] font-medium tracking-tight text-ink uppercase lg:min-h-[2.3rem] lg:text-[1.05rem]">
                {item.title}
              </p>
              <p className="mt-1.5 mb-6 text-[0.72rem] tracking-[0.08em] text-ink-soft uppercase">
                {item.price}
                {" · "}
                {item.minimum || "Minimum 10 guests"}
              </p>
              <MenuGraphic image={item.image} priority={index === 0} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
