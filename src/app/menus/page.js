import ValuesStrip from "@/components/about/ValuesStrip";
import GalleryCta from "@/components/gallery/GalleryCta";
import CustomMenu from "@/components/menus/CustomMenu";
import MenuCollections from "@/components/menus/MenuCollections";
import MenusHero from "@/components/menus/MenusHero";
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
    <>
      <MenusHero content={content.hero} />
      <ValuesStrip items={content.strip} />
      <MenuCollections content={content.collections} />
      <CustomMenu content={content.custom} />
      <GalleryCta content={content.cta} />
    </>
  );
}
