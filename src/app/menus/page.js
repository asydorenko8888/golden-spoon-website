import ValuesStrip from "@/components/about/ValuesStrip";
import GalleryCta from "@/components/gallery/GalleryCta";
import CelebrationMenus from "@/components/menus/CelebrationMenus";
import CustomEventMenus from "@/components/menus/CustomEventMenus";
import MenuDisclaimer from "@/components/menus/MenuDisclaimer";
import MenuIntro from "@/components/menus/MenuIntro";
import MenusHero from "@/components/menus/MenusHero";
import YachtCollections from "@/components/menus/YachtCollections";
import { getPublicMenusContent } from "@/lib/menus/getPublicMenusContent";
import { site } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Menus | ${site.shortName} Boutique Catering`,
  description:
    "Thoughtfully planned menus inspired by European flavors and tailored to each event.",
};

export default async function MenusPage() {
  const content = await getPublicMenusContent();

  return (
    <div className="menus-page">
      <MenusHero content={content.hero} />
      <ValuesStrip items={content.strip} />
      <MenuIntro content={content.intro} />
      <YachtCollections content={content.yacht} />
      <CelebrationMenus content={content.celebrations} />
      <CustomEventMenus sections={content.customEvents} />
      <MenuDisclaimer copy={content.disclaimer} />
      <GalleryCta content={content.cta} />
    </div>
  );
}
