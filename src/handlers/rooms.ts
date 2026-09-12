import { Env, err, json } from "../responses";
import { canRead } from "../auth";

// GET /api/rooms - list all rooms in the R2 bucket
export async function handleRooms(request: Request, env: Env): Promise<Response> {
  if (!canRead(request, env)) return err(401, "unauthorized");

  // List all objects under "full/" to find distinct room prefixes
  const rooms = new Set<string>();
  let cursor: string | undefined;

  do {
    const res = await env.BUCKET.list({
      prefix: "full/",
      limit: 1000,
      cursor,
    } as R2ListOptions);

    for (const obj of res.objects) {
      // Key format: full/<roomId>/... or full/<roomId>/<folder>/...
      // Only 2 parts means legacy: full/.ext (no roomId) — skip those.
      const parts = obj.key.split("/");
      if (parts.length >= 3) {
        rooms.add(parts[1]);
      }
    }

    cursor = res.truncated ? res.cursor : undefined;
  } while (cursor);

  return json({ rooms: [...rooms].sort() });
}
