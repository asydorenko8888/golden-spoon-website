"use client";

import { useCallback, useId, useState } from "react";
import Container from "@/components/ui/Container";
import EventLightbox from "@/components/gallery/EventLightbox";
import { formatEventMeta } from "@/lib/gallery/events";

function collageColumnsClass(count) {
  if (count <= 1) return "columns-1";
  if (count === 2) return "columns-1 sm:columns-2";
  return "columns-1 sm:columns-2 lg:columns-3";
}

function EventPhotoCollage({ photos, eventTitle, onOpen }) {
  return (
    <div
      className={`[column-fill:balance] [column-gap:0.5rem] pt-6 lg:pt-7 ${collageColumnsClass(photos.length)}`}
    >
      {photos.map((photo, photoIndex) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onOpen(photoIndex)}
          aria-label={`View ${photo.alt_text || eventTitle}`}
          className="mb-2 inline-block w-full break-inside-avoid bg-[#d7cfb8] align-top transition-opacity duration-300 hover:opacity-90"
        >
          <img
            src={photo.image_url}
            alt={photo.alt_text}
            className="block h-auto w-full object-contain"
          />
        </button>
      ))}
    </div>
  );
}

export default function EventList({ events }) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState({});
  const [lightbox, setLightbox] = useState(null);

  const lightboxEvent = lightbox
    ? events.find((event) => event.id === lightbox.eventId)
    : null;
  const lightboxPhotos = lightboxEvent?.photos ?? [];

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction) => {
      setLightbox((current) => {
        if (!current) return current;
        const event = events.find((item) => item.id === current.eventId);
        const count = event?.photos.length ?? 0;
        if (count < 2) return current;
        return {
          ...current,
          photoIndex: (current.photoIndex + direction + count) % count,
        };
      });
    },
    [events],
  );

  function toggleEvent(eventId) {
    setOpenIds((current) => ({
      ...current,
      [eventId]: !current[eventId],
    }));
  }

  return (
    <section id="gallery" className="bg-ivory">
      <Container className="pt-7 pb-8 lg:pt-8 lg:pb-10">
        <ul className="border-y border-ink/10">
          {events.map((event) => {
            const isOpen = Boolean(openIds[event.id]);
            const buttonId = `${baseId}-button-${event.id}`;
            const panelId = `${baseId}-panel-${event.id}`;
            const meta = formatEventMeta(event);
            const hasPhotos = event.photos.length > 0;

            return (
              <li key={event.id} className="border-t border-ink/10 first:border-t-0">
                <article className="py-7 md:py-8 lg:py-9">
                  <h2 className="font-serif text-[1.7rem] leading-[1.12] font-medium tracking-tight text-ink uppercase sm:text-[1.95rem] lg:text-[2.35rem]">
                    {event.title}
                  </h2>
                  {meta ? (
                    <p className="mt-2 text-[0.78rem] tracking-[0.08em] text-gold uppercase lg:text-[0.84rem]">
                      {meta}
                    </p>
                  ) : null}
                  <p className="mt-3 max-w-[40rem] text-[0.95rem] leading-7 text-ink lg:text-[18px] lg:leading-[1.7]">
                    {event.description}
                  </p>
                  {hasPhotos ? (
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleEvent(event.id)}
                      className="mt-5 inline-flex min-h-12 items-center text-[0.68rem] font-medium tracking-[0.22em] text-gold uppercase transition-colors duration-300 hover:text-gold-deep lg:text-[0.816rem]"
                    >
                      {isOpen ? "Hide Photos ↑" : "View Photos →"}
                    </button>
                  ) : null}

                  {hasPhotos ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden" inert={isOpen ? undefined : true}>
                        <EventPhotoCollage
                          photos={event.photos}
                          eventTitle={event.title}
                          onOpen={(photoIndex) =>
                            setLightbox({
                              eventId: event.id,
                              photoIndex,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      </Container>

      {lightbox && lightboxPhotos.length > 0 ? (
        <EventLightbox
          photos={lightboxPhotos}
          index={lightbox.photoIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      ) : null}
    </section>
  );
}
