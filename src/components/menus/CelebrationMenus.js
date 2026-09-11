import Container from "@/components/ui/Container";
import MenuGraphic from "@/components/menus/MenuGraphic";

export default function CelebrationMenus({ content }) {
  return (
    <section className="bg-ivory">
      <Container className="pt-[4.5rem] lg:pt-24">
        <div className="w-full">
          <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
            {content.eyebrow}
          </p>
          <p className="mt-3 text-[0.9rem] leading-6 text-ink lg:text-[17.4px] lg:leading-[1.55]">
            {content.copy}
          </p>
          <p className="mt-3 text-[0.88rem] leading-6 text-ink-soft lg:text-[16.2px] lg:leading-[1.55]">
            {content.note}
          </p>
        </div>

        <ul className="mx-auto mt-8 grid w-full max-w-[var(--menu-preview-width)] grid-cols-1 gap-14 lg:ml-0 lg:mr-auto lg:max-w-[calc(var(--menu-preview-width)*2+var(--menu-pair-gap))] lg:grid-cols-2 lg:items-start lg:gap-x-[var(--menu-pair-gap)]">
          {content.items.map((item) => (
            <li
              key={item.title}
              className="mx-auto w-[var(--menu-preview-width)] max-w-full min-w-0 lg:mx-0"
            >
              <p className="font-serif text-[0.95rem] leading-[1.15] font-medium tracking-tight break-words text-ink uppercase lg:min-h-[2.3rem] lg:text-[1.05rem]">
                {item.title}
              </p>
              <p className="mt-1.5 mb-6 text-[0.72rem] tracking-[0.08em] text-ink-soft uppercase">
                {item.price}
              </p>
              <MenuGraphic image={item.image} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
