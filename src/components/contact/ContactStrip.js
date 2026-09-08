import Container from "@/components/ui/Container";
import { FeatureIcon } from "@/components/ui/Ornaments";

export default function ContactStrip({ items }) {
  return (
    <section className="border-y border-ink/10 bg-ivory-warm lg:box-border lg:h-[calc((100vh-var(--header-height))*0.28)] lg:min-h-0">
      <Container className="py-0 md:py-9 lg:flex lg:h-full lg:items-center lg:py-0">
        <ul className="grid w-full grid-cols-2 lg:h-full lg:grid-cols-4 lg:items-stretch">
          {items.map((item, index) => (
            <li
              key={item.title}
              className={`grid min-h-0 grid-rows-[auto_auto_auto] content-start items-start justify-items-center text-center sm:px-6 md:flex md:grid-rows-none md:flex-col md:items-center md:gap-y-0 md:py-6 lg:h-full lg:justify-center lg:px-7 lg:py-0 ${
                item.actions?.length
                  ? "gap-y-0.5 px-2 py-1.5"
                  : "gap-y-1 px-3 py-2"
              } ${index % 2 === 1 ? "border-l border-ink/10" : ""} ${
                index > 1 ? "border-t border-ink/10 lg:border-t-0" : ""
              } ${index > 0 ? "lg:border-l lg:border-ink/10" : ""}`}
            >
              <FeatureIcon name={item.icon} className="h-8 w-8 text-gold lg:h-9 lg:w-9" />
              <h3 className="flex h-auto w-full items-start justify-center text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-ink lg:text-[0.816rem] md:mt-3 md:h-auto lg:mt-2">
                {item.title}
              </h3>
              <p className="max-w-[13rem] text-[0.8rem] leading-6 text-ink-soft md:mt-2 lg:mt-1.5 lg:text-[15.6px] lg:leading-[1.45]">
                {item.href ? (
                  <a
                    href={item.href}
                    className="transition-colors hover:text-gold"
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </a>
                ) : (
                  item.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))
                )}
              </p>
              {item.actions?.length ? (
                <nav
                  aria-label={`${item.title} actions`}
                  className="mt-0.5 flex w-full min-w-0 flex-nowrap items-center justify-center gap-x-0.5 whitespace-nowrap md:mt-2 lg:mt-1.5 lg:max-w-[13rem]"
                >
                  {item.actions.map((action, actionIndex) => (
                    <span
                      key={action.label}
                      className="inline-flex shrink-0 items-center"
                    >
                      {actionIndex > 0 ? (
                        <span
                          className="px-0.5 text-[0.6rem] leading-none text-ink/25 lg:px-1 lg:text-[0.72rem]"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                      ) : null}
                      <a
                        href={action.href}
                        className="inline-flex min-h-10 items-center px-0.5 text-[0.6rem] font-medium tracking-[0.06em] text-gold uppercase transition-colors hover:text-gold-deep lg:min-h-0 lg:px-1 lg:py-0.5 lg:text-[0.72rem] lg:tracking-[0.14em]"
                        {...(action.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {action.label}
                      </a>
                    </span>
                  ))}
                </nav>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
