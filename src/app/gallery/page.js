import ValuesStrip from "@/components/about/ValuesStrip";
import EventList from "@/components/gallery/EventList";
import GalleryCta from "@/components/gallery/GalleryCta";
import GalleryHero from "@/components/gallery/GalleryHero";
import { getPublicGalleryEvents } from "@/lib/gallery/getPublicGalleryEvents";
import { galleryPage, site } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Gallery | ${site.shortName} Boutique Catering`,
  description:
    "A glimpse into the events, tables and experiences created by Golden Spoon Boutique Catering.",
};

export default async function GalleryPage() {
  const events = (await getPublicGalleryEvents()).map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    date_label: event.date_label,
    location: event.location,
    caption: event.caption,
    description: event.description,
    cover: event.cover,
  }));

  return (
    <>
      <GalleryHero content={galleryPage.hero} />
      <ValuesStrip items={galleryPage.strip} />
      <EventList events={events} />
      <GalleryCta content={galleryPage.cta} />
    </>
  );
}
