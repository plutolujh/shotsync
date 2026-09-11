import { Env } from "./responses";

function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = 0;
  for (let i = 0; i < len; i++) {
    diff ^= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

// Read access: on a demo pool everyone may view; otherwise same as isAuthed.
export function canRead(request: Request, env: Env): boolean {
  return env.DEMO_MODE === "1" || isAuthed(request, env);
}

export function isAuthed(request: Request, env: Env): boolean {
  // No server token configured (misconfig or secret not yet propagated) -> deny
  // cleanly. Never fall through to the comparison, which would read .length of
  // undefined and throw (surfaces as a 1101 instead of a clean 401).
  if (!env.AUTH_TOKEN) return false;
  const h = request.headers.get("authorization") || "";
  const prefix = "Bearer ";
  if (!h.startsWith(prefix)) return false;
  return constantTimeEqual(h.slice(prefix.length), env.AUTH_TOKEN);
}
