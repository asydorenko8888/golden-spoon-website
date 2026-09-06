import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import FeatureStrip from "@/components/home/FeatureStrip";
import GalleryPreview from "@/components/home/GalleryPreview";
import Hero from "@/components/home/Hero";
import MenusPreview from "@/components/home/MenusPreview";
import SelectedServices from "@/components/home/SelectedServices";
import { getPublicHomeContent } from "@/lib/home/getPublicHomeContent";
import { home } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublicHomeContent();

  return (
    <>
      <Hero content={{ ...content.hero, cta: content.heroCta }} />
      <FeatureStrip items={content.features} />
      <Experience content={home.experience} />
      <SelectedServices content={content.selectedServices} />
      <About content={home.about} />
      <MenusPreview content={home.menus} />
      <GalleryPreview content={home.gallery} />
    </>
  );
}
