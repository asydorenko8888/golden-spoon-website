"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import EventLightbox from "@/components/gallery/EventLightbox";
import EventVideo from "@/components/gallery/EventVideo";
import { OliveSprig } from "@/components/ui/Ornaments";
import { formatEventDisplayDate, publicEventPhotos } from "@/lib/gallery/events";
import { getEventPresentation } from "@/lib/gallery/eventPresentation";
import { useCallback, useMemo, useState } from "react";

function PhotoFrame({ photo, eventTitle, onOpen, imageClass = "object-[center_55%]" }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${photo.alt_text || eventTitle}`}
      className="relative block h-full w-full min-h-0 min-w-0 overflow-hidden bg-[#d7cfb8] transition-opacity duration-300 hover:opacity-90"
    >
      <img
        src={photo.image_url}
        alt={photo.alt_text || eventTitle}
        className={`absolute inset-0 h-full w-full object-cover ${imageClass}`}
      />
    </button>
  );
}

function rowPattern(count) {
  if (count <= 0) return [];
  if (count <= 3) return [count];

  const rows = [];
  let remaining = count;
  let useTwo = true;

  while (remaining > 0) {
    if (remaining <= 3) {
      rows.push(remaining);
      break;
    }

    const next = useTwo ? 2 : 3;
    rows.push(next);
    remaining -= next;
    useTwo = !useTwo;
  }

  // Keep leftover singles from becoming a full-width row when the previous row has 3.
  // 8 photos stay 2/3/3; 6 photos become 2/2/2 instead of 2/3/1.
  if (rows.length >= 2 && rows.at(-1) === 1 && rows.at(-2) === 3) {
    rows[rows.length - 2] = 2;
    rows[rows.length - 1] = 2;
  }

  return rows;
}

function EventPhotoStory({ photos, eventTitle, onOpen }) {
  const rows = [];
  let offset = 0;

  for (const size of rowPattern(photos.length)) {
    rows.push(photos.slice(offset, offset + size));
    offset += size;
  }

  if (rows.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col gap-2.5">
      {rows.map((row) => {
        const columns = row.length;

        return (
          <div
            key={row.map((photo) => photo.id).join("-")}
            className={`grid gap-2.5 ${
              columns === 1
                ? "grid-cols-1"
                : columns === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-3"
            }`}
          >
            {row.map((photo, index) => (
              <div
                key={photo.id}
                className={
                  columns === 3
                    ? "h-[220px] w-full min-w-0 md:h-[240px] lg:h-[260px]"
                    : "h-[220px] w-full min-w-0 sm:h-[240px] md:h-[260px] lg:h-[280px]"
                }
              >
                <PhotoFrame
                  photo={photo}
                  eventTitle={eventTitle}
                  onOpen={() =>
                    onOpen(photos.findIndex((item) => item.id === photo.id))
                  }
                  imageClass={
                    columns === 2 && index === 1
                      ? "object-[center_22%]"
                      : "object-[center_55%]"
                  }
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function EventPortraitGrid({ photos, eventTitle, onOpen }) {
  if (photos.length === 0) return null;

  return (
    <div className="mt-8 grid grid-cols-1 items-start gap-2.5 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onOpen(index)}
          aria-label={`View ${photo.alt_text || eventTitle}`}
          className="relative block aspect-[3/4] w-full min-w-0 overflow-hidden bg-[#d7cfb8] transition-opacity duration-300 hover:opacity-90"
        >
          <img
            src={photo.image_url}
            alt={photo.alt_text || eventTitle}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </button>
      ))}
    </div>
  );
}

function EventHero({ event, dateLabel, story, featuredMenu, experienceNote }) {
  const metaItems = [
    dateLabel,
    event.location,
    event.client_venue,
    event.role,
  ].filter(Boolean);

  return (
    <header className="min-w-0 w-full">
      <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
        Gallery
      </p>
      <h1 className="mt-2 font-serif text-[1.55rem] leading-[1.08] font-medium tracking-tight text-ink uppercase sm:text-[1.75rem] lg:text-[1.95rem] xl:text-[2.15rem]">
        {event.title}
      </h1>
      <div className="mt-2.5 flex items-center gap-3 lg:mt-3" aria-hidden="true">
        <span className="h-px w-10 bg-gold/70" />
        <OliveSprig className="h-4 w-7 text-[#7C8060]" />
        <span className="h-px w-10 bg-gold/70" />
      </div>

      {metaItems.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.75rem] tracking-[0.08em] text-gold uppercase lg:mt-[1.125rem] lg:flex-nowrap lg:text-[0.76rem] lg:tracking-[0.09em]">
          {metaItems.map((item, index) => (
            <span key={item} className="inline-flex items-center gap-x-3">
              {index > 0 ? (
                <span
                  className="hidden h-3 w-px shrink-0 bg-gold/40 lg:block"
                  aria-hidden="true"
                />
              ) : null}
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {story.length > 0 ? (
        <div className="mt-4 space-y-2.5 text-[0.95rem] leading-7 text-ink lg:mt-5 lg:space-y-3 lg:text-[18px] lg:leading-[1.65]">
          {story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {featuredMenu ? (
        <div className="mt-5 lg:mt-6">
          <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
            Featured Menu
          </p>
          <p className="mt-2 text-[0.95rem] leading-7 text-ink lg:text-[18px] lg:leading-[1.65]">
            {featuredMenu}
          </p>
        </div>
      ) : null}

      {experienceNote ? (
        <p className="mt-4 text-[0.95rem] leading-7 text-ink lg:mt-5 lg:text-[18px] lg:leading-[1.65]">
          {experienceNote}
        </p>
      ) : null}
    </header>
  );
}

export default function EventStory({ event }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const photos = publicEventPhotos(event);
  const dateLabel = formatEventDisplayDate(event);
  const presentation = getEventPresentation(event.id);
  const { photoLayout, featuredMenu } = presentation;

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction) => {
      setLightboxIndex((current) => {
        if (current == null || photos.length < 2) return current;
        return (current + direction + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  const story = useMemo(() => {
    const descriptionParagraphs = (event.description || "")
      .split(/\n\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (featuredMenu) {
      return descriptionParagraphs;
    }

    return [...descriptionParagraphs, event.experience].filter(Boolean);
  }, [event.description, event.experience, featuredMenu]);

  return (
    <article className="overflow-x-clip bg-ivory">
      <Container className="pt-6 pb-10 lg:pt-8 lg:pb-12">
        <div className="mx-auto max-w-[1100px]">
          <EventHero
            event={event}
            dateLabel={dateLabel}
            story={story}
            featuredMenu={featuredMenu}
            experienceNote={featuredMenu ? event.experience : null}
          />

          {photoLayout === "portrait-grid" ? (
            <EventPortraitGrid
              photos={photos}
              eventTitle={event.title}
              onOpen={setLightboxIndex}
            />
          ) : (
            <EventPhotoStory
              photos={photos}
              eventTitle={event.title}
              onOpen={setLightboxIndex}
            />
          )}

          <EventVideo event={event} />

          <Link
            href="/gallery"
            className="mt-8 inline-block text-[0.68rem] font-medium tracking-[0.22em] text-gold uppercase transition-colors duration-300 hover:text-gold-deep lg:mt-10 lg:text-[0.816rem]"
          >
            ← Back to Gallery
          </Link>
        </div>
      </Container>

      {lightboxIndex != null && photos[lightboxIndex] ? (
        <EventLightbox
          photos={photos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      ) : null}
    </article>
  );
}
