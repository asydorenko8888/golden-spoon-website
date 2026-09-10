const GALLERY_BUCKET = "gallery";
const PUBLIC_MARKER = `/storage/v1/object/public/${GALLERY_BUCKET}/`;

export function galleryStoragePathFromUrl(url) {
  if (typeof url !== "string" || url.trim() === "") {
    return null;
  }

  const index = url.indexOf(PUBLIC_MARKER);
  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + PUBLIC_MARKER.length).split("?")[0]);
}

export function isMissingGalleryVideoColumnError(error) {
  const text = `${error?.message || ""} ${error?.code || ""} ${error?.details || ""}`;
  return /video_url|video_poster_url|42703/i.test(text);
}

export const VIDEO_CONVERT_ERROR =
  "This video could not be converted to a browser-compatible format. Please try another file.";

export function isPubliclyPlayableGalleryVideo(url) {
  const path = String(url || "").split("?")[0].toLowerCase();
  if (!path) return false;
  return !path.endsWith(".mov");
}

export async function preparePlayableEventVideo(file) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/gallery/prepare-event-video", {
    method: "POST",
    body,
    credentials: "same-origin",
  });

  if (!response.ok) {
    let message = VIDEO_CONVERT_ERROR;
    try {
      const data = await response.json();
      if (typeof data?.error === "string" && data.error.trim()) {
        message = data.error;
      }
    } catch {
      // Keep the default conversion error.
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const filename = response.headers.get("X-Video-Filename") || "event-video.mp4";
  const contentType = (response.headers.get("Content-Type") || "video/mp4").split(";")[0];
  return new File([blob], filename, { type: contentType });
}
