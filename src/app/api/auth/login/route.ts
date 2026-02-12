import { NextResponse } from 'next/server'
import { buildAuthorizeUrl, generateState } from '@/lib/coloop/oauth'

export async function GET() {
  const state = generateState()
  const url = await buildAuthorizeUrl(state)

  const response = NextResponse.redirect(url)
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 600,
  })
  return response
}
