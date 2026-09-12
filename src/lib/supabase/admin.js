import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return typeof key === "string" && key.trim() !== "" ? key.trim() : "";
}

export function createServiceClient() {
  const env = getSupabaseEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!env || !serviceRoleKey) {
    throw new Error("Supabase service role is not configured.");
  }

  return createClient(env.url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
