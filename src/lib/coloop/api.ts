import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './api-types'
import { getSession } from './session'

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const session = await getSession()
    if (!session) throw new Error('Not authenticated')
    request.headers.set('Authorization', `Bearer ${session.accessToken}`)
    return request
  },
}

export function createCoLoopClient() {
  const client = createClient<paths>({
    baseUrl: process.env.COLOOP_API_URL,
  })
  client.use(authMiddleware)
  return client
}
