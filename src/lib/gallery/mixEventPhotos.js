const FOOD = "food";
const PEOPLE = "people";
const INTERACTION = "interaction";
const ATMOSPHERE = "atmosphere";

const ROLE_CYCLE = [FOOD, PEOPLE, INTERACTION, FOOD, PEOPLE, ATMOSPHERE];

const OPENING_BY_LEAD = {
  2: [FOOD, PEOPLE],
  3: [FOOD, PEOPLE, ATMOSPHERE],
};

const ROLE_FALLBACKS = {
  [FOOD]: [FOOD],
  [PEOPLE]: [PEOPLE, INTERACTION],
  [INTERACTION]: [INTERACTION, PEOPLE],
  [ATMOSPHERE]: [ATMOSPHERE, INTERACTION, PEOPLE],
};

function photoText(photo) {
  return String(photo?.alt_text || "");
}

export function classifyGalleryPhoto(photo) {
  const text = photoText(photo).toLowerCase();

  const hasPeople = /\b(guest|guests|svitlana|child|server)\b/.test(text);
  const hasInteraction =
    /\b(tasting|holding|passed|selecting|tray service|service tray)\b/.test(text);
  const hasWideEvent =
    /\b(backdrop|step-and-repeat|window|drink station|presentation|kitchen|reception service)\b/.test(
      text,
    );
  const foodSubject =
    /\b(charcuterie|canap|ceviche|verrine|dessert|cake|lemonade|spritz|bites|croqueta|platter|tower|mango|cheese|fruit|ropa|salmon|orchid|slider)\b/.test(
      text,
    );

  if (hasInteraction) return INTERACTION;
  if (hasPeople && hasWideEvent) return ATMOSPHERE;
  if (hasPeople) return PEOPLE;
  if (hasWideEvent && !foodSubject) return ATMOSPHERE;
  return FOOD;
}

function sortByCurrentOrder(photos) {
  return [...photos].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function altTokens(value) {
  return new Set(
    String(value || "")
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token.length > 3),
  );
}

function foodDifference(previousAlt, nextAlt) {
  const previous = altTokens(previousAlt);
  const next = altTokens(nextAlt);
  if (previous.size === 0 || next.size === 0) return 0;
  let overlap = 0;
  for (const token of next) {
    if (previous.has(token)) overlap += 1;
  }
  return previous.size + next.size - 2 * overlap;
}

function takeFromBuckets(buckets, role, previousFoodAlt) {
  const list = buckets[role];
  if (!list?.length) return null;
  if (role !== FOOD || !previousFoodAlt || list.length === 1) {
    return list.shift();
  }

  let bestIndex = 0;
  let bestScore = -1;
  for (let index = 0; index < list.length; index += 1) {
    const score = foodDifference(previousFoodAlt, list[index].alt_text);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }
  return list.splice(bestIndex, 1)[0];
}

function remainingRoles(buckets) {
  return [FOOD, PEOPLE, INTERACTION, ATMOSPHERE].filter(
    (role) => buckets[role].length > 0,
  );
}

function takePreferred(buckets, preferred, previousRole, previousFoodAlt) {
  const remaining = remainingRoles(buckets);
  if (remaining.length === 0) return null;

  for (const role of ROLE_FALLBACKS[preferred] ?? [preferred]) {
    if (role === previousRole && remaining.some((item) => item !== previousRole)) {
      continue;
    }
    const photo = takeFromBuckets(buckets, role, previousFoodAlt);
    if (photo) return { photo, role };
  }

  for (const role of remaining) {
    if (role === previousRole && remaining.length > 1) continue;
    const photo = takeFromBuckets(buckets, role, previousFoodAlt);
    if (photo) return { photo, role };
  }

  const role = remaining[0];
  const photo = takeFromBuckets(buckets, role, previousFoodAlt);
  return photo ? { photo, role } : null;
}

function interleavePhotos(photos, leadCount) {
  const buckets = {
    [FOOD]: [],
    [PEOPLE]: [],
    [INTERACTION]: [],
    [ATMOSPHERE]: [],
  };

  for (const photo of sortByCurrentOrder(photos)) {
    buckets[classifyGalleryPhoto(photo)].push(photo);
  }

  const ordered = [];
  let previousRole = null;
  let previousFoodAlt = "";
  const opening = OPENING_BY_LEAD[leadCount] ?? OPENING_BY_LEAD[3];

  for (const preferred of opening) {
    const next = takePreferred(buckets, preferred, previousRole, previousFoodAlt);
    if (!next) break;
    ordered.push(next.photo);
    previousRole = next.role;
    if (next.role === FOOD) previousFoodAlt = next.photo.alt_text || "";
  }

  let cycleIndex = 0;
  while (remainingRoles(buckets).length > 0) {
    const preferred = ROLE_CYCLE[cycleIndex % ROLE_CYCLE.length];
    cycleIndex += 1;
    const next = takePreferred(buckets, preferred, previousRole, previousFoodAlt);
    if (!next) break;
    ordered.push(next.photo);
    previousRole = next.role;
    if (next.role === FOOD) previousFoodAlt = next.photo.alt_text || "";
  }

  return ordered;
}

export function mixEventPhotos(photos = [], options = {}) {
  const excluded = new Set(options.excludePhotoIds ?? []);
  const leadCount = options.leadCount === 2 ? 2 : 3;
  const list = Array.isArray(photos) ? photos : [];

  const visible = [];
  const held = [];

  for (const photo of sortByCurrentOrder(list)) {
    if (!photo) continue;
    if (photo.is_public === false || (photo.id && excluded.has(photo.id))) {
      held.push(photo);
    } else {
      visible.push(photo);
    }
  }

  const mixedVisible = interleavePhotos(visible, leadCount);
  return [...mixedVisible, ...held].map((photo, index) => ({
    ...photo,
    sort_order: index + 1,
  }));
}

export function photosAlreadyMixed(current = [], mixed = []) {
  if (current.length !== mixed.length) return false;
  return current.every((photo, index) => photo.id === mixed[index]?.id);
}
