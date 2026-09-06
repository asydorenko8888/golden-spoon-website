"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ onSignedOut }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSignOut() {
    setPending(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      onSignedOut?.();
      router.replace("/admin/login");
      router.refresh();
    } catch {
      router.replace("/admin/login");
    }
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={pending}
      className="w-full rounded-md px-3 py-2 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign Out"}
    </button>
  );
}
