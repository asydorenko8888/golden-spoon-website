import { applySiteSettings } from "@/lib/settings/content";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getPublicSiteSettings() {
  const fallback = applySiteSettings(null);

  if (!getSupabaseEnv()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", "settings")
      .maybeSingle();

    if (error || !data?.data) {
      return fallback;
    }

    return applySiteSettings(data.data);
  } catch {
    return fallback;
  }
}
