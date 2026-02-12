import { type NextRequest, NextResponse } from 'next/server'
import { deleteTokens } from '@/lib/coloop/token-store'

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value
  if (sessionId) {
    deleteTokens(sessionId)
  }

  const response = NextResponse.redirect(new URL('/', request.url), 303)
  response.cookies.delete('session_id')
  return response
}
