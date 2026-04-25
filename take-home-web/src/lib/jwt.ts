export interface JWTPayload {
  sub: string; // user_id
  username: string; // user's full name
  email: string;
  roles: string[]; // e.g. ["user"] or ["admin"]
  type: string; // "access_token"
  exp: number;
  iat: number;
}

/**
 * Decodifica o payload do JWT (sem verificar assinatura).
 * A verificação da assinatura é feita no backend.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    return JSON.parse(payload) as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JWTPayload): boolean {
  return Date.now() >= payload.exp * 1000;
}
