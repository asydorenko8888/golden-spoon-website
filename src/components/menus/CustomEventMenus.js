import Container from "@/components/ui/Container";
import MenuGraphic from "@/components/menus/MenuGraphic";

function CustomEventCard({ section }) {
  const item = section.items[0];

  return (
    <li className="mx-auto grid w-[var(--menu-preview-width)] max-w-full min-w-0 grid-rows-[auto_auto_auto_auto] lg:mx-0 lg:row-span-4 lg:grid-rows-subgrid">
      <p className="min-h-[1.05rem] text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:min-h-[1.225rem] lg:text-[0.816rem]">
        {section.eyebrow || "\u00a0"}
      </p>
      <h3 className="mt-2 min-h-[2.3rem] font-serif text-[0.95rem] leading-[1.15] font-medium tracking-tight break-words whitespace-pre-line text-ink uppercase lg:text-[1.05rem]">
        {item.title}
      </h3>
      <p className="mt-3.5 text-[0.9rem] leading-6 text-ink lg:text-[17.4px] lg:leading-[1.55]">
        {section.context}
      </p>
      <MenuGraphic image={item.image} className="mt-6 self-start justify-self-start" />
    </li>
  );
}

function CustomEventRow({ sections }) {
  return (
    <ul className="mx-auto grid w-full max-w-[var(--menu-preview-width)] grid-cols-1 gap-y-16 lg:ml-0 lg:mr-auto lg:max-w-[calc(var(--menu-preview-width)*2+var(--menu-custom-col-gap))] lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto] lg:gap-x-[var(--menu-custom-col-gap)] lg:gap-y-0">
      {sections.map((section) => (
        <CustomEventCard key={section.items[0].title} section={section} />
      ))}
    </ul>
  );
}

export default function CustomEventMenus({ sections }) {
  const rows = [];
  for (let index = 0; index < sections.length; index += 2) {
    rows.push(sections.slice(index, index + 2));
  }

  return (
    <section className="bg-ivory">
      <Container className="flex flex-col gap-y-16 pt-[4.5rem] lg:gap-y-[var(--menu-custom-row-gap)] lg:pt-24">
        {rows.map((row) => (
          <CustomEventRow key={row[0].items[0].title} sections={row} />
        ))}
      </Container>
    </section>
  );
}
