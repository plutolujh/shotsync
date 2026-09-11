import { Env, err, json } from "../responses";
import { isAuthed } from "../auth";

const BATCH_SIZE = 100;

// DELETE /api/room/<roomId> (authed) -> delete all images in a room
export async function handleDeleteRoom(request: Request, env: Env, roomId: string): Promise<Response> {
  if (!isAuthed(request, env)) return err(401, "unauthorized");

  if (!roomId || !/^[a-zA-Z0-9_-]{1,64}$/.test(roomId)) {
    return err(400, "invalid room id");
  }

  let deleted = 0;
  let cursor: string | undefined;

  do {
    const listing = await env.BUCKET.list({
      prefix: `full/${roomId}/`,
      limit: BATCH_SIZE,
      cursor,
    });

    if (listing.objects.length > 0) {
      await env.BUCKET.delete(listing.objects.map((o) => o.key));
      deleted += listing.objects.length;
    }

    cursor = listing.cursor;
  } while (cursor);

  // Also delete thumbs
  cursor = undefined;
  do {
    const listing = await env.BUCKET.list({
      prefix: `thumb/${roomId}/`,
      limit: BATCH_SIZE,
      cursor,
    });

    if (listing.objects.length > 0) {
      await env.BUCKET.delete(listing.objects.map((o) => o.key));
      deleted += listing.objects.length;
    }

    cursor = listing.cursor;
  } while (cursor);

  return json({ deleted, roomId });
}
