import { applyMenusForm } from "@/lib/menus/content";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getPublicMenusContent() {
  const fallback = applyMenusForm(null);

  if (!getSupabaseEnv()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("menus_content")
      .select("data")
      .eq("id", "menus")
      .maybeSingle();

    if (error || !data?.data) {
      return fallback;
    }

    return applyMenusForm(data.data);
  } catch {
    return fallback;
  }
}
