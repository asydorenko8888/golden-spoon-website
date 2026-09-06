import { applyFaqForm } from "@/lib/faq/content";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getPublicFaqContent() {
  const fallback = applyFaqForm(null);

  if (!getSupabaseEnv()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faq_content")
      .select("data")
      .eq("id", "faq")
      .maybeSingle();

    if (error || !data?.data) {
      return fallback;
    }

    return applyFaqForm(data.data);
  } catch {
    return fallback;
  }
}
