"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDefaultGalleryItems } from "@/lib/gallery/layout";

const BUCKET = "gallery";
const MAX_BYTES = 6 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DEFAULTS = getDefaultGalleryItems();

function sortImages(items) {
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

function extensionFor(file) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function slotLabel(slot) {
  return slot.replace(/^gallery-/, "").replace(/-/g, " ");
}

export default function GalleryManager() {
  const extraInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [replaceSlot, setReplaceSlot] = useState(null);
  const [message, setMessage] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [draftAlts, setDraftAlts] = useState({});

  const overrides = new Map(
    images.filter((row) => row.slot).map((row) => [row.slot, row]),
  );
  const extras = sortImages(images.filter((row) => !row.slot));

  function showMessage(type, text) {
    setMessage({ type, text });
  }

  async function loadImages() {
    const supabase = createClient();
    const withSlot = await supabase
      .from("gallery_images")
      .select("id, image_url, storage_path, alt_text, sort_order, slot")
      .order("sort_order", { ascending: true });

    let rows;
    if (withSlot.error) {
      const withoutSlot = await supabase
        .from("gallery_images")
        .select("id, image_url, storage_path, alt_text, sort_order")
        .order("sort_order", { ascending: true });

      if (withoutSlot.error) {
        const detail = [withoutSlot.error.message, withoutSlot.error.hint]
          .filter(Boolean)
          .join(" ");
        throw new Error(detail || "Unknown Supabase error");
      }

      rows = (withoutSlot.data ?? []).map((row) => ({ ...row, slot: null }));
    } else {
      rows = withSlot.data ?? [];
    }

    const sorted = sortImages(rows);
    setImages(sorted);
    setDraftAlts(
      Object.fromEntries(sorted.map((row) => [row.id, row.alt_text ?? ""])),
    );
  }

  useEffect(() => {
    let active = true;

    loadImages()
      .catch((error) => {
        if (active) {
          const detail =
            error instanceof Error ? error.message : "Unknown Supabase error";
          showMessage("error", `Could not load gallery images. ${detail}`);
          console.error("Gallery load failed:", error);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function uploadFile(file) {
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error("Use a JPG, PNG, or WEBP image.");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Image must be 6 MB or smaller.");
    }

    const supabase = createClient();
    const path = `${crypto.randomUUID()}.${extensionFor(file)}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error("Upload failed. Check the storage bucket and try again.");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return { path, publicUrl, supabase };
  }

  async function onUploadExtra(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const { path, publicUrl, supabase } = await uploadFile(file);
      const nextOrder =
        images.length === 0
          ? 10
          : Math.max(10, ...images.map((item) => item.sort_order)) + 1;

      const extraRow = {
        image_url: publicUrl,
        storage_path: path,
        alt_text: "",
        sort_order: nextOrder,
      };
      const withSlot = await supabase
        .from("gallery_images")
        .insert({ ...extraRow, slot: null });
      const insertResult = withSlot.error
        ? await supabase.from("gallery_images").insert(extraRow)
        : withSlot;

      if (insertResult.error) {
        await supabase.storage.from(BUCKET).remove([path]);
        throw new Error(
          insertResult.error.message ||
            "The image uploaded, but saving it to the gallery failed.",
        );
      }

      await loadImages();
      showMessage("success", "Image uploaded as an additional gallery item.");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function onReplaceSlot(event) {
    const file = event.target.files?.[0];
    const slot = replaceSlot;
    event.target.value = "";
    setReplaceSlot(null);
    if (!file || !slot) return;

    setUploading(true);
    setMessage(null);

    try {
      const { path, publicUrl, supabase } = await uploadFile(file);
      const existing = overrides.get(slot);
      const slotIndex = DEFAULTS.findIndex((item) => item.slot === slot);

      if (existing) {
        const { error } = await supabase
          .from("gallery_images")
          .update({
            image_url: publicUrl,
            storage_path: path,
            alt_text: existing.alt_text ?? "",
          })
          .eq("id", existing.id);

        if (error) {
          await supabase.storage.from(BUCKET).remove([path]);
          throw new Error(error.message || "Could not replace this gallery photo.");
        }

        if (existing.storage_path) {
          await supabase.storage.from(BUCKET).remove([existing.storage_path]);
        }
      } else {
        const { error } = await supabase.from("gallery_images").insert({
          image_url: publicUrl,
          storage_path: path,
          alt_text: "",
          sort_order: slotIndex + 1,
          slot,
        });

        if (error) {
          await supabase.storage.from(BUCKET).remove([path]);
          throw new Error(
            error.message ||
              "Could not replace this photo. Run supabase/migrations/003_gallery_slot.sql if the slot column is missing.",
          );
        }
      }

      await loadImages();
      showMessage("success", "Website photo replaced.");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Replace failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function onRestoreDefault(slot) {
    const existing = overrides.get(slot);
    if (!existing) return;
    const confirmed = window.confirm(
      "Restore the original website photo in this slot?",
    );
    if (!confirmed) return;

    setBusyId(existing.id);
    setMessage(null);

    const supabase = createClient();
    if (existing.storage_path) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([existing.storage_path]);
      if (storageError) {
        setBusyId(null);
        showMessage("error", "Could not remove the uploaded file.");
        return;
      }
    }

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", existing.id);

    if (error) {
      setBusyId(null);
      showMessage("error", error.message || "Could not restore the original photo.");
      return;
    }

    try {
      await loadImages();
      showMessage("success", "Original website photo restored.");
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(image) {
    const confirmed = window.confirm("Delete this additional image from the website?");
    if (!confirmed) return;

    const previous = images;
    setBusyId(image.id);
    setImages((current) => current.filter((item) => item.id !== image.id));
    setMessage(null);

    const supabase = createClient();
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([image.storage_path]);

    if (storageError) {
      setImages(previous);
      setBusyId(null);
      showMessage("error", "Could not delete the file. The image was left in place.");
      return;
    }

    const { error: deleteError } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", image.id);

    if (deleteError) {
      setImages(previous);
      setBusyId(null);
      showMessage(
        "error",
        "The file was removed, but the gallery record could not be deleted.",
      );
      return;
    }

    setBusyId(null);
    showMessage("success", "Image deleted.");
  }

  async function moveImage(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= extras.length) return;

    const current = extras[index];
    const neighbor = extras[target];
    const previous = images;

    setImages((items) =>
      sortImages(
        items.map((item) => {
          if (item.id === current.id) return { ...item, sort_order: neighbor.sort_order };
          if (item.id === neighbor.id) return { ...item, sort_order: current.sort_order };
          return item;
        }),
      ),
    );
    setBusyId(current.id);
    setMessage(null);

    const supabase = createClient();
    const updates = await Promise.all([
      supabase
        .from("gallery_images")
        .update({ sort_order: neighbor.sort_order })
        .eq("id", current.id),
      supabase
        .from("gallery_images")
        .update({ sort_order: current.sort_order })
        .eq("id", neighbor.id),
    ]);

    if (updates.some((result) => result.error)) {
      setImages(previous);
      setBusyId(null);
      showMessage("error", "Could not update the image order.");
      return;
    }

    setBusyId(null);
  }

  async function saveAlt(image) {
    const nextAlt = (draftAlts[image.id] ?? "").trim();
    if (nextAlt === (image.alt_text ?? "")) return;

    setBusyId(image.id);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_images")
      .update({ alt_text: nextAlt })
      .eq("id", image.id);

    if (error) {
      setDraftAlts((current) => ({ ...current, [image.id]: image.alt_text ?? "" }));
      setBusyId(null);
      showMessage("error", "Could not save the alt text.");
      return;
    }

    setImages((current) =>
      current.map((item) =>
        item.id === image.id ? { ...item, alt_text: nextAlt } : item,
      ),
    );
    setBusyId(null);
    showMessage("success", "Alt text saved.");
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Gallery
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Manage images displayed on the Golden Spoon website. The designed collage
        stays in place. Uploads add or replace one photo at a time.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          ref={extraInputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={onUploadExtra}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={onReplaceSlot}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => extraInputRef.current?.click()}
          className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#9a7b45] disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
        <p className="text-xs text-neutral-500">
          JPG, PNG, or WEBP. Max 6 MB. Adds one extra item after the current collage.
        </p>
      </div>

      {message ? (
        <p
          className={`mt-4 text-sm ${
            message.type === "error" ? "text-red-700" : "text-emerald-700"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading gallery…</p>
      ) : (
        <>
          <h2 className="mt-10 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
            Website collage
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Replace or restore each designed photo individually.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {DEFAULTS.map((item) => {
              const override = overrides.get(item.slot);
              const preview = override?.image_url ?? item.src;
              const alt = override?.alt_text || item.alt;

              return (
                <li
                  key={item.slot}
                  className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt={alt} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-3 px-4 py-4">
                    <p className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
                      {slotLabel(item.slot)}
                      {override ? " · replaced" : " · original"}
                    </p>
                    {override ? (
                      <label className="block">
                        <span className="mb-1 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                          Alt text
                        </span>
                        <input
                          type="text"
                          value={draftAlts[override.id] ?? ""}
                          onChange={(event) =>
                            setDraftAlts((current) => ({
                              ...current,
                              [override.id]: event.target.value,
                            }))
                          }
                          onBlur={() => saveAlt(override)}
                          disabled={busyId === override.id}
                          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#B5935A]"
                          placeholder="Optional description"
                        />
                      </label>
                    ) : null}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => {
                          setReplaceSlot(item.slot);
                          replaceInputRef.current?.click();
                        }}
                        className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-700 disabled:opacity-40"
                      >
                        Replace
                      </button>
                      {override ? (
                        <button
                          type="button"
                          disabled={busyId === override.id}
                          onClick={() => onRestoreDefault(item.slot)}
                          className="text-xs text-red-700 hover:underline disabled:opacity-40"
                        >
                          Restore original
                        </button>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <h2 className="mt-10 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
            Additional images
          </h2>
          {extras.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">
              No extra images yet. Use Upload Image to add one item after the collage.
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {extras.map((image, index) => (
                <li
                  key={image.id}
                  className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.image_url}
                      alt={image.alt_text || ""}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3 px-4 py-4">
                    <label className="block">
                      <span className="mb-1 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                        Alt text
                      </span>
                      <input
                        type="text"
                        value={draftAlts[image.id] ?? ""}
                        onChange={(event) =>
                          setDraftAlts((current) => ({
                            ...current,
                            [image.id]: event.target.value,
                          }))
                        }
                        onBlur={() => saveAlt(image)}
                        disabled={busyId === image.id}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#B5935A]"
                        placeholder="Optional description"
                      />
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={index === 0 || busyId === image.id}
                          onClick={() => moveImage(index, -1)}
                          className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-700 disabled:opacity-40"
                        >
                          Move up
                        </button>
                        <button
                          type="button"
                          disabled={index === extras.length - 1 || busyId === image.id}
                          onClick={() => moveImage(index, 1)}
                          className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-700 disabled:opacity-40"
                        >
                          Move down
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={busyId === image.id}
                        onClick={() => onDelete(image)}
                        className="text-xs text-red-700 hover:underline disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
