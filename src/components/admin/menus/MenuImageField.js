"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MENU_IMAGE_ACCEPT,
  removeUploadedMenuImage,
  uploadMenuImage,
} from "@/lib/menus/storage";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#B5935A]";

export default function MenuImageField({
  id,
  image,
  folder,
  onChange,
  onError,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function onFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    onError?.(null);

    try {
      const supabase = createClient();
      const uploaded = await uploadMenuImage(supabase, file, folder);
      await removeUploadedMenuImage(supabase, image);
      onChange({
        ...image,
        src: uploaded.src,
        storagePath: uploaded.storagePath,
        width: uploaded.width,
        height: uploaded.height,
        alt: image.alt || file.name,
      });
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Could not upload the image.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
        Image
      </span>
      {image?.src ? (
        <div className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt || ""}
            className="mx-auto max-h-64 w-auto max-w-full object-contain"
          />
        </div>
      ) : (
        <p className="text-sm text-neutral-500">No image yet.</p>
      )}
      <label htmlFor={`${id}-alt`} className="block">
        <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
          Image alt text
        </span>
        <input
          id={`${id}-alt`}
          type="text"
          value={image?.alt || ""}
          onChange={(event) => onChange({ ...image, alt: event.target.value })}
          className={inputClass}
        />
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={MENU_IMAGE_ACCEPT}
        className="sr-only"
        onChange={onFileChange}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase disabled:opacity-60"
      >
        {uploading ? "Uploading…" : image?.src ? "Replace image" : "Upload image"}
      </button>
    </div>
  );
}
