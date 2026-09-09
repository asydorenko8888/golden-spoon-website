import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getNewInquiryCount() {
  if (!getSupabaseEnv()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");

    if (error) {
      return null;
    }

    return count ?? 0;
  } catch {
    return null;
  }
}
