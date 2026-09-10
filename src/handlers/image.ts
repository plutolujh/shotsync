import { Env, err } from "../responses";
import { canRead } from "../auth";
import { FULL_EXTS, fullKey, thumbKey } from "../ids";

// Try to find full image with one of the supported extensions
export async function getFull(env: Env, roomId: string, id: string): Promise<R2ObjectBody | null> {
  for (const ext of FULL_EXTS) {
    const obj = await env.BUCKET.get(fullKey(roomId, id, ext));
    if (obj) return obj;
  }
  return null;
}

// Fallback: try old format without room folder (for pre-room-isolation images)
async function getFullLegacy(env: Env, id: string): Promise<R2ObjectBody | null> {
  for (const ext of FULL_EXTS) {
    const obj = await env.BUCKET.get(`full/${id}.${ext}`);
    if (obj) return obj;
  }
  return null;
}

export async function handleImage(request: Request, env: Env, id: string): Promise<Response> {
  // Check authentication
  if (!canRead(request, env)) return err(401, "unauthorized");

  // Get room ID from query param
  const roomId = new URL(request.url).searchParams.get("room") || "";

  // Get size parameter from query string
  const size = new URL(request.url).searchParams.get("size");

  let obj: R2ObjectBody | null = null;

  // If size=thumb is requested, try to fetch thumb
  if (size === "thumb") {
    if (roomId) {
      obj = await env.BUCKET.get(thumbKey(roomId, id));
    }
    // Fallback: try legacy thumb format (pre-room-isolation)
    if (!obj) {
      obj = await env.BUCKET.get(`thumb/${id}.jpg`);
    }
  }

  // Fall back to full image if thumb not found or not requested
  if (!obj) {
    if (roomId) {
      obj = await getFull(env, roomId, id);
    }
    // Fallback: try legacy full format (pre-room-isolation)
    if (!obj) {
      obj = await getFullLegacy(env, id);
    }
  }

  // Return 404 if nothing found
  if (!obj) return err(404, "not found");

  // Return image with proper headers
  return new Response(obj.body, {
    headers: {
      "content-type": obj.httpMetadata?.contentType || "application/octet-stream",
      "cache-control": "private, max-age=31536000, immutable",
    },
  });
}
