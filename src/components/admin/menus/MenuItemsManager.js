"use client";

import { useState } from "react";
import MenuImageField from "@/components/admin/menus/MenuImageField";
import { createEmptyMenuItem } from "@/lib/menus/content";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#B5935A]";

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

export default function MenuItemsManager({
  sectionId,
  items,
  folder,
  showPrice = false,
  showMinimum = false,
  titleMultiline = false,
  onChange,
  onError,
}) {
  const [editingId, setEditingId] = useState(null);
  const ordered = [...items].sort((left, right) => left.sortOrder - right.sortOrder);

  function updateItems(nextItems) {
    onChange(
      nextItems.map((item, index) => ({
        ...item,
        sortOrder: index,
      })),
    );
  }

  function updateItem(id, updates) {
    updateItems(
      ordered.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function moveItem(id, direction) {
    const index = ordered.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ordered.length) return;

    const next = [...ordered];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    updateItems(next);
  }

  function addItem() {
    const item = createEmptyMenuItem(crypto.randomUUID(), ordered.length);
    updateItems([...ordered, item]);
    setEditingId(item.id);
  }

  function deleteItem(id) {
    const item = ordered.find((entry) => entry.id === id);
    if (!item || item.seeded) return;
    if (!window.confirm(`Delete “${item.title || "this menu"}”? This cannot be undone.`)) {
      return;
    }
    updateItems(ordered.filter((entry) => entry.id !== id));
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="space-y-4">
      {ordered.map((item, index) => {
        const editing = editingId === item.id;

        return (
          <div
            key={item.id}
            className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded border border-neutral-200 bg-white">
                {item.image?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image.src}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[0.62rem] tracking-wide text-neutral-400 uppercase">
                    No image
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {item.title || "Untitled menu"}
                </p>
                <p className="mt-0.5 truncate text-xs text-neutral-500">
                  {item.eyebrow || "No category"}
                  {item.active === false ? " · Hidden" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(editing ? null : item.id)}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.14em] text-neutral-700 uppercase"
                >
                  {editing ? "Close" : "Edit"}
                </button>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(item.id, -1)}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.14em] text-neutral-700 uppercase disabled:opacity-40"
                >
                  Move up
                </button>
                <button
                  type="button"
                  disabled={index === ordered.length - 1}
                  onClick={() => moveItem(item.id, 1)}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.14em] text-neutral-700 uppercase disabled:opacity-40"
                >
                  Move down
                </button>
                <button
                  type="button"
                  onClick={() => updateItem(item.id, { active: item.active === false })}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.14em] text-neutral-700 uppercase"
                >
                  {item.active === false ? "Show" : "Hide"}
                </button>
                <button
                  type="button"
                  disabled={item.seeded}
                  onClick={() => deleteItem(item.id)}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.14em] text-neutral-700 uppercase disabled:opacity-40"
                  title={
                    item.seeded
                      ? "Hide this original menu instead of deleting it."
                      : "Delete this menu"
                  }
                >
                  Delete
                </button>
              </div>
            </div>

            {editing ? (
              <div className="mt-4 space-y-4 border-t border-neutral-200 pt-4">
                <Field id={`${sectionId}-${item.id}-eyebrow`} label="Category / eyebrow">
                  <input
                    id={`${sectionId}-${item.id}-eyebrow`}
                    type="text"
                    value={item.eyebrow}
                    onChange={(event) =>
                      updateItem(item.id, { eyebrow: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field
                  id={`${sectionId}-${item.id}-title`}
                  label="Title"
                  hint={
                    titleMultiline
                      ? "Use a new line to keep a two-line title."
                      : undefined
                  }
                >
                  {titleMultiline ? (
                    <textarea
                      id={`${sectionId}-${item.id}-title`}
                      rows={2}
                      value={item.title}
                      onChange={(event) =>
                        updateItem(item.id, { title: event.target.value })
                      }
                      className={inputClass}
                    />
                  ) : (
                    <input
                      id={`${sectionId}-${item.id}-title`}
                      type="text"
                      value={item.title}
                      onChange={(event) =>
                        updateItem(item.id, { title: event.target.value })
                      }
                      className={inputClass}
                    />
                  )}
                </Field>
                <Field id={`${sectionId}-${item.id}-description`} label="Description">
                  <textarea
                    id={`${sectionId}-${item.id}-description`}
                    rows={3}
                    value={item.description}
                    onChange={(event) =>
                      updateItem(item.id, { description: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                {showPrice ? (
                  <Field id={`${sectionId}-${item.id}-price`} label="Price line">
                    <input
                      id={`${sectionId}-${item.id}-price`}
                      type="text"
                      value={item.price}
                      onChange={(event) =>
                        updateItem(item.id, { price: event.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                ) : null}
                {showMinimum ? (
                  <Field
                    id={`${sectionId}-${item.id}-minimum`}
                    label="Minimum"
                    hint="Leave blank to show the current “Minimum 10 guests” fallback."
                  >
                    <input
                      id={`${sectionId}-${item.id}-minimum`}
                      type="text"
                      value={item.minimum}
                      onChange={(event) =>
                        updateItem(item.id, { minimum: event.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                ) : null}
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={item.active !== false}
                    onChange={(event) =>
                      updateItem(item.id, { active: event.target.checked })
                    }
                  />
                  Visible on the public Menus page
                </label>
                <MenuImageField
                  id={`${sectionId}-${item.id}-image`}
                  image={item.image}
                  folder={`${folder}/${item.id}`}
                  onChange={(image) => updateItem(item.id, { image })}
                  onError={onError}
                />
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addItem}
        className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase"
      >
        Add Menu
      </button>
    </div>
  );
}
