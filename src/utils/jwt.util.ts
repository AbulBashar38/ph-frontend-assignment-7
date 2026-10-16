import type { UserRole } from "@/types";

export interface TokenClaims {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  // Seconds since epoch
  exp: number;
}

// Reads a JWT's payload WITHOUT verifying it. Only for routing decisions (proxy.ts); the backend verifies every call.
export function decodeTokenClaims(
  token: string | undefined,
): TokenClaims | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(json) as Partial<TokenClaims>;
    if (!claims.role || typeof claims.exp !== "number") return null;
    return claims as TokenClaims;
  } catch {
    return null;
  }
}

export function isTokenLive(claims: TokenClaims | null): claims is TokenClaims {
  return !!claims && claims.exp * 1000 > Date.now();
}
