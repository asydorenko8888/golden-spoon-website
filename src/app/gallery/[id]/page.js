import EventStory from "@/components/gallery/EventStory";
import { getPublicGalleryEventById } from "@/lib/gallery/getPublicGalleryEvents";
import { site } from "@/data/siteContent";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = await getPublicGalleryEventById(id);

  if (!event) {
    return { title: `Gallery | ${site.shortName} Boutique Catering` };
  }

  return {
    title: `${event.title} | ${site.shortName} Gallery`,
    description: event.caption || event.description || undefined,
  };
}

export default async function GalleryEventPage({ params }) {
  const { id } = await params;
  const event = await getPublicGalleryEventById(id);

  if (!event) {
    notFound();
  }

  // Shared Real Event template — new CMS events use EventStory automatically.
  return <EventStory event={event} />;
}
