import { json } from "../responses";
import { FULL_EXTS } from "../ids";

export const SUPPORTED_TYPES = {
  images: ["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp", "ico"],
  documents: ["pdf", "doc", "docx", "xls", "xlsx", "txt", "html", "css", "js", "json", "xml", "zip"],
  all: FULL_EXTS,
};

export function handleFormats(): Response {
  return json({
    name: "shotsync API",
    version: "1.0",
    endpoints: [
      {
        path: "/",
        method: "GET",
        description: "Web gallery UI",
        auth: false,
      },
      {
        path: "/api/list",
        method: "GET",
        description: "List all items in a room",
        auth: true,
        params: {
          limit: "number (optional, default 50, max 100)",
          cursor: "string (optional, for pagination)",
        },
        headers: {
          "x-room-id": "string (optional, default 'gallery')",
        },
      },
      {
        path: "/api/upload",
        method: "POST",
        description: "Upload a file",
        auth: true,
        headers: {
          "x-room-id": "string (optional, default 'gallery')",
          "x-source": "string (optional, e.g. 'pwa', 'mac', 'curl')",
          "x-filename": "string (optional, original filename)",
        },
        body: "multipart/form-data with 'full' and optional 'thumb' fields",
      },
      {
        path: "/i/<id>",
        method: "GET",
        description: "Get file content",
        auth: false,
        params: {
          room: "string (required)",
          size: "string (optional, 'thumb' or 'full', default 'full')",
        },
      },
      {
        path: "/api/img/<id>",
        method: "DELETE",
        description: "Delete a file",
        auth: true,
        params: {
          room: "string (required)",
        },
      },
      {
        path: "/api/room/<roomId>",
        method: "DELETE",
        description: "Delete all files in a room",
        auth: true,
      },
      {
        path: "/api/share/<id>",
        method: "POST",
        description: "Create a signed share link (7 days)",
        auth: true,
        params: {
          room: "string (required, via query param)",
        },
        response: {
          url: "string (signed URL)",
          exp: "number (expiration timestamp)",
        },
      },
      {
        path: "/s/<id>",
        method: "GET",
        description: "Access shared file (no auth required)",
        params: {
          exp: "number (expiration timestamp)",
          sig: "string (HMAC signature)",
          room: "string (required)",
        },
      },
      {
        path: "/api/formats",
        method: "GET",
        description: "This API documentation",
        auth: false,
      },
    ],
    supportedFormats: SUPPORTED_TYPES,
    maxFileSize: "25MB",
    shareLinkExpiry: "7 days",
  });
}
