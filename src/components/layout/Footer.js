import Link from "next/link";
import { site } from "@/data/siteContent";
import BrandMark from "@/components/ui/BrandMark";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import {
  DEFAULT_COPYRIGHT_NAME,
  DEFAULT_FOOTER_HEADINGS,
  DEFAULT_MOBILE_SERVICE_AREA,
  DEFAULT_MOBILE_SERVICES,
} from "@/lib/settings/content";

export default function Footer({ content = site }) {
  const year = new Date().getFullYear();
  const { phone, email, instagram } = content.contact;
  const headings = content.footer.headings ?? DEFAULT_FOOTER_HEADINGS;
  const mobileServices = content.footer.mobileServices ?? DEFAULT_MOBILE_SERVICES;
  const mobileServiceArea =
    content.footer.mobileServiceArea ?? DEFAULT_MOBILE_SERVICE_AREA;
  const copyrightName = content.copyrightName ?? DEFAULT_COPYRIGHT_NAME;
  const mobileQuickLinks = [
    { href: "/", label: content.navigation[0]?.label ?? "Home" },
    ...content.footer.quickLinks,
  ];

  return (
    <footer className="border-t border-ink/10 bg-ivory-soft">
      <Container className="pt-3 pb-2.5 md:hidden">
        <div className="-mb-1.5 origin-left scale-[0.88] leading-none">
          <BrandMark lockup name={content.name} />
        </div>

        <div className="mt-3.5 grid grid-cols-3 items-start gap-x-3">
          <div className="min-w-0">
            <h2 className="text-[0.696rem] font-medium uppercase tracking-[0.16em] text-gold">
              {headings.explore}
            </h2>
            <ul className="mt-2 space-y-1">
              {mobileQuickLinks.map((item) => (
                <li
                  key={item.label}
                  className="text-[0.864rem] leading-[1.5] text-ink"
                >
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-[0.696rem] font-medium uppercase tracking-[0.16em] text-gold">
              {headings.services}
            </h2>
            <ul className="mt-2 space-y-1">
              {mobileServices.map((item) => (
                <li
                  key={item}
                  className="text-[0.864rem] leading-[1.5] text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-[0.696rem] font-medium uppercase tracking-[0.16em] text-gold">
              {headings.contact}
            </h2>
            <ul className="mt-2 space-y-1 text-[0.864rem] leading-[1.5] text-ink">
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="break-words hover:text-gold"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
              {instagram ? (
                <li>
                  <a
                    href={instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words hover:text-gold"
                  >
                    {instagram.handle}
                  </a>
                </li>
              ) : null}
              {mobileServiceArea.map((item) => (
                <li key={item} className={item === mobileServiceArea[0] ? "pt-1" : undefined}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3.5 border-t border-ink/15 pt-2.5">
          <p className="text-[0.816rem] tracking-wide text-ink/70">
            © {year} {copyrightName}
          </p>
        </div>
      </Container>

      <Container className="hidden py-8 md:block lg:py-9">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_repeat(4,minmax(0,1fr))] lg:gap-x-10 lg:gap-y-0">
          <div>
            <div className="origin-left scale-[0.88] -mb-1">
              <BrandMark lockup name={content.name} />
            </div>
            <p className="mt-3.5 max-w-[17rem] text-[1.05rem] leading-6 text-ink">
              {content.tagline}
            </p>
          </div>

          <div>
            <h2 className="text-[0.816rem] font-medium uppercase tracking-[0.22em] text-gold">
              {headings.quickLinks}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {content.footer.quickLinks.map((item) => (
                <li key={item.label} className="text-[1.05rem] text-ink">
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.816rem] font-medium uppercase tracking-[0.22em] text-gold">
              {headings.services}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {content.footer.services.map((item) => (
                <li key={item} className="text-[1.05rem] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.816rem] font-medium uppercase tracking-[0.22em] text-gold">
              {headings.serviceArea}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {content.footer.serviceArea.map((item) => (
                <li key={item} className="text-[1.05rem] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.816rem] font-medium uppercase tracking-[0.22em] text-gold">
              {headings.contact}
            </h2>
            <div className="mt-3 space-y-1.5 text-[1.05rem] text-ink">
              {phone ? (
                <p>
                  <a href={`tel:${phone.replace(/\D/g, "")}`} className="hover:text-gold">
                    {phone}
                  </a>
                </p>
              ) : (
                <p data-contact-field="phone">Phone — to be confirmed</p>
              )}
              {email ? (
                <p>
                  <a href={`mailto:${email}`} className="hover:text-gold">
                    {email}
                  </a>
                </p>
              ) : (
                <p data-contact-field="email">Email — to be confirmed</p>
              )}
            </div>
            <Button
              href={content.cta.inquireShort.href}
              variant="goldOutline"
              className="mt-4 min-h-10 px-5 text-[0.744rem]"
            >
              {content.cta.inquireShort.label}
            </Button>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-1.5 border-t border-ink/15 pt-3 text-[0.9rem] tracking-wide text-ink/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {content.name}
          </p>
          <p>{content.location}</p>
        </div>
      </Container>
    </footer>
  );
}
