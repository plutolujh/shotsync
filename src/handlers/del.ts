import { Env, err, json } from "../responses";
import { isAuthed } from "../auth";
import { FULL_EXTS, fullKey, thumbKey } from "../ids";

export async function handleDelete(request: Request, env: Env, id: string): Promise<Response> {
  if (!isAuthed(request, env)) return err(401, "unauthorized");

  // Get roomId from query param
  const roomId = new URL(request.url).searchParams.get("room");
  if (!roomId) return err(400, "room query param required");

  const keys = FULL_EXTS.map((ext) => fullKey(roomId, id, ext));
  keys.push(thumbKey(roomId, id));
  // R2 delete accepts an array of keys
  await env.BUCKET.delete(keys);

  return json({ deleted: true });
}
