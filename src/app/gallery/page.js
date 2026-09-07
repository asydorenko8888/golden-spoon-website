import ValuesStrip from "@/components/about/ValuesStrip";
import EditorialGallery from "@/components/gallery/EditorialGallery";
import GalleryCta from "@/components/gallery/GalleryCta";
import GalleryHero from "@/components/gallery/GalleryHero";
import { getPublicGalleryImages } from "@/lib/gallery/getPublicGalleryImages";
import { galleryPage, site } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Gallery | ${site.shortName} Boutique Catering`,
  description:
    "A glimpse into the events, tables and experiences created by Golden Spoon Boutique Catering.",
};

export default async function GalleryPage() {
  const images = await getPublicGalleryImages();

  return (
    <>
      <GalleryHero content={galleryPage.hero} />
      <ValuesStrip items={galleryPage.strip} />
      <EditorialGallery images={images} />
      <script src="/gallery-lightbox.js" defer />
      <GalleryCta content={galleryPage.cta} />
    </>
  );
}
