import { applyHomeForm } from "@/lib/home/content";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getPublicHomeContent() {
  const fallback = applyHomeForm(null);

  if (!getSupabaseEnv()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("home_content")
      .select("data")
      .eq("id", "home")
      .maybeSingle();

    if (error || !data?.data) {
      return fallback;
    }

    return applyHomeForm(data.data);
  } catch {
    return fallback;
  }
}
