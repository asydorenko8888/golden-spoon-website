export function IconMenu({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconClose({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconDashboard({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconPage({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4h7l6 6v10H7V4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 4v6h6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const icons = {
  Dashboard: IconDashboard,
  Home: IconPage,
  About: IconPage,
  Services: IconPage,
  Gallery: IconPage,
  Menus: IconPage,
  FAQ: IconPage,
  Contact: IconPage,
  Settings: IconPage,
};

export function AdminNavIcon({ label, className = "h-4 w-4" }) {
  const Icon = icons[label] ?? IconPage;
  return <Icon className={className} />;
}
