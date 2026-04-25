export interface IJWTPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  type: string;
  exp: number;
  iat: number;
}

export function decodeJWT(token: string): IJWTPayload | null {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    return JSON.parse(payload) as IJWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: IJWTPayload): boolean {
  return Date.now() >= payload.exp * 1000;
}
