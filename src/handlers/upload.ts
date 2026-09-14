import { Env, err, json } from "../responses";
import { isAuthed } from "../auth";
import { ALLOWED_EXTS, EXT_BY_TYPE, fullKey, makeId, randSuffix, thumbKey } from "../ids";

const MAX_FULL_BYTES = 25 * 1024 * 1024;

// Strip EXIF and other metadata from JPEG to protect privacy
// Uses iterative approach to avoid stack overflow on deeply nested markers
async function stripExif(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  let result: ReadableStreamReadResult<Uint8Array>;
  do {
    result = await reader.read();
    if (result.value) {
      chunks.push(result.value);
      total += result.value.byteLength;
    }
  } while (!result.done);

  const buf = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buf.set(chunk, offset);
    offset += chunk.byteLength;
  }

  // Not a JPEG — return as-is
  if (buf[0] !== 0xff || buf[1] !== 0xd8) {
    return buf;
  }

  // Use Uint8Array for output to avoid spread operator stack issues
  const out: number[] = [0xff, 0xd8]; // SOI
  let i = 2;
  let iterations = 0;
  const maxIterations = 10000; // Safety limit to prevent infinite loops

  while (i < buf.length - 1 && iterations < maxIterations) {
    iterations++;
    if (buf[i] !== 0xff) {
      // Scan data — copy rest and exit
      for (let j = i; j < buf.length; j++) out.push(buf[j]);
      break;
    }
    const marker = buf[i + 1];
    // SOS (Start of Scan) or EOI — copy and stop
    if (marker === 0xda || marker === 0xd9) {
      for (let j = i; j < buf.length; j++) out.push(buf[j]);
      break;
    }
    // RST markers (no length)
    if (marker >= 0xd0 && marker <= 0xd7) {
      out.push(buf[i], buf[i + 1]);
      i += 2;
      continue;
    }
    // Any other marker — has 2-byte length
    if (i + 3 >= buf.length) break;
    const len = (buf[i + 2] << 8) | buf[i + 3];
    // Drop APP0-15 (metadata: EXIF, ICC, IPTC, XMP, etc.)
    if (marker >= 0xe0 && marker <= 0xef) {
      i += 2 + len;
      continue;
    }
    // Keep DQT, DHT, DNL, DRI, etc.
    out.push(buf[i], buf[i + 1], buf[i + 2], buf[i + 3]);
    for (let j = i + 4; j < i + 2 + len && j < buf.length; j++) {
      out.push(buf[j]);
    }
    i += 2 + len;
  }

  return new Uint8Array(out);
}

function getExtFromMime(mimeType: string, filename: string): string | null {
  const ext = EXT_BY_TYPE[mimeType];
  if (ext) return ext;

  // Fallback: try to get extension from filename
  const dot = filename.lastIndexOf(".");
  if (dot !== -1) {
    const fileExt = filename.slice(dot + 1).toLowerCase();
    if (ALLOWED_EXTS.has(fileExt)) return fileExt;
  }
  return null;
}

export async function handleUpload(request: Request, env: Env): Promise<Response> {
  if (!isAuthed(request, env)) return err(401, "unauthorized");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return err(400, "expected multipart/form-data");
  }

  // Get room ID from header (required for isolation)
  // If not provided (gallery use case), use default room "gallery"
  const roomId = request.headers.get("x-room-id") || "gallery";
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(roomId)) {
    return err(400, "x-room-id must be 1-64 alphanumeric chars (or omit for default gallery room)");
  }

  // Get folder path from header (optional, defaults to root)
  const folder = request.headers.get("x-folder") || "_root";
  if (!/^[a-zA-Z0-9_/-]{0,128}$/.test(folder)) {
    return err(400, "invalid folder path");
  }

  // Duck-type the File: `form.get()` returns `string | File | null`, and TS strict
  // rejects `instanceof File` on that union (TS2358), so narrow by shape instead.
  const fullEntry = form.get("full");
  if (!fullEntry || typeof fullEntry !== "object" || !("stream" in fullEntry) || !("name" in fullEntry)) {
    return err(400, "missing full");
  }
  const full = fullEntry as File;

  // Normalize the MIME: strip any parameters like "; charset=utf-8" so a
  // non-PWA client (curl, Shortcut) isn't silently 415'd on text uploads.
  const mimeType = full.type.split(";")[0].trim().toLowerCase();
  const ext = getExtFromMime(mimeType, full.name);
  console.log("upload attempt:", { mimeType, ext, name: full.name, size: full.size });

  if (!ext) return err(415, `unsupported type: ${full.type} (file: ${full.name})`);
  if (full.size > MAX_FULL_BYTES) return err(413, "full too large");

  // Strip EXIF from JPEG images for privacy (GPS location, camera info, etc.)
  let cleanBody: Uint8Array;
  try {
    cleanBody = await stripExif(full.stream());
  } catch (e) {
    console.error("EXIF strip failed:", e);
    return err(500, "EXIF processing failed: " + (e instanceof Error ? e.message : String(e)));
  }
  const cleanBlob = new Blob([cleanBody], { type: mimeType });

  const thumbEntry = form.get("thumb");
  // Check if thumb is a valid object with content (not empty blob)
  const hasThumb = !!(
    thumbEntry &&
    typeof thumbEntry === "object" &&
    "stream" in thumbEntry &&
    "size" in thumbEntry &&
    (thumbEntry as File).size > 0
  );

  const id = makeId(Date.now(), randSuffix());
  const meta = {
    source: request.headers.get("x-source") || "unknown",
    origName: request.headers.get("x-filename") || full.name || "",
    uploadedAt: new Date().toISOString(),
    hasThumb: String(hasThumb),
    roomId: roomId,
    folder: folder !== "_root" ? folder : "",
  };

  try {
    await env.BUCKET.put(fullKey(roomId, id, ext, folder), cleanBlob.stream(), {
      httpMetadata: { contentType: mimeType },
      customMetadata: meta,
    });
  } catch (e) {
    console.error("R2 put failed:", e);
    return err(500, "storage failed: " + (e instanceof Error ? e.message : String(e)));
  }

  if (hasThumb) {
    const thumb = thumbEntry as Blob;
    await env.BUCKET.put(thumbKey(roomId, id, folder), thumb.stream(), {
      httpMetadata: { contentType: "image/jpeg" },
    });
  }

  console.log("upload success:", { id, roomId, folder, ext });
  return json({ id, roomId, folder });
}
