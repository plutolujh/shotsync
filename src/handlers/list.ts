import { Env, err, json } from "../responses";
import { canRead } from "../auth";
import { epochMsFromId, idFromFullKey } from "../ids";

// How many text previews one list call will read inline. Bounded on purpose: a
// pool that is entirely text would otherwise turn a single list request into
// `limit` object reads. Past this cap the client falls back to fetching the
// rest lazily — the pre-existing behaviour — so nothing breaks; items far down
// a text-heavy pool are just as slow as they were before.
const MAX_INLINE_SNIPPETS = 20;

// Concurrency limit for fetching text snippets to avoid overwhelming R2.
const SNIPPET_CONCURRENCY = 5;

// Matches the truncation the gallery already applied client-side, so moving the
// work server-side does not change what a card displays.
const SNIPPET_CHARS = 140;

export async function handleList(request: Request, env: Env): Promise<Response> {
  if (!canRead(request, env)) return err(401, "unauthorized");

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
  const cursor = url.searchParams.get("cursor") || undefined;
  const sort = url.searchParams.get("sort") || "newest";
  const type = url.searchParams.get("type") || "all";

  // Validate sort param
  if (!["newest", "oldest", "name"].includes(sort)) {
    return err(400, "sort must be newest, oldest, or name");
  }
  // Validate type param
  if (!["all", "image", "text", "video", "doc"].includes(type)) {
    return err(400, "type must be all, image, text, video, or doc");
  }

  // Room isolation: list only the specified room, or default to "gallery".
  const roomId = request.headers.get("x-room-id") || "gallery";
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(roomId)) {
    return err(400, "x-room-id must be 1-64 alphanumeric chars (or omit for default gallery room)");
  }

  const res = await env.BUCKET.list({
    prefix: `full/${roomId}/`,
    limit,
    cursor,
    include: ["customMetadata", "httpMetadata"],
  } as R2ListOptions & { include: ("httpMetadata" | "customMetadata")[] });

  const items = res.objects.map((o) => {
    const id = idFromFullKey(o.key);
    return {
      id,
      key: o.key,
      roomId,
      time: epochMsFromId(id),
      contentType: o.httpMetadata?.contentType || "application/octet-stream",
      hasThumb: o.customMetadata?.hasThumb === "true",
      source: o.customMetadata?.source || "unknown",
      origName: o.customMetadata?.origName || "",
      size: o.size,
    };
  });

  // Sort: newest is R2's natural order (inverted timestamp in key = newest first).
  // For oldest or name, we need to sort in-memory.
  if (sort === "oldest") {
    items.sort((a, b) => a.time - b.time);
  } else if (sort === "name") {
    items.sort((a, b) => (a.origName || a.id).localeCompare(b.origName || b.id));
  }

  // Filter by content type.
  if (type === "image") {
    items.splice(0, items.length, ...items.filter((i) => i.contentType.startsWith("image/")));
  } else if (type === "text") {
    items.splice(0, items.length, ...items.filter((i) => i.contentType.startsWith("text/")));
  } else if (type === "video") {
    items.splice(0, items.length, ...items.filter((i) => i.contentType.startsWith("video/")));
  } else if (type === "doc") {
    const docTypes = ["application/pdf", "application/zip", "application/msword", "application/vnd.openxmlformats-officedocument.", "application/vnd.ms-excel"];
    items.splice(0, items.length, ...items.filter((i) => docTypes.some((t) => i.contentType.includes(t))));
  }

  // Text previews ride along with the list rather than costing one browser
  // round-trip each. Concurrency is limited to avoid overwhelming R2.
  const textItems = items.filter((i) => i.contentType.startsWith("text/"));
  const snippetsToFetch = textItems.slice(0, MAX_INLINE_SNIPPETS);
  for (let i = 0; i < snippetsToFetch.length; i += SNIPPET_CONCURRENCY) {
    const batch = snippetsToFetch.slice(i, i + SNIPPET_CONCURRENCY);
    await Promise.all(
      batch.map(async (item) => {
        try {
          const obj = await env.BUCKET.get(item.key);
          if (!obj) return;
          (item as { snippet?: string }).snippet = (await obj.text()).slice(0, SNIPPET_CHARS);
        } catch {
          // Leave snippet unset: the client still lazy-fetches anything without
          // one, so a failed read here degrades to the previous behaviour rather
          // than to an empty card.
        }
      })
    );
  }

  // `key` is an internal R2 path; it exists only to fetch the snippet above
  // and must not leak into the response the client caches.
  const payload = items.map(({ key: _key, ...rest }) => rest);

  return json({ items: payload, cursor: res.truncated ? res.cursor : null });
}
