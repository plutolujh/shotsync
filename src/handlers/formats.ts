import { FULL_EXTS } from "../ids";

export const SUPPORTED_TYPES = {
  images: ["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp", "ico"],
  documents: ["pdf", "doc", "docx", "xls", "xlsx", "txt", "html", "css", "js", "json", "xml", "zip"],
  all: FULL_EXTS,
};

export function handleFormats(): Response {
  const md = `# shotsync API

**Version:** 1.0

## Overview

shotsync is a file sharing service with HMAC-signed share links. Authentication is via \`Authorization: Bearer <token>\` header.

## Endpoints

### GET /
Web gallery UI. No auth required.

---

### GET /api/list
List all items in a room.

**Auth:** Required

| Header | Description |
|--------|-------------|
| \`x-room-id\` | Room ID (default: \`gallery\`) |

| Param | Type | Description |
|-------|------|-------------|
| \`limit\` | number | Max items (default 50, max 100) |
| \`cursor\` | string | Pagination cursor |

---

### POST /api/upload
Upload a file.

**Auth:** Required

| Header | Description |
|--------|-------------|
| \`x-room-id\` | Room ID (default: \`gallery\`) |
| \`x-source\` | Upload source (e.g. \`pwa\`, \`mac\`, \`curl\`) |
| \`x-filename\` | Original filename |

**Body:** \`multipart/form-data\` with fields:
- \`full\` (required): The file
- \`thumb\` (optional): Thumbnail image

---

### GET /i/<id>
Get file content.

**Auth:** Not required

| Param | Type | Description |
|-------|------|-------------|
| \`room\` | string | Room ID (required) |
| \`size\` | string | \`thumb\` or \`full\` (default: \`full\`) |

---

### DELETE /api/img/<id>
Delete a file.

**Auth:** Required

| Param | Type | Description |
|-------|------|-------------|
| \`room\` | string | Room ID (required) |

---

### DELETE /api/room/<roomId>
Delete all files in a room.

**Auth:** Required

---

### POST /api/share/<id>
Create a signed share link (valid for 7 days).

**Auth:** Required

| Param | Description |
|--------|-------------|
| \`room\` | Room ID (required, via query param) |

**Response:**
\`\`\`json
{
  "url": "https://...",
  "exp": 1234567890
}
\`\`\`

---

### GET /s/<id>
Access a shared file (no auth required).

| Param | Type | Description |
|-------|------|-------------|
| \`exp\` | number | Expiration timestamp |
| \`sig\` | string | HMAC signature |
| \`room\` | string | Room ID (required) |

---

### GET /api/formats
This API documentation.

---

## Supported Formats

### Images
${SUPPORTED_TYPES.images.join(", ")}

### Documents
${SUPPORTED_TYPES.documents.join(", ")}

## Limits

- **Max file size:** 25MB
- **Share link expiry:** 7 days
`;

  return new Response(md, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
