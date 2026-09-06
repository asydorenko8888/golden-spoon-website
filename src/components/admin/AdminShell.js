"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/data/adminNav";
import SignOutButton from "@/components/admin/SignOutButton";
import { AdminNavIcon, IconClose, IconMenu } from "@/components/admin/AdminIcons";

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {adminNav.map((item) => {
        const isCurrent =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              isCurrent
                ? "bg-[#B5935A]/12 font-medium text-[#8a6d3c]"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
            aria-current={isCurrent ? "page" : undefined}
          >
            <AdminNavIcon label={item.label} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="block px-3 py-1 no-underline">
      <p className="text-sm font-semibold tracking-wide text-neutral-900">
        Golden Spoon
      </p>
      <p className="mt-0.5 text-xs text-neutral-500">Admin</p>
    </Link>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-neutral-900">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-neutral-800"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-neutral-900/40"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-[250px] flex-col border-r border-neutral-200 bg-white px-3 py-5">
            <Brand />
            <div className="mt-6 flex-1">
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
            <div className="border-t border-neutral-200 pt-3">
              <SignOutButton onSignedOut={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}

      <div className="lg:flex">
        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-neutral-200 bg-white px-3 py-6 lg:flex">
          <Brand />
          <div className="mt-8 flex-1">
            <NavLinks pathname={pathname} />
          </div>
          <div className="border-t border-neutral-200 pt-3">
            <SignOutButton />
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-5 py-6 lg:px-10 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
