import { randomBytes } from 'crypto'

interface OIDCConfig {
  authorization_endpoint: string
  token_endpoint: string
  userinfo_endpoint: string
}

let cachedConfig: OIDCConfig | null = null

async function getOIDCConfig(): Promise<OIDCConfig> {
  if (cachedConfig) return cachedConfig
  const res = await fetch(
    `${process.env.COLOOP_ISSUER}/.well-known/openid-configuration`,
  )
  if (!res.ok) throw new Error(`OIDC discovery failed: ${res.status}`)
  cachedConfig = (await res.json()) as OIDCConfig
  return cachedConfig
}

export function generateState(): string {
  return randomBytes(16).toString('base64url')
}

export async function buildAuthorizeUrl(state: string): Promise<string> {
  const { authorization_endpoint } = await getOIDCConfig()
  const params = new URLSearchParams({
    client_id: process.env.COLOOP_CLIENT_ID!,
    redirect_uri: process.env.COLOOP_REDIRECT_URI!,
    response_type: 'code',
    scope: process.env.COLOOP_SCOPES!,
    state,
  })
  return `${authorization_endpoint}?${params}`
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  id_token?: string
  token_type: string
}

export async function exchangeCode(code: string): Promise<TokenResponse> {
  const { token_endpoint } = await getOIDCConfig()
  const res = await fetch(token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.COLOOP_CLIENT_ID!,
      client_secret: process.env.COLOOP_CLIENT_SECRET!,
      redirect_uri: process.env.COLOOP_REDIRECT_URI!,
      code,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Token exchange failed: ${body}`)
  }
  return res.json()
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse> {
  const { token_endpoint } = await getOIDCConfig()
  const res = await fetch(token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.COLOOP_CLIENT_ID!,
      client_secret: process.env.COLOOP_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Token refresh failed: ${body}`)
  }
  return res.json()
}

interface UserInfo {
  sub: string
  email: string
  name?: string
}

export async function fetchUserInfo(accessToken: string): Promise<UserInfo> {
  const { userinfo_endpoint } = await getOIDCConfig()
  const res = await fetch(userinfo_endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`UserInfo request failed: ${res.status}`)
  return res.json()
}
