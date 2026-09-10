import { createClient } from "@/lib/supabase/server";
import {
  VIDEO_CONVERT_ERROR,
  prepareBrowserCompatibleVideo,
} from "@/lib/gallery/prepareEventVideo";

export const runtime = "nodejs";
export const maxDuration = 180;

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let file;
  try {
    const formData = await request.formData();
    file = formData.get("file");
  } catch {
    return Response.json({ error: VIDEO_CONVERT_ERROR }, { status: 400 });
  }

  if (!(file instanceof File) || file.size < 1) {
    return Response.json({ error: VIDEO_CONVERT_ERROR }, { status: 400 });
  }

  try {
    const prepared = await prepareBrowserCompatibleVideo(file);
    return new Response(prepared.buffer, {
      headers: {
        "Content-Type": prepared.contentType,
        "Content-Disposition": `attachment; filename="${prepared.filename}"`,
        "X-Video-Converted": prepared.converted ? "1" : "0",
        "X-Video-Filename": prepared.filename,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message === VIDEO_CONVERT_ERROR
        ? VIDEO_CONVERT_ERROR
        : VIDEO_CONVERT_ERROR;
    return Response.json({ error: message }, { status: 422 });
  }
}
