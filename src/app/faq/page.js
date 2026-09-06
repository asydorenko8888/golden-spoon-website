import ValuesStrip from "@/components/about/ValuesStrip";
import GalleryCta from "@/components/gallery/GalleryCta";
import FaqHero from "@/components/faq/FaqHero";
import FaqSection from "@/components/faq/FaqSection";
import { getPublicFaqContent } from "@/lib/faq/getPublicFaqContent";
import { site } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `FAQ | ${site.shortName} Boutique Catering`,
  description:
    "Helpful information about Golden Spoon catering, services and planning your event.",
};

export default async function FaqPage() {
  const content = await getPublicFaqContent();

  return (
    <>
      <FaqHero content={content.hero} />
      <ValuesStrip items={content.strip} />
      <FaqSection intro={content.intro} items={content.items} />
      <GalleryCta content={content.cta} />
    </>
  );
}
