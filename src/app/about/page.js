import AboutHero from "@/components/about/AboutHero";
import FinalCta from "@/components/about/FinalCta";
import OurApproach from "@/components/about/OurApproach";
import OurStory from "@/components/about/OurStory";
import ValuesStrip from "@/components/about/ValuesStrip";
import { getPublicAboutContent } from "@/lib/about/getPublicAboutContent";
import { site } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `About | ${site.shortName} Boutique Catering`,
  description:
    "Golden Spoon was founded to bring the elegance of European cuisine and the warmth of genuine hospitality to South Florida.",
};

export default async function AboutPage() {
  const content = await getPublicAboutContent();

  return (
    <>
      <AboutHero content={content.hero} />
      <ValuesStrip items={content.values} />
      <OurStory content={content.story} />
      <OurApproach content={content.approach} />
      <FinalCta content={content.cta} />
    </>
  );
}
