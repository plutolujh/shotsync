import { Env, err, json } from "../responses";
import { isAuthed } from "../auth";

const BATCH_SIZE = 100;

// GET /api/folders?room=<roomId>&path=<path> — list folders at a given path
export async function handleFolderList(request: Request, env: Env): Promise<Response> {
  if (!isAuthed(request, env)) return err(401, "unauthorized");

  const url = new URL(request.url);
  const roomId = url.searchParams.get("room") || "gallery";
  const folderPath = url.searchParams.get("path") || "_root"; // "_root" means root level

  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(roomId)) {
    return err(400, "invalid room id");
  }

  // Validate folder path: alphanumeric, hyphens, underscores, slashes
  // Path like "work", "work/screenshots", "travel/2024"
  if (!/^[a-zA-Z0-9_/-]{0,128}$/.test(folderPath)) {
    return err(400, "invalid folder path");
  }

  // Build prefix for listing
  const prefix = folderPath === "_root" ? `full/${roomId}/` : `full/${roomId}/${folderPath}/`;

  // List all objects with this prefix to find subfolders
  const listing = await env.BUCKET.list({
    prefix,
    limit: BATCH_SIZE,
    delimiter: "/", // This will give us common prefixes (subfolders)
  });

  // Extract unique subfolder names
  const subfolders = new Set<string>();
  for (const prefix of listing.delimitedPrefixes || []) {
    // prefix format: "full/<roomId>/<folder>/" or "full/<roomId>/<folder>/<subfolder>/"
    const relativePath = prefix.slice(`full/${roomId}/`.length);
    const firstSegment = relativePath.split("/")[0];
    if (firstSegment) {
      subfolders.add(firstSegment);
    }
  }

  // If we're already in a folder, include parent folder info
  let parentPath: string | null = null;
  if (folderPath !== "_root") {
    const parts = folderPath.split("/");
    parts.pop(); // Remove last segment
    parentPath = parts.length === 0 ? "_root" : parts.join("/");
  }

  return json({
    roomId,
    path: folderPath,
    parentPath,
    folders: [...subfolders].sort(),
  });
}

// POST /api/folders — create a new folder
export async function handleFolderCreate(request: Request, env: Env): Promise<Response> {
  if (!isAuthed(request, env)) return err(401, "unauthorized");

  let body: { roomId?: string; path?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return err(400, "expected JSON body");
  }

  const roomId = body?.roomId || "gallery";
  const folderPath = body?.path || "";

  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(roomId)) {
    return err(400, "invalid room id");
  }

  // Validate folder name: alphanumeric, hyphens, underscores, max depth 3
  if (!/^[a-zA-Z0-9_/-]{1,64}$/.test(folderPath)) {
    return err(400, "invalid folder path");
  }

  // Check depth (max 3 levels)
  const depth = folderPath.split("/").filter(Boolean).length;
  if (depth > 3) {
    return err(400, "max folder depth is 3");
  }

  // Create a marker file to represent the folder
  // This ensures the folder appears in listings even when empty
  const markerKey = `folder/${roomId}/${folderPath}/.marker`;
  await env.BUCKET.put(markerKey, new Blob([""], { type: "text/plain" }));

  return json({ success: true, roomId, path: folderPath });
}

// DELETE /api/folders?room=<roomId>&path=<path> — delete an empty folder
export async function handleFolderDelete(request: Request, env: Env): Promise<Response> {
  if (!isAuthed(request, env)) return err(401, "unauthorized");

  const url = new URL(request.url);
  const roomId = url.searchParams.get("room") || "";
  const folderPath = url.searchParams.get("path") || "";

  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(roomId)) {
    return err(400, "invalid room id");
  }

  if (!folderPath) {
    return err(400, "folder path required");
  }

  // Check if folder is empty
  const prefix = folderPath === "_root" ? `full/${roomId}/` : `full/${roomId}/${folderPath}/`;
  const listing = await env.BUCKET.list({
    prefix,
    limit: 1,
  });

  if (listing.objects.length > 0) {
    return err(400, "folder is not empty, delete files first");
  }

  // Delete the folder marker
  const markerKey = `folder/${roomId}/${folderPath}/.marker`;
  try {
    await env.BUCKET.delete(markerKey);
  } catch {
    // Marker might not exist, that's ok
  }

  return json({ success: true, roomId, path: folderPath });
}
