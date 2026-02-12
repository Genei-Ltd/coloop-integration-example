import { cookies } from 'next/headers'
import { getTokens, setTokens, type TokenSet } from './token-store'
import { refreshAccessToken } from './oauth'

export async function getSession(): Promise<TokenSet | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value
  if (!sessionId) return null

  const tokens = getTokens(sessionId)
  if (!tokens) return null

  // Still valid (with 30s buffer)
  if (tokens.expiresAt > Date.now() + 30_000) return tokens

  // Try to refresh
  if (!tokens.refreshToken) return null
  try {
    const refreshed = await refreshAccessToken(tokens.refreshToken)
    const updated: TokenSet = {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? tokens.refreshToken,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
      user: tokens.user,
    }
    setTokens(sessionId, updated)
    return updated
  } catch {
    return null
  }
}
