import { applyServicesForm } from "@/lib/services/content";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getPublicServicesContent() {
  const fallback = applyServicesForm(null);

  if (!getSupabaseEnv()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services_content")
      .select("data")
      .eq("id", "services")
      .maybeSingle();

    if (error || !data?.data) {
      return fallback;
    }

    return applyServicesForm(data.data);
  } catch {
    return fallback;
  }
}
