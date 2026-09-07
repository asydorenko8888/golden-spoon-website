"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/siteContent";
import BrandMark from "@/components/ui/BrandMark";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Header({ content = site }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const buttonRef = useRef(null);
  const [menuPath, setMenuPath] = useState(pathname);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header data-measure="header" className="sticky top-0 z-50 bg-ivory lg:h-[var(--header-height)]">
      <div className="relative mx-auto flex h-[4.25rem] w-full min-w-0 max-w-[1440px] items-center px-5 pr-4 md:h-[4.75rem] md:px-8 lg:h-full lg:gap-5 lg:px-6">
        <BrandMark lockup name={content.name} />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex"
          aria-label="Primary"
        >
          {content.navigation.map((item) => {
            const isCurrent = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap text-[0.816rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isCurrent ? "text-gold" : "text-ink hover:text-gold"
                }`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.label}
                {isCurrent ? (
                  <span
                    className="absolute top-full left-1/2 mt-1 block h-px w-full -translate-x-1/2 bg-gold"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <Button
          href={content.cta.inquireShort.href}
          variant="goldOutline"
          className="ml-auto inline-flex shrink-0 max-md:min-h-9 max-md:min-w-0 max-md:px-3 max-md:text-[0.744rem] max-md:tracking-[0.16em] md:hidden lg:inline-flex lg:min-h-9 lg:min-w-[6.75rem] lg:px-5"
        >
          {content.cta.inquireShort.label}
        </Button>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-ink max-md:ml-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="relative block h-3 w-6" aria-hidden="true">
            <span
              className={`absolute left-0 block h-px w-full bg-ink transition-transform duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-ink transition-transform duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-line bg-ivory lg:hidden"
      >
        <Container className="flex flex-col py-8">
          <nav aria-label="Mobile" className="flex flex-col">
            {content.navigation.map((item) => {
              const isCurrent = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b border-line py-4 font-serif text-[1.8rem] ${
                    isCurrent ? "text-gold" : "text-ink"
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Button
            href={content.cta.inquire.href}
            className="mt-8 w-full"
            onClick={() => setOpen(false)}
          >
            {content.cta.inquire.label}
          </Button>
        </Container>
      </div>
    </header>
  );
}
