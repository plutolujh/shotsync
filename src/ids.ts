export const INV_BASE = 8_000_000_000_000_000;

export const EXT_BY_TYPE: Record<string, string> = {
  // Images
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/x-icon": "ico",
  // Text
  "text/plain": "txt",
  "text/html": "html",
  "text/css": "css",
  "text/javascript": "js",
  "application/json": "json",
  "application/xml": "xml",
  // Documents
  "application/pdf": "pdf",
  "application/zip": "zip",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  // Videos
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/x-m4v": "m4v",
  "video/webm": "webm",
  "video/x-msvideo": "avi",
  "video/mpeg": "mpeg",
  "video/3gpp": "3gp",
  // Fallback for unrecognized MIME types (use extension from filename)
  "application/octet-stream": "",
};

// Candidate extensions a `full/<id>.<ext>` object may carry. Used when probing
// for an object whose ext is unknown (image serve / delete). Shared so the
// serve and delete paths can never drift out of sync.
export const FULL_EXTS = ["png", "jpg", "webp", "gif", "svg", "bmp", "ico", "txt", "html", "css", "js", "json", "xml", "pdf", "zip", "doc", "docx", "xls", "xlsx", "mp4", "mov", "m4v", "webm", "avi", "mpeg", "3gp"];

// Allowed extensions map (reverse lookup from EXT_BY_TYPE)
export const ALLOWED_EXTS = new Set(FULL_EXTS);

export function makeId(epochMs: number, rand: string): string {
  const inv = (INV_BASE - epochMs).toString().padStart(16, "0");
  return `${inv}-${rand}`;
}

export function epochMsFromId(id: string): number {
  const inv = Number(id.slice(0, 16));
  return INV_BASE - inv;
}

export function fullKey(roomId: string, id: string, ext: string): string {
  return `full/${roomId}/${id}.${ext}`;
}

export function thumbKey(roomId: string, id: string): string {
  return `thumb/${roomId}/${id}.jpg`;
}

export function idFromFullKey(key: string): string {
  // Key format: full/<roomId>/<id>.<ext>
  const parts = key.split("/");
  const name = parts[parts.length - 1];
  const dot = name.lastIndexOf(".");
  return dot === -1 ? name : name.slice(0, dot);
}

export function roomIdFromKey(key: string): string {
  // Key format: full/<roomId>/<id>.<ext> or thumb/<roomId>/<id>.jpg
  const parts = key.split("/");
  return parts.length >= 3 ? parts[1] : "";
}

export function randSuffix(): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz"; // 36 symbols
  const out: string[] = [];
  const bytes = new Uint8Array(6);
  while (out.length < 6) {
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (out.length >= 6) break;
      if (b < 252) out.push(chars[b % 36]); // reject 252-255 to keep distribution uniform
    }
  }
  return out.join("");
}
