import Image from "next/image";

export default function ImagePlaceholder({
  slot,
  src = null,
  alt = "",
  className = "",
  imageClassName = "object-cover",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}) {
  return (
    <div
      data-image-slot={slot}
      className={`relative overflow-hidden bg-[#d7cfb8] ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imageClassName}
        />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 bg-[#d7cfb8]" />
      )}
    </div>
  );
}
