"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { formatEventDisplayDate } from "@/lib/gallery/events";
import { getEventPresentation } from "@/lib/gallery/eventPresentation";

function eventExcerpt(event) {
  return (event.caption || event.description || "").trim();
}

function EventCover({ event }) {
  const cover = event.cover;
  const { coverPosition } = getEventPresentation(event.id);

  if (!cover) {
    return <div className="aspect-[4/3] bg-[#d7cfb8]" />;
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#d7cfb8]">
      <img
        src={cover.image_url}
        alt={cover.alt_text || event.title}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: coverPosition }}
      />
    </div>
  );
}

export default function EventList({ events }) {
  return (
    <section id="gallery" className="bg-ivory">
      <Container className="pt-7 pb-8 lg:pt-8 lg:pb-10">
        <ul className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:gap-x-8">
          {events.map((event) => {
            const dateLabel = formatEventDisplayDate(event);
            const excerpt = eventExcerpt(event);
            const href = `/gallery/${event.id}`;
            const meta = [event.location, dateLabel].filter(Boolean).join(" · ");

            return (
              <li key={event.id} className="flex min-w-0 w-full flex-col">
                <Link href={href} className="group flex flex-col">
                  <EventCover event={event} />
                  <h2 className="mt-4 line-clamp-2 h-[3.05rem] font-serif text-[1.35rem] leading-[1.12] font-medium tracking-tight text-ink uppercase sm:h-[3.25rem] sm:text-[1.45rem] lg:h-[3.47rem] lg:text-[1.55rem]">
                    {event.title}
                  </h2>
                  <p className="mt-2 h-[1.15rem] text-[0.72rem] tracking-[0.08em] text-gold uppercase lg:text-[0.78rem]">
                    {meta}
                  </p>
                  <p className="mt-3 line-clamp-2 h-[3rem] text-[0.9rem] leading-6 text-ink lg:h-[3.1rem] lg:text-[16px] lg:leading-[1.55]">
                    {excerpt}
                  </p>
                </Link>
                <div className="mt-4">
                  <Button
                    href={href}
                    variant="goldOutline"
                    className="min-h-10 px-6 lg:h-10 lg:min-h-10"
                  >
                    View Event
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
