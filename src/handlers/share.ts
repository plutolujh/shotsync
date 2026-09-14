import { Env, err, json } from "../responses";
import { isAuthed } from "../auth";
import { signShare, verifyShare } from "../share";
import { getFull } from "./image";

const SHARE_TTL_MS = 7 * 24 * 3600 * 1000; // links live 7 days

// POST /api/share/<id>?room=<roomId> (authed) -> mint a public, signed, expiring URL for one item.
export async function handleShareCreate(request: Request, env: Env, id: string): Promise<Response> {
  if (!isAuthed(request, env)) return err(401, "unauthorized");

  const roomId = new URL(request.url).searchParams.get("room");
  if (!roomId) return err(400, "room query param required");

  const exp = Date.now() + SHARE_TTL_MS;
  const sig = await signShare(id, exp, roomId, env.AUTH_TOKEN);
  const origin = new URL(request.url).origin;
  const url = `${origin}/share/${encodeURIComponent(id)}?exp=${exp}&sig=${sig}&room=${encodeURIComponent(roomId)}`;
  return json({ url, exp });
}

// GET /s/<id>?exp=&sig=&room=  (public, no token) -> serve the one signed item.
export async function handleSharedItem(request: Request, env: Env, id: string): Promise<Response> {
  const q = new URL(request.url).searchParams;
  const exp = Number(q.get("exp"));
  const sig = q.get("sig") || "";
  const roomId = q.get("room") || "";
  if (!exp || Date.now() > exp) return err(410, "link expired");
  if (!roomId) return err(400, "room param required");
  if (!env.AUTH_TOKEN || !(await verifyShare(id, exp, roomId, sig, env.AUTH_TOKEN))) {
    return err(403, "invalid signature");
  }
  const obj = await getFull(env, roomId, id);
  if (!obj) return err(404, "not found");
  return new Response(obj.body, {
    headers: {
      "content-type": obj.httpMetadata?.contentType || "application/octet-stream",
      "cache-control": "public, max-age=86400",
      "x-content-type-options": "nosniff",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "Range",
      "access-control-expose-headers": "Content-Length, Content-Range",
      "content-disposition": "inline",
    },
  });
}

// GET /pub/<id>?room=<roomId>  (public, no sig) -> serve file for Office Online preview.
// This endpoint does NOT require HMAC signature, only that the roomId is provided.
// Used by Office Online viewer to fetch documents for preview.
export async function handlePublicItem(request: Request, env: Env, id: string): Promise<Response> {
  const q = new URL(request.url).searchParams;
  const roomId = q.get("room") || "";
  if (!roomId) return err(400, "room param required");

  const obj = await getFull(env, roomId, id);
  if (!obj) return err(404, "not found");

  // For Office Online, we need these specific headers
  return new Response(obj.body, {
    headers: {
      "content-type": obj.httpMetadata?.contentType || "application/octet-stream",
      "cache-control": "public, max-age=300",
      "x-content-type-options": "nosniff",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "Range, Origin",
      "access-control-expose-headers": "Content-Length, Content-Range, Content-Type",
      "access-control-allow-methods": "GET",
      "content-disposition": "inline",
    },
  });
}
