export interface JWTPayload {
  sub: string; // id do usuário
  name: string;
  email: string;
  role: "admin" | "user";
  jwtRefreshToken?: string;
  exp: number;
}

/**
 * Decodifica o payload do JWT (sem verificar assinatura).
 * A verificação da assinatura deve ser feita no backend.
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
