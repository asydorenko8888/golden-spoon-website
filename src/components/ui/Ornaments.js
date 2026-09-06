export function Monogram({ className = "" }) {
  return (
    <svg
      viewBox="0 0 72 72"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="36" cy="36" r="27.5" stroke="currentColor" strokeWidth="1" />
      <path
        d="M36 6.5c2.2 3.4 3.4 6.2 2.6 9.2M36 6.5c-2.2 3.4-3.4 6.2-2.6 9.2M22 11.5c3.6 2.2 6.2 4.2 7.4 7.2M50 11.5c-3.6 2.2-6.2 4.2-7.4 7.2M12.5 22c3.8.8 6.8 2.4 8.8 5.2M59.5 22c-3.8.8-6.8 2.4-8.8 5.2M8.5 36c3.2-.4 6.4.4 9 2.4M63.5 36c-3.2-.4-6.4.4-9 2.4M12.5 50c3.2-1.6 6.6-2 9.6-1M59.5 50c-3.2-1.6-6.6-2-9.6-1M22 60c2.8-2.6 6-4 9.4-4.2M50 60c-2.8-2.6-6-4-9.4-4.2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <text
        x="36"
        y="42"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="16"
        letterSpacing="0.06em"
      >
        GS
      </text>
      <path
        d="M32 51h8M36 51v3.8M33.6 56.4c1.6.7 3.2.7 4.8 0"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GoldFlourish({ className = "" }) {
  return (
    <svg
      viewBox="0 0 56 16"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M28 13.5c-1.8-3.6-1.2-7.2 0-10.5M28 13.5c1.8-3.6 1.2-7.2 0-10.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M28 12C22 10.5 17.5 8 12 8M28 12c6-1.5 10.5-4 16-4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M16.5 8c-1.2-2.4-.6-4.6.4-6.5M39.5 8c1.2-2.4.6-4.6-.4-6.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LeafPair({ className = "" }) {
  return (
    <svg
      viewBox="0 0 28 10"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 7.5c4-1 7.5-3.2 10.5-6M26 7.5c-4-1-7.5-3.2-10.5-6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M8 6.8c.2-2 .8-3.4 2-5M20 6.8c-.2-2-.8-3.4-2-5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BotanicalBranch({ className = "", mirrored = false }) {
  return (
    <svg
      viewBox="0 0 120 420"
      className={`${className} ${mirrored ? "-scale-x-100" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M62 12c-6 46-4 92 2 138 6 48 4 96-8 142-6 24-16 52-28 78"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M61 48c-18 8-32 10-48 8M64 78c16 6 30 6 46 2M60 118c-20 10-36 12-52 8M66 156c18 8 34 8 50 2M58 198c-22 12-38 14-54 8M68 238c20 10 36 10 52 4M54 282c-18 12-34 16-48 12M64 322c16 10 30 12 44 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M42 52c-4-10-4-18-1-26M86 80c4-9 8-16 14-22M38 124c-6-10-8-20-6-28M90 162c6-10 12-16 20-20M34 206c-6-12-8-20-4-30M94 244c6-10 14-16 22-20M30 288c-6-10-8-18-4-26M86 328c6-8 12-14 20-16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLeaf({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 26c8-2 14-8 16-16 6 10 2 20-8 24"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 22c4-3 8-8 10-14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCloche({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 24.5c0-8 5-14.5 11-14.5s11 6.5 11 14.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M18 7.5v2.8M16.2 7.5h3.6M6 26.5h24M8 29.5h20"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPeople({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="13" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="23" cy="13.5" r="2.7" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6.5 26.5c1-5 4.2-7.5 6.5-7.5s5.5 2.5 6.5 7.5M18 25.5c1.2-3.8 3.6-5.6 5.2-5.6 2.2 0 4.6 2.2 5.6 6.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconHeartPin({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 30.5c-2.2-2.4-8.5-8-8.5-14.2C9.5 12 12.4 9 16 9c1.4 0 2.6.6 3.5 1.6C20.4 9.6 21.6 9 23 9c3.6 0 6.5 3 6.5 7.3 0 6.2-6.3 11.8-8.5 14.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M18 17.2c-.6-.7-2-1.4-2.8-.4-.7.8-.3 1.8.6 2.6 1 .9 2.2 1.6 2.2 1.6s1.2-.7 2.2-1.6c.9-.8 1.3-1.8.6-2.6-.8-1-2.2-.3-2.8.4Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChefHat({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9.5 19.5c-1.7-1-2.8-2.8-2.8-4.8 0-2.7 2-4.9 4.6-4.9.5-3.1 3.2-5.4 6.5-5.4s6 2.3 6.5 5.4c2.6 0 4.6 2.2 4.6 4.9 0 2-1.1 3.8-2.8 4.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 19.5h17v3h-17z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M11 22.5V29h14v-6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function OliveSprig({ className = "" }) {
  return (
    <svg
      viewBox="0 0 28 16"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 15.2V3.2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M14 5.2c-3.8-.8-7.2-.4-10 1.8 1.6-3.6 5.6-5 10-3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M14 5.2c3.8-.8 7.2-.4 10 1.8-1.6-3.6-5.6-5-10-3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M14 10c-3.2 0-6 .8-8.2 2.6 1.4-2.8 4.4-4 8.2-2.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M14 10c3.2 0 6 .8 8.2 2.6-1.4-2.8-4.4-4-8.2-2.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconArrow({ className = "" }) {
  return (
    <svg
      viewBox="0 0 20 12"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1 6h16M13 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBoat({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 22.5h20l-2.2 5.2c-.4 1-1.4 1.6-2.4 1.6H12.6c-1 0-2-.6-2.4-1.6L8 22.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M11 22.5V16.5h8.5v6M19.5 16.5h5.2V20"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 31h23"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPhone({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12.5 8.5h4.2l1.4 4.2-2.2 1.4c1.2 2.4 3.1 4.3 5.5 5.5l1.4-2.2 4.2 1.4v4.2c0 .8-.7 1.5-1.6 1.5C16.8 24.5 11.5 19.2 11.5 10c0-.9.7-1.5 1-1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEnvelope({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="11"
        width="20"
        height="14"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8.8 12.2 18 19.2l9.2-7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconInstagram({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="9"
        y="9"
        width="18"
        height="18"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="18" cy="18" r="4.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="23.2" cy="12.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function IconPlatter({ className = "" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse
        cx="18"
        cy="24"
        rx="11"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8.5 23.5c.8-7 4.2-12 9.5-12s8.7 5 9.5 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M18 8.5v3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const featureIcons = {
  leaf: IconLeaf,
  cloche: IconCloche,
  people: IconPeople,
  pin: IconHeartPin,
  chef: IconChefHat,
  boat: IconBoat,
  platter: IconPlatter,
  phone: IconPhone,
  envelope: IconEnvelope,
  instagram: IconInstagram,
};

export function FeatureIcon({ name, className = "" }) {
  const Icon = featureIcons[name] ?? IconLeaf;
  return <Icon className={className} />;
}
