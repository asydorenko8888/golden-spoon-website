import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/siteContent";
import { Monogram } from "@/components/ui/Ornaments";

export default function BrandMark({
  compact = false,
  gold = false,
  lockup = false,
  name = site.name,
}) {
  if (lockup) {
    return (
      <Link
        href="/"
        className="relative z-10 inline-flex shrink-0 no-underline"
        aria-label={`${name}, home`}
      >
        <Image
          src="/images/brand/logo-wordmark.png"
          alt=""
          width={292}
          height={68}
          priority
          className="h-[46px] w-auto mix-blend-multiply md:h-[60px] lg:h-10"
        />
      </Link>
    );
  }

  const titleColor = gold ? "text-gold" : "text-ink";
  const subtitleColor = gold ? "text-ink" : "text-ink-soft";

  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3 no-underline"
      aria-label={`${name}, home`}
    >
      <Monogram
        className={`h-11 w-11 shrink-0 text-gold sm:h-12 sm:w-12 ${
          gold ? "lg:h-[52px] lg:w-[52px]" : ""
        }`}
      />
      <span className="flex min-w-0 flex-col">
        <span
          className={`font-serif text-[1.38rem] leading-none tracking-[0.16em] uppercase sm:text-[1.62rem] ${titleColor} ${
            gold ? "lg:text-[1.86rem] lg:tracking-[0.14em] whitespace-nowrap" : ""
          }`}
        >
          {site.shortName}
        </span>
        <span
          className={`mt-1.5 text-[0.624rem] font-medium uppercase tracking-[0.18em] sm:tracking-[0.2em] ${subtitleColor} ${
            compact ? "hidden min-[420px]:block" : ""
          } ${gold ? "lg:mt-2 lg:text-[0.696rem] lg:tracking-[0.22em]" : ""}`}
        >
          {site.descriptor}
        </span>
      </span>
    </Link>
  );
}
