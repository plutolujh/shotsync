import { Env, err, json } from "../responses";
import { isAuthed } from "../auth";
import { ALLOWED_EXTS, EXT_BY_TYPE, fullKey, makeId, randSuffix, thumbKey } from "../ids";

const MAX_FULL_BYTES = 25 * 1024 * 1024;

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
  if (!ext) return err(415, `unsupported type: ${full.type}`);
  if (full.size > MAX_FULL_BYTES) return err(413, "full too large");

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
  };

  await env.BUCKET.put(fullKey(roomId, id, ext), full.stream(), {
    httpMetadata: { contentType: full.type },
    customMetadata: meta,
  });

  if (hasThumb) {
    const thumb = thumbEntry as Blob;
    await env.BUCKET.put(thumbKey(roomId, id), thumb.stream(), {
      httpMetadata: { contentType: "image/jpeg" },
    });
  }

  return json({ id, roomId });
}
