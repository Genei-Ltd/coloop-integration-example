import { randomBytes } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { exchangeCode, fetchUserInfo } from '@/lib/coloop/oauth'
import { setTokens } from '@/lib/coloop/token-store'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
  }

  const savedState = request.cookies.get('oauth_state')?.value

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url))
  }

  let tokenResponse
  try {
    tokenResponse = await exchangeCode(code)
  } catch {
    return NextResponse.redirect(
      new URL('/?error=token_exchange_failed', request.url),
    )
  }

  const userInfo = await fetchUserInfo(tokenResponse.access_token)

  const sessionId = randomBytes(32).toString('base64url')
  setTokens(sessionId, {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    expiresAt: Date.now() + tokenResponse.expires_in * 1000,
    user: {
      sub: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
    },
  })

  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  response.cookies.delete('oauth_state')
  return response
}
