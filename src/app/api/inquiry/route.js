import {
  sendInquiryEmail,
  validateInquiryPayload,
} from "@/lib/contact/sendInquiry";

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
    await sendInquiryEmail(values);
    return Response.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && error.status ? error.status : 502;
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Your inquiry could not be sent. Please try again.";

    return Response.json({ error: message }, { status });
  }
}
