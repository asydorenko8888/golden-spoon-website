import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import ffprobe from "ffprobe-static";

export const VIDEO_CONVERT_ERROR =
  "This video could not be converted to a browser-compatible format. Please try another file.";

const SAFE_VIDEO_CODECS = new Set(["h264", "vp8", "vp9", "av1"]);

function runProcess(bin, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    if (!bin) {
      reject(new Error("missing binary"));
      return;
    }

    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(stderr || `exit ${code}`));
    });
  });
}

function primaryVideoStream(streams = []) {
  return streams.find(
    (stream) => stream.codec_type === "video" && stream.disposition?.attached_pic !== 1,
  );
}

function isMovSource(fileName = "", mimeType = "") {
  return (
    /\.mov$/i.test(fileName) ||
    /quicktime/i.test(mimeType)
  );
}

export function isBrowserCompatibleVideo({ fileName, mimeType, probe }) {
  const video = primaryVideoStream(probe?.streams);
  if (!video) return false;

  const codec = String(video.codec_name || "").toLowerCase();
  if (!SAFE_VIDEO_CODECS.has(codec)) return false;
  if (isMovSource(fileName, mimeType)) return false;
  if (codec === "h264" && !/\.mp4$/i.test(fileName || "")) return false;
  if ((codec === "vp8" || codec === "vp9" || codec === "av1") && !/\.webm$/i.test(fileName || "")) {
    return false;
  }

  return true;
}

export async function probeVideoFile(filePath) {
  const { stdout } = await runProcess(
    ffprobe.path,
    ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", filePath],
    30000,
  );
  return JSON.parse(stdout);
}

export async function transcodeToBrowserMp4(inputPath, outputPath) {
  await runProcess(
    ffmpegPath,
    [
      "-y",
      "-i",
      inputPath,
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-ac",
      "2",
      "-movflags",
      "+faststart",
      "-metadata:s:v:0",
      "rotate=0",
      outputPath,
    ],
    180000,
  );
}

export async function prepareBrowserCompatibleVideo(file) {
  const fileName = file?.name || "upload";
  const mimeType = file?.type || "";
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = await mkdtemp(path.join(tmpdir(), "gs-event-video-"));
  const inputExt = path.extname(fileName) || ".bin";
  const inputPath = path.join(dir, `source${inputExt}`);
  const outputPath = path.join(dir, "event-video.mp4");

  try {
    await writeFile(inputPath, bytes);
    const probe = await probeVideoFile(inputPath);

    if (isBrowserCompatibleVideo({ fileName, mimeType, probe })) {
      return {
        converted: false,
        filename: fileName,
        contentType: mimeType || "application/octet-stream",
        buffer: bytes,
      };
    }

    await transcodeToBrowserMp4(inputPath, outputPath);
    const converted = await readFile(outputPath);

    return {
      converted: true,
      filename: "event-video.mp4",
      contentType: "video/mp4",
      buffer: converted,
    };
  } catch {
    throw new Error(VIDEO_CONVERT_ERROR);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
