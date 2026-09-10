const DEFAULT_PRESENTATION = {
  photoLayout: "collage",
  coverPosition: "center 68%",
};

const EVENT_PRESENTATION = {
  "5aad02eb-af93-41e1-9171-9bed738eb575": {
    photoLayout: "portrait-grid",
    coverPosition: "center 14%",
  },
  "206a83e2-d08e-416f-8d41-39e60aa0e147": {
    photoLayout: "portrait-grid",
    coverPosition: "center 72%",
  },
  "ba3f1981-14b4-4eef-be3d-123ae305d169": {
    photoLayout: "portrait-grid",
    coverPosition: "center 50%",
    featuredMenu:
      "Ropa Vieja Bites with Tostones · Guava & Goat Cheese Bites · Shrimp Ceviche Verrines · Tropical Cheese & Fruit Presentation · Ham Croquetas · Mini Cuban Sandwiches · Tres Leches Verrines · Mango-Coconut-Chia Verrines",
    excludePhotoIds: ["f331675a-34cc-49c6-9e83-d09f0e2bd3c5"],
  },
};

export function getEventPresentation(eventId) {
  return EVENT_PRESENTATION[String(eventId)] ?? DEFAULT_PRESENTATION;
}
