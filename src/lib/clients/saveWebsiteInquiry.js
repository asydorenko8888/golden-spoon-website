import { mapInquiryToClientRecord } from "@/lib/clients/mapInquiry";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function saveWebsiteInquiry(values) {
  if (!getSupabaseEnv()) {
    console.error("Failed to save website inquiry: Supabase is not configured.");
    const error = new Error("Your inquiry could not be sent. Please try again.");
    error.status = 503;
    throw error;
  }

  const record = mapInquiryToClientRecord(values);
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_website_inquiry", {
    p_name: record.name,
    p_email: record.email,
    p_phone: record.phone,
    p_event_date: record.event_date,
    p_event_type: record.event_type,
    p_location: record.location,
    p_guest_count: record.guest_count,
    p_service_type: record.service_type,
    p_estimated_budget: record.estimated_budget,
    p_message: record.message,
  });

  if (error) {
    console.error("Failed to save website inquiry:", error.message);
    const saveError = new Error("Your inquiry could not be sent. Please try again.");
    saveError.status = 503;
    throw saveError;
  }
}
