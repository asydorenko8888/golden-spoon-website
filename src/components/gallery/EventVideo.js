"use client";

import { useState } from "react";
import { isPubliclyPlayableGalleryVideo } from "@/lib/gallery/eventMedia";

export default function EventVideo({ event }) {
  const [aspect, setAspect] = useState({ width: 9, height: 16 });
  const src = typeof event?.video_url === "string" ? event.video_url.trim() : "";
  if (!src || !isPubliclyPlayableGalleryVideo(src)) return null;

  const posterCandidate = [
    event.video_poster_url,
    event.cover?.image_url,
  ].find((value) => typeof value === "string" && value.trim() !== "");
  const poster = posterCandidate?.trim() || undefined;
  const path = src.split("?")[0].toLowerCase();
  const type = path.endsWith(".webm")
    ? "video/webm"
    : path.endsWith(".mp4")
      ? "video/mp4"
      : undefined;
  const isPortrait = aspect.width < aspect.height;

  return (
    <section className="mt-8 lg:mt-10">
      <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
        Event Video
      </p>
      <video
        className={
          isPortrait
            ? "mx-auto mt-4 block h-auto w-full max-w-[min(100%,420px)] bg-transparent object-contain lg:mt-5 lg:h-[70vh] lg:w-auto lg:max-w-[400px] lg:max-h-[70vh]"
            : "mx-auto mt-4 block h-auto max-h-[70vh] w-full max-w-full bg-transparent object-contain lg:mt-5 lg:max-w-[75%]"
        }
        style={{ aspectRatio: `${aspect.width} / ${aspect.height}` }}
        controls
        playsInline
        preload="metadata"
        poster={poster}
        onLoadedMetadata={(mediaEvent) => {
          const video = mediaEvent.currentTarget;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            setAspect({ width: video.videoWidth, height: video.videoHeight });
          }
        }}
      >
        <source src={src} type={type} />
      </video>
    </section>
  );
}
