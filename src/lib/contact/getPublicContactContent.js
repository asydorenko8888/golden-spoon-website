import {
  applyContactForm,
  applyGlobalContactDetails,
} from "@/lib/contact/content";
import { getPublicSiteSettings } from "@/lib/settings/getPublicSiteSettings";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getPublicContactContent() {
  let content = applyContactForm(null);

  if (getSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("contact_content")
        .select("data")
        .eq("id", "contact")
        .maybeSingle();

      if (!error && data?.data) {
        content = applyContactForm(data.data);
      }
    } catch {
      // Keep hard-coded Contact fallback, then overlay Settings below.
    }
  }

  const settings = await getPublicSiteSettings();

  return {
    ...content,
    strip: applyGlobalContactDetails(content.strip, settings.contact),
  };
}
