import { applyAboutForm } from "@/lib/about/content";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getPublicAboutContent() {
  const fallback = applyAboutForm(null);

  if (!getSupabaseEnv()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("about_content")
      .select("data")
      .eq("id", "about")
      .maybeSingle();

    if (error || !data?.data) {
      return fallback;
    }

    return applyAboutForm(data.data);
  } catch {
    return fallback;
  }
}
