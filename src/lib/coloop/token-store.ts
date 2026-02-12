// In-memory token store. Fine for development, but replace with Redis, Postgres,
// or whatever your app already uses for sessions before going to production.

export interface TokenSet {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  user: {
    sub: string
    email: string
    name?: string
  }
}

// Pinned to globalThis so the same Map is shared across Next.js module layers
// (route handlers vs server components) and survives Turbopack HMR in dev.
const g = globalThis as unknown as {
  __coloopTokenStore?: Map<string, TokenSet>
}
const store = (g.__coloopTokenStore ??= new Map<string, TokenSet>())

export function getTokens(sessionId: string): TokenSet | undefined {
  return store.get(sessionId)
}

export function setTokens(sessionId: string, tokens: TokenSet): void {
  store.set(sessionId, tokens)
}

export function deleteTokens(sessionId: string): void {
  store.delete(sessionId)
}
