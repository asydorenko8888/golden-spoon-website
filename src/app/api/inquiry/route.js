import { saveWebsiteInquiry } from "@/lib/clients/saveWebsiteInquiry";
import {
  sendInquiryEmail,
  validateInquiryPayload,
} from "@/lib/contact/sendInquiry";

function visitorError(error, fallback = "Your inquiry could not be sent. Please try again.") {
  const status = error instanceof Error && error.status ? error.status : 502;
  const message =
    error instanceof Error && error.message ? error.message : fallback;
  return Response.json({ error: message }, { status });
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body?.website === "string" && body.website.trim()) {
    return Response.json({ ok: true });
  }

  const { errors, values } = validateInquiryPayload(body);

  if (Object.keys(errors).length > 0) {
    return Response.json({ error: "Please complete the required fields.", errors }, { status: 400 });
  }

  try {
    await saveWebsiteInquiry(values);
  } catch (error) {
    console.error(
      "Inquiry save failed:",
      error instanceof Error ? error.message : "Unknown save error",
    );
    return visitorError(error);
  }

  try {
    await sendInquiryEmail(values);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(
      "Inquiry email failed after the client record was saved:",
      error instanceof Error ? error.message : "Unknown email error",
    );
    return visitorError(error);
  }
}
