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

export function IconClients({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 18c.6-2.6 2.6-4 5-4s4.4 1.4 5 4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.5" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 18c.3-1.6 1.4-2.7 3-3.2 1.4.4 2.4 1.3 2.8 2.7" stroke="currentColor" strokeWidth="1.5" />
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
  Clients: IconClients,
  Settings: IconPage,
};

export function AdminNavIcon({ label, className = "h-4 w-4" }) {
  const Icon = icons[label] ?? IconPage;
  return <Icon className={className} />;
}
