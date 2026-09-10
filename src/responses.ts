/// <reference types="@cloudflare/workers-types" />

export interface Env {
  BUCKET: R2Bucket;
  AUTH_TOKEN: string;
  // "1" on the public demo deployment: reads (list/view) skip auth, writes
  // (upload/delete/share-create) still require the token. Unset in normal pools.
  DEMO_MODE?: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, x-room-id, x-source, x-filename",
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

export function err(status: number, message: string): Response {
  return json({ error: message }, status);
}
