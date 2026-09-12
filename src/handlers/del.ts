import { Env, err, json } from "../responses";
import { isAuthed } from "../auth";
import { FULL_EXTS, fullKey, thumbKey } from "../ids";

export async function handleDelete(request: Request, env: Env, id: string): Promise<Response> {
  if (!isAuthed(request, env)) return err(401, "unauthorized");

  // Get roomId and folder from query params
  const url = new URL(request.url);
  const roomId = url.searchParams.get("room");
  const folder = url.searchParams.get("folder") || "_root";

  if (!roomId) return err(400, "room query param required");
  if (!/^[a-zA-Z0-9_/-]{0,128}$/.test(folder)) {
    return err(400, "invalid folder path");
  }

  const keys = FULL_EXTS.map((ext) => fullKey(roomId, id, ext, folder));
  keys.push(thumbKey(roomId, id, folder));
  // R2 delete accepts an array of keys
  await env.BUCKET.delete(keys);

  return json({ deleted: true, roomId, folder });
}
