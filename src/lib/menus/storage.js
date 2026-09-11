const BUCKET = "gallery";
const PUBLIC_MARKER = `/storage/v1/object/public/${BUCKET}/`;
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const MENU_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export function extensionFor(file) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export function validateMenuImageFile(file) {
  if (!file) {
    throw new Error("Choose an image to upload.");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, or WEBP image.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 8 MB or smaller.");
  }
}

export async function readImageSize(file) {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close?.();
  return size;
}

export function menusStoragePathFromUrl(url) {
  if (typeof url !== "string" || url.trim() === "") {
    return null;
  }

  const index = url.indexOf(PUBLIC_MARKER);
  if (index === -1) {
    return null;
  }

  const path = decodeURIComponent(
    url.slice(index + PUBLIC_MARKER.length).split("?")[0],
  );
  return path.startsWith("menus/") ? path : null;
}

export async function uploadMenuImage(supabase, file, folder) {
  validateMenuImageFile(file);

  const size = await readImageSize(file);
  const path = `menus/${folder}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error("Upload failed. Check the storage bucket and try again.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    src: publicUrl,
    storagePath: path,
    width: size.width,
    height: size.height,
  };
}

export async function removeUploadedMenuImage(supabase, image) {
  const path =
    image?.storagePath || menusStoragePathFromUrl(image?.src || "");
  if (!path) return;

  await supabase.storage.from(BUCKET).remove([path]);
}
