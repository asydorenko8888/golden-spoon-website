"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { formatGalleryEventDate } from "@/lib/gallery/events";

const BUCKET = "gallery";
const MAX_BYTES = 6 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const emptyForm = {
  id: null,
  title: "",
  event_date: "",
  location: "",
  description: "",
  sort_order: 0,
  photos: [],
};

function sortByOrder(items) {
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

function extensionFor(file) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function validateImageFile(file) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, or WEBP image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 6 MB or smaller.");
  }
}

function emptyToNull(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed === "" ? null : trimmed;
}

function Field({ id, label, hint, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-neutral-500">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#B5935A]";

export default function GalleryEventsManager() {
  const fileInputRef = useRef(null);
  const supabaseConfigured = Boolean(getSupabaseEnv());
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(supabaseConfigured);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(
    supabaseConfigured
      ? null
      : {
          type: "error",
          text: "Supabase is not configured. Add the environment variables to manage Gallery events.",
        },
  );
  const [draftAlts, setDraftAlts] = useState({});
  const [pendingFiles, setPendingFiles] = useState([]);

  function showMessage(type, text) {
    setMessage({ type, text });
  }

  async function fetchEvents() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_events")
      .select(
        "id, title, event_date, location, description, sort_order, gallery_event_photos!event_id(id, event_id, image_url, storage_path, alt_text, sort_order)",
      )
      .order("sort_order", { ascending: true })
      .order("sort_order", {
        referencedTable: "gallery_event_photos",
        ascending: true,
      });

    if (error) {
      throw new Error(
        error.message ||
          "Could not load gallery events. Run supabase/migrations/011_gallery_events.sql if the tables are missing.",
      );
    }

    return sortByOrder(
      (data ?? []).map((event) => ({
        ...event,
        photos: sortByOrder(event.gallery_event_photos ?? []),
      })),
    );
  }

  async function loadEvents() {
    const rows = await fetchEvents();
    setEvents(rows);
    return rows;
  }

  useEffect(() => {
    if (!supabaseConfigured) {
      return undefined;
    }

    let active = true;

    async function load() {
      try {
        const rows = await fetchEvents();
        if (active) {
          setEvents(rows);
        }
      } catch (error) {
        if (active) {
          showMessage(
            "error",
            error instanceof Error ? error.message : "Could not load gallery events.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [supabaseConfigured]);

  function openCreate() {
    setForm({ ...emptyForm });
    setDraftAlts({});
    setPendingFiles([]);
    setMessage(null);
    setView("form");
  }

  function openEdit(event) {
    setForm({
      id: event.id,
      title: event.title ?? "",
      event_date: event.event_date ?? "",
      location: event.location ?? "",
      description: event.description ?? "",
      sort_order: event.sort_order ?? 0,
      photos: sortByOrder(event.photos ?? []),
    });
    setDraftAlts(
      Object.fromEntries(
        (event.photos ?? []).map((photo) => [photo.id, photo.alt_text ?? ""]),
      ),
    );
    setPendingFiles([]);
    setMessage(null);
    setView("form");
  }

  function backToList() {
    pendingFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setPendingFiles([]);
    setView("list");
  }

  async function uploadFile(supabase, eventId, file) {
    validateImageFile(file);

    const path = `events/${eventId}/${crypto.randomUUID()}.${extensionFor(file)}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
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

    return { path, publicUrl };
  }

  async function persistPhotos(supabase, eventId, files, startingOrder) {
    let sortOrder = startingOrder;
    const uploaded = [];

    for (let index = 0; index < files.length; index += 1) {
      setUploadStatus(`Uploading ${index + 1} of ${files.length}…`);
      const file = files[index];
      const { path, publicUrl } = await uploadFile(supabase, eventId, file);
      sortOrder += 1;

      const { data, error } = await supabase
        .from("gallery_event_photos")
        .insert({
          event_id: eventId,
          image_url: publicUrl,
          storage_path: path,
          alt_text: "",
          sort_order: sortOrder,
        })
        .select("id, event_id, image_url, storage_path, alt_text, sort_order")
        .single();

      if (error) {
        await supabase.storage.from(BUCKET).remove([path]);
        throw new Error(
          error.message || "The image uploaded, but saving it to the event failed.",
        );
      }

      uploaded.push(data);
    }

    return uploaded;
  }

  async function onSave(event) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      showMessage("error", "Title is required.");
      return;
    }

    setSaving(true);
    setMessage(null);
    const wasCreate = !form.id;

    try {
      const supabase = createClient();
      let eventId = form.id;
      let sortOrder = form.sort_order;

      if (wasCreate) {
        const nextOrder =
          events.length === 0
            ? 1
            : Math.max(...events.map((item) => item.sort_order)) + 1;
        sortOrder = nextOrder;

        const { data, error } = await supabase
          .from("gallery_events")
          .insert({
            title,
            event_date: emptyToNull(form.event_date),
            location: emptyToNull(form.location),
            description: emptyToNull(form.description),
            sort_order: nextOrder,
            updated_at: new Date().toISOString(),
          })
          .select("id, title, event_date, location, description, sort_order")
          .single();

        if (error) {
          throw new Error(
            error.message ||
              "Could not create the event. Run supabase/migrations/011_gallery_events.sql if the tables are missing.",
          );
        }

        eventId = data.id;
        setForm((current) => ({
          ...current,
          ...data,
          event_date: data.event_date ?? "",
          location: data.location ?? "",
          description: data.description ?? "",
        }));
      } else {
        const { error } = await supabase
          .from("gallery_events")
          .update({
            title,
            event_date: emptyToNull(form.event_date),
            location: emptyToNull(form.location),
            description: emptyToNull(form.description),
            updated_at: new Date().toISOString(),
          })
          .eq("id", eventId);

        if (error) {
          throw new Error(error.message || "Could not save the event.");
        }
      }

      if (pendingFiles.length > 0) {
        setUploading(true);
        const currentMax =
          form.photos.length === 0
            ? 0
            : Math.max(...form.photos.map((photo) => photo.sort_order));
        const uploaded = await persistPhotos(
          supabase,
          eventId,
          pendingFiles.map((item) => item.file),
          currentMax,
        );
        pendingFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        setPendingFiles([]);
        setForm((current) => ({
          ...current,
          id: eventId,
          sort_order: sortOrder,
          photos: sortByOrder([...(current.photos ?? []), ...uploaded]),
        }));
        setDraftAlts((current) => ({
          ...current,
          ...Object.fromEntries(uploaded.map((photo) => [photo.id, photo.alt_text ?? ""])),
        }));
      }

      await loadEvents();
      showMessage("success", wasCreate ? "Event created." : "Event saved.");
      setForm((current) => ({ ...current, id: eventId, sort_order: sortOrder }));
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Could not save the event.",
      );
    } finally {
      setSaving(false);
      setUploading(false);
      setUploadStatus("");
    }
  }

  async function onUploadSelected(event) {
    const selected = [...(event.target.files ?? [])];
    event.target.value = "";
    if (selected.length === 0) return;

    const files = [];
    const rejected = [];
    for (const file of selected) {
      try {
        validateImageFile(file);
        files.push(file);
      } catch (error) {
        rejected.push(
          `${file.name}: ${error instanceof Error ? error.message : "Invalid image."}`,
        );
      }
    }

    if (rejected.length > 0) {
      showMessage("error", rejected[0]);
    }
    if (files.length === 0) return;

    if (!form.id) {
      setPendingFiles((current) => [
        ...current,
        ...files.map((file) => ({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ]);
      if (rejected.length === 0) {
        setMessage(null);
      }
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const currentMax =
        form.photos.length === 0
          ? 0
          : Math.max(...form.photos.map((photo) => photo.sort_order));
      const uploaded = await persistPhotos(supabase, form.id, files, currentMax);
      setForm((current) => ({
        ...current,
        photos: sortByOrder([...(current.photos ?? []), ...uploaded]),
      }));
      setDraftAlts((current) => ({
        ...current,
        ...Object.fromEntries(uploaded.map((photo) => [photo.id, photo.alt_text ?? ""])),
      }));
      await loadEvents();
      showMessage(
        "success",
        uploaded.length === 1 ? "Photo uploaded." : `${uploaded.length} photos uploaded.`,
      );
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Could not upload photos.",
      );
    } finally {
      setUploading(false);
      setUploadStatus("");
    }
  }

  function removePendingFile(id) {
    setPendingFiles((current) => {
      const next = current.filter((item) => item.id !== id);
      const removed = current.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  }

  async function saveAlt(photo) {
    const nextAlt = (draftAlts[photo.id] ?? "").trim();
    if ((photo.alt_text ?? "") === nextAlt) return;

    setBusyId(photo.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_event_photos")
      .update({ alt_text: nextAlt })
      .eq("id", photo.id);

    if (error) {
      setBusyId(null);
      showMessage("error", "Could not save the alt text.");
      return;
    }

    setForm((current) => ({
      ...current,
      photos: current.photos.map((item) =>
        item.id === photo.id ? { ...item, alt_text: nextAlt } : item,
      ),
    }));
    setBusyId(null);
    showMessage("success", "Alt text saved.");
  }

  async function movePhoto(index, direction) {
    const neighbor = form.photos[index + direction];
    const current = form.photos[index];
    if (!neighbor || !current) return;

    setBusyId(current.id);
    const previous = form.photos;
    const swapped = sortByOrder(
      form.photos.map((photo) => {
        if (photo.id === current.id) return { ...photo, sort_order: neighbor.sort_order };
        if (photo.id === neighbor.id) return { ...photo, sort_order: current.sort_order };
        return photo;
      }),
    );
    setForm((item) => ({ ...item, photos: swapped }));

    const supabase = createClient();
    const first = await supabase
      .from("gallery_event_photos")
      .update({ sort_order: neighbor.sort_order })
      .eq("id", current.id);
    const second = await supabase
      .from("gallery_event_photos")
      .update({ sort_order: current.sort_order })
      .eq("id", neighbor.id);

    if (first.error || second.error) {
      setForm((item) => ({ ...item, photos: previous }));
      setBusyId(null);
      showMessage("error", "Could not reorder photos.");
      return;
    }

    setBusyId(null);
  }

  async function deletePhoto(photo) {
    const confirmed = window.confirm("Delete this photo from the event?");
    if (!confirmed) return;

    const previous = form.photos;
    setBusyId(photo.id);
    setForm((current) => ({
      ...current,
      photos: current.photos.filter((item) => item.id !== photo.id),
    }));
    setMessage(null);

    const supabase = createClient();
    if (photo.storage_path) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([photo.storage_path]);
      if (storageError) {
        setForm((current) => ({ ...current, photos: previous }));
        setBusyId(null);
        showMessage("error", "Could not delete the file. The photo was left in place.");
        return;
      }
    }

    const { error } = await supabase
      .from("gallery_event_photos")
      .delete()
      .eq("id", photo.id);

    if (error) {
      setForm((current) => ({ ...current, photos: previous }));
      setBusyId(null);
      showMessage(
        "error",
        "The file was removed, but the photo record could not be deleted.",
      );
      return;
    }

    setBusyId(null);
    await loadEvents();
    showMessage("success", "Photo deleted.");
  }

  async function moveEvent(index, direction) {
    const neighbor = events[index + direction];
    const current = events[index];
    if (!neighbor || !current) return;

    setBusyId(current.id);
    const previous = events;
    setEvents(
      sortByOrder(
        events.map((item) => {
          if (item.id === current.id) return { ...item, sort_order: neighbor.sort_order };
          if (item.id === neighbor.id) return { ...item, sort_order: current.sort_order };
          return item;
        }),
      ),
    );

    const supabase = createClient();
    const first = await supabase
      .from("gallery_events")
      .update({
        sort_order: neighbor.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id);
    const second = await supabase
      .from("gallery_events")
      .update({
        sort_order: current.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", neighbor.id);

    if (first.error || second.error) {
      setEvents(previous);
      setBusyId(null);
      showMessage("error", "Could not reorder events.");
      return;
    }

    setBusyId(null);
  }

  async function deleteEvent(event) {
    const confirmed = window.confirm(
      `Delete “${event.title}” and all of its photos from the website? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusyId(event.id);
    setMessage(null);

    const supabase = createClient();
    const paths = (event.photos ?? [])
      .map((photo) => photo.storage_path)
      .filter(Boolean);

    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
      if (storageError) {
        setBusyId(null);
        showMessage(
          "error",
          "Could not delete the event photos from storage. The event was left in place.",
        );
        return;
      }
    }

    const { error } = await supabase.from("gallery_events").delete().eq("id", event.id);
    if (error) {
      setBusyId(null);
      showMessage(
        "error",
        "The photos were removed, but the event record could not be deleted.",
      );
      return;
    }

    setEvents((current) => current.filter((item) => item.id !== event.id));
    setBusyId(null);
    showMessage("success", "Event deleted.");
  }

  const isForm = view === "form";

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Gallery
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            {isForm
              ? "Add event details and photos. Changes appear on the public Gallery page."
              : "Manage Gallery events shown on the website. Each event has its own photos."}
          </p>
        </div>
        {isForm ? (
          <button
            type="button"
            onClick={backToList}
            className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase"
          >
            Back to events
          </button>
        ) : (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#9a7b45]"
          >
            + Add Event
          </button>
        )}
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
        <p className="mt-8 text-sm text-neutral-500">Loading gallery events…</p>
      ) : isForm ? (
        <form onSubmit={onSave} className="mt-8 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Event details
            </legend>
            <Field id="event-title" label="Title">
              <input
                id="event-title"
                type="text"
                required
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field id="event-date" label="Date" hint="Optional">
              <input
                id="event-date"
                type="date"
                value={form.event_date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, event_date: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field id="event-location" label="Location" hint="Optional">
              <input
                id="event-location"
                type="text"
                value={form.location}
                onChange={(event) =>
                  setForm((current) => ({ ...current, location: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field id="event-description" label="Description" hint="Optional">
              <textarea
                id="event-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Photos
            </legend>
            <p className="text-sm text-neutral-500">
              JPG, PNG, or WEBP. Max 6 MB each. You can select multiple photos.
              {!form.id
                ? " New photos are uploaded when you save the event."
                : null}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="sr-only"
              onChange={onUploadSelected}
            />
            <button
              type="button"
              disabled={uploading || saving}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase disabled:opacity-60"
            >
              {uploading ? uploadStatus || "Uploading…" : "Upload photos"}
            </button>

            {pendingFiles.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {pendingFiles.map((item) => (
                  <li
                    key={item.id}
                    className="overflow-hidden rounded-lg border border-neutral-200"
                  >
                    <div className="relative aspect-[4/3] bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between px-3 py-3">
                      <p className="truncate text-xs text-neutral-500">{item.file.name}</p>
                      <button
                        type="button"
                        onClick={() => removePendingFile(item.id)}
                        className="text-xs text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {form.photos.length === 0 && pendingFiles.length === 0 ? (
              <p className="text-sm text-neutral-500">No photos yet.</p>
            ) : form.photos.length === 0 ? null : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {form.photos.map((photo, index) => (
                  <li
                    key={photo.id}
                    className="overflow-hidden rounded-lg border border-neutral-200"
                  >
                    <div className="relative aspect-[4/3] bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.image_url}
                        alt={photo.alt_text || ""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-3 px-4 py-4">
                      <Field id={`alt-${photo.id}`} label="Alt text">
                        <input
                          id={`alt-${photo.id}`}
                          type="text"
                          value={draftAlts[photo.id] ?? ""}
                          onChange={(event) =>
                            setDraftAlts((current) => ({
                              ...current,
                              [photo.id]: event.target.value,
                            }))
                          }
                          onBlur={() => saveAlt(photo)}
                          disabled={busyId === photo.id}
                          className={inputClass}
                          placeholder="Optional description"
                        />
                      </Field>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={index === 0 || busyId === photo.id}
                            onClick={() => movePhoto(index, -1)}
                            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-700 disabled:opacity-40"
                          >
                            Move up
                          </button>
                          <button
                            type="button"
                            disabled={
                              index === form.photos.length - 1 || busyId === photo.id
                            }
                            onClick={() => movePhoto(index, 1)}
                            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-700 disabled:opacity-40"
                          >
                            Move down
                          </button>
                        </div>
                        <button
                          type="button"
                          disabled={busyId === photo.id}
                          onClick={() => deletePhoto(photo)}
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
          </fieldset>

          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#9a7b45] disabled:opacity-60"
          >
            {saving ? "Saving…" : uploading ? uploadStatus || "Uploading…" : "Save event"}
          </button>
        </form>
      ) : events.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No Gallery events yet. Add an event to replace the public fallback content.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {events.map((event, index) => {
            const cover = event.photos[0];
            const dateLabel = formatGalleryEventDate(event.event_date ?? "");

            return (
              <li
                key={event.id}
                className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="h-24 w-full shrink-0 overflow-hidden rounded-md bg-neutral-100 sm:h-20 sm:w-28">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.image_url}
                      alt={cover.alt_text || event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                      No photo
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-neutral-900">{event.title}</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {[dateLabel, event.location].filter(Boolean).join(" · ") || "No date or location"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {event.photos.length} {event.photos.length === 1 ? "photo" : "photos"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={index === 0 || busyId === event.id}
                    onClick={() => moveEvent(index, -1)}
                    className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-700 disabled:opacity-40"
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    disabled={index === events.length - 1 || busyId === event.id}
                    onClick={() => moveEvent(index, 1)}
                    className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-700 disabled:opacity-40"
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(event)}
                    className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busyId === event.id}
                    onClick={() => deleteEvent(event)}
                    className="rounded-md px-2.5 py-1.5 text-xs text-red-700 hover:underline disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
