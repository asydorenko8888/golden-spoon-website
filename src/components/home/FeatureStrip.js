import Container from "@/components/ui/Container";
import { FeatureIcon } from "@/components/ui/Ornaments";

export default function FeatureStrip({ items }) {
  return (
    <section
      data-measure="feature"
      className="border-y border-ink/10 bg-ivory-warm lg:box-border lg:h-[var(--feature-height)] lg:min-h-0"
    >
      <Container className="py-0 md:py-11 lg:flex lg:h-full lg:items-stretch lg:py-0">
        <h2 className="sr-only">Why Golden Spoon</h2>
        <ul className="grid w-full grid-cols-2 lg:h-full lg:grid-cols-4 lg:items-stretch">
          {items.map((item, index) => (
            <li
              key={item.icon}
              className={`grid min-h-0 grid-rows-[auto_2.25rem_auto] content-start items-start justify-items-center gap-y-2.5 px-3 py-4 text-center sm:px-5 md:flex md:grid-rows-none md:flex-col md:items-center md:gap-y-0 md:py-6 lg:grid lg:h-full lg:grid-rows-[40px_50px_1fr] lg:items-start lg:justify-items-center lg:gap-y-2 lg:px-7 lg:py-3 ${
                index % 2 === 1 ? "border-l border-ink/10" : ""
              } ${index > 1 ? "border-t border-ink/10 lg:border-t-0" : ""} ${
                index > 0 ? "lg:border-l lg:border-ink/10" : "lg:border-l-0"
              }`}
            >
              <div className="flex w-full items-center justify-center lg:h-10">
                <FeatureIcon
                  name={item.icon}
                  className="h-8 w-8 text-gold lg:h-[47px] lg:w-[47px]"
                />
              </div>
              <h3 className="flex h-full w-full items-start justify-center text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-ink lg:text-[0.816rem] md:mt-3.5 md:h-auto md:items-center lg:mt-0 lg:h-[50px] lg:leading-snug">
                {item.title}
              </h3>
              <p className="w-full max-w-[12.5rem] text-[0.8rem] leading-6 text-ink-soft md:mt-2.5 lg:mt-0 lg:text-[15.6px] lg:leading-[1.45]">
                {item.lines.map((line, lineIndex) => (
                  <span key={`${item.icon}-${lineIndex}`} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
