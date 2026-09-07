import Image from "next/image";
import Button from "@/components/ui/Button";

const DEFAULT_SCRIPT = "for South Florida’s most memorable events";
const DEFAULT_COPY =
  "Thoughtfully crafted menus, signature presentation and personalized service for every occasion.";

function normalizeText(value) {
  return (value ?? "").trim().replace(/\.$/, "");
}

function HeroScript({ text = "" }) {
  const scriptClass =
    "mt-2 font-script text-[1.65rem] leading-[1.15] text-gold sm:text-[1.9rem] md:mt-2.5 lg:mt-2 lg:text-[clamp(30px,2.64vw,40.8px)] lg:leading-[1.05]";
  const firstLineClass =
    "block text-[1.8975rem] sm:text-[2.185rem] lg:text-[clamp(34.5px,3.036vw,46.92px)]";

  if (normalizeText(text) === normalizeText(DEFAULT_SCRIPT)) {
    return (
      <p className={scriptClass}>
        <span className={firstLineClass}>
          <span className="text-gold">for </span>
          <span className="text-[#7C8060]">South Florida</span>
          <span className="text-gold">’s</span>
        </span>
        <span className="block text-gold">most memorable events</span>
      </p>
    );
  }

  const marker = "South Florida";
  const index = text.indexOf(marker);

  if (index !== -1) {
    const before = text.slice(0, index);
    let rest = text.slice(index + marker.length);
    let possessive = "";

    if (rest.startsWith("’s") || rest.startsWith("'s")) {
      possessive = rest.startsWith("’s") ? "’s" : "'s";
      rest = rest.slice(2).trim();
    }

    return (
      <p className={scriptClass}>
        <span className={firstLineClass}>
          <span className="text-gold">{before}</span>
          <span className="text-[#7C8060]">{marker}</span>
          <span className="text-gold">{possessive}</span>
        </span>
        {rest ? <span className="block text-gold">{rest}</span> : null}
      </p>
    );
  }

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <p className={scriptClass}>
      {lines.map((line, lineIndex) => (
        <span
          key={`${lineIndex}-${line}`}
          className={`block text-gold ${lineIndex === 0 ? firstLineClass : ""}`}
        >
          {line}
        </span>
      ))}
    </p>
  );
}

function HeroCopy({ text = "" }) {
  const copyClass =
    "mt-2.5 text-[0.95rem] leading-6 text-ink md:mt-3.5 lg:mt-2.5 lg:-translate-y-[10px] lg:text-[18px] lg:leading-[1.45]";

  if (normalizeText(text) === normalizeText(DEFAULT_COPY)) {
    return (
      <p className={copyClass}>
        <span className="block">
          Thoughtfully crafted menus, signature presentation
        </span>
        <span className="block">and personalized service for every occasion.</span>
      </p>
    );
  }

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <p className={copyClass}>
      {lines.map((line, lineIndex) => (
        <span key={`${lineIndex}-${line}`} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

export default function Hero({ content }) {
  return (
    <section
      data-measure="hero"
      className="relative overflow-hidden bg-ivory lg:h-[calc(100svh-var(--header-height)-var(--feature-height))] lg:min-h-0"
    >
      <Image
        src="/images/brand/botanical-left.png"
        alt=""
        width={112}
        height={267}
        className="pointer-events-none absolute top-4 left-0 z-[1] hidden h-[85%] w-auto mix-blend-multiply lg:block"
      />

      <div className="relative lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[45%_55%] lg:items-stretch">
        <div className="relative z-[2] flex flex-col items-start px-5 py-8 sm:px-8 md:py-16 lg:h-full lg:items-center lg:justify-center lg:px-8 lg:py-0">
          <div className="w-full max-w-[34rem] lg:text-center">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-ink lg:text-[14.4px]">
              {content.eyebrow}
            </p>

            <div
              className="relative mx-0 mt-2 h-[14px] w-[90px] overflow-hidden lg:mx-auto lg:mt-2"
              aria-hidden="true"
            >
              <Image
                src="/images/brand/gold-flourish.png"
                alt=""
                width={90}
                height={52}
                className="absolute top-[-34px] left-0 h-[52px] w-[90px] max-w-none mix-blend-multiply"
              />
            </div>

            <h1 className="mt-2.5 font-serif text-[2.45rem] leading-[0.98] font-medium tracking-[-0.01em] text-ink uppercase max-[400px]:text-[2.05rem] md:mt-3 md:text-5xl lg:mt-2.5 lg:text-[clamp(52.8px,4.32vw,67.2px)] lg:leading-[0.95]">
              <span className="block whitespace-nowrap">{content.headline[0]}</span>
              <span className="block">{content.headline[1]}</span>
            </h1>

            <HeroScript text={content.script} />

            <span
              className="mx-0 mt-2.5 block h-1 w-1 rounded-full bg-gold md:mt-3.5 lg:mx-auto lg:mt-2.5"
              aria-hidden="true"
            />

            <HeroCopy text={content.copy} />

            <div className="mt-4 md:mt-6 lg:mt-0 lg:flex lg:justify-center">
              <Button
                href={content.cta.href}
                variant="goldOutline"
                className="min-h-[44px] min-w-[17.5rem] px-8 lg:h-[40px] lg:min-h-[40px] lg:w-[13.3rem] lg:min-w-[13.3rem] lg:px-2 lg:tracking-[0.1em] lg:whitespace-nowrap"
              >
                {content.cta.label}
              </Button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[15rem] min-w-0 sm:min-h-[20rem] lg:h-full lg:min-h-0">
          <div
            data-image-slot={content.image.slot}
            className="absolute inset-0 overflow-hidden bg-ivory [mask-image:linear-gradient(to_right,transparent_0%,black_180px)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_180px)]"
          >
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="h-full w-full object-cover object-[90%_0%]"
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-[180px] bg-gradient-to-r from-ivory from-[20%] via-ivory/55 to-transparent lg:block"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
