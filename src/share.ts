// Signed share links: an item can be exposed via a public, tokenless URL that
// carries an HMAC signature over "<id>.<exp>.<roomId>". The signing key is the
// same shared secret (AUTH_TOKEN). The rest of the pool stays token-gated; only
// the signed id is reachable in the signed room, and only until `exp`.

async function hmacHex(secret: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return Array.from(new Uint8Array(mac), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function signShare(id: string, exp: number, roomId: string, secret: string): Promise<string> {
  return hmacHex(secret, `${id}.${exp}.${roomId}`);
}

export async function verifyShare(
  id: string,
  exp: number,
  roomId: string,
  sig: string,
  secret: string
): Promise<boolean> {
  const expected = await hmacHex(secret, `${id}.${exp}.${roomId}`);
  const len = Math.max(expected.length, sig.length);
  let diff = 0;
  for (let i = 0; i < len; i++) {
    diff ^= (expected.charCodeAt(i) || 0) ^ (sig.charCodeAt(i) || 0);
  }
  return diff === 0;
}
