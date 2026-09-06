import Link from "next/link";

const variants = {
  gold: "bg-gold text-ivory border border-gold hover:bg-gold-deep hover:border-gold-deep",
  goldOutline:
    "bg-transparent text-gold border border-gold hover:bg-gold hover:text-ivory",
  goldOutlineInk:
    "bg-transparent text-ink border border-gold hover:bg-gold hover:text-ivory",
  primary:
    "bg-gold text-ivory border border-gold hover:bg-gold-deep hover:border-gold-deep",
  secondary:
    "bg-transparent text-gold border border-gold hover:bg-gold hover:text-ivory",
};

export default function Button({
  href,
  children,
  variant = "gold",
  className = "",
  ...props
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center px-8 text-center text-[0.68rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
