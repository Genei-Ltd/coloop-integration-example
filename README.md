# CoLoop Integration Example

A working Next.js app that authenticates with CoLoop via OAuth 2.0 and pushes AI-moderated interview transcripts into a CoLoop project using the batch import API.

Use this as a starting point for your own integration, or just read the code to understand the moving parts.

## What it does

1. Connects to CoLoop using OAuth 2.0 Authorization Code grant
2. Lists the user's CoLoop organisations and projects
3. Shows a sample results page with mock interview transcripts
4. Exports those transcripts into a CoLoop project via the batch import endpoint

The sample data models a typical AI moderation workflow: an automated interviewer asks questions and a participant responds. Each conversation maps to one CoLoop transcript.

## Getting started

You will need credentials from CoLoop. Reach out to adrien@coloop.ai and we will provision a `client_id`, `client_secret`, and register your redirect URIs.

### 1. Install dependencies

```
bun install
```

### 2. Configure environment

Copy the example env file and fill in your credentials:

```
cp .env.example .env
```

```
COLOOP_CLIENT_ID=<your client id>
COLOOP_CLIENT_SECRET=<your client secret>
COLOOP_ISSUER=https://clerk.coloop.ai
COLOOP_REDIRECT_URI=http://localhost:3000/api/auth/callback
COLOOP_SCOPES="email offline_access profile"
COLOOP_API_URL=https://api.coloop.ai
```

### 3. Run the dev server

```
bun dev
```

Open http://localhost:3000, click "Connect to CoLoop", and walk through the OAuth consent flow. Once connected, navigate to the results page and try exporting transcripts.

## Project structure

```
src/
├── lib/coloop/
│   ├── api.ts             Typed API client (openapi-fetch + auth middleware)
│   ├── api-types.ts       Generated types from openapi.json
│   ├── session.ts         Read session cookie, auto-refresh expired tokens
│   ├── token-store.ts     In-memory session store (swap for Redis/Postgres)
│   └── oauth.ts           OIDC discovery, token exchange, refresh
│
├── app/api/auth/
│   ├── login/route.ts     Redirects to CoLoop's authorize endpoint
│   ├── callback/route.ts  Exchanges the auth code for tokens
│   └── logout/route.ts    Clears the session
│
├── app/actions/
│   └── export.ts          Server action: maps conversations to CoLoop format
│                          and calls the batch import endpoint
│
├── app/results/
│   ├── page.tsx            Transcript list with export dialog
│   └── [conversationId]/
│       └── page.tsx        Single transcript, chat-style view
│
└── lib/sample/
    └── mock-data.ts       Sample interview conversations
```

## How the OAuth flow works

The app implements the standard OAuth 2.0 Authorization Code grant against CoLoop's Clerk-based identity provider.

`GET /api/auth/login` generates a random `state` parameter, stores it in an httpOnly cookie, and redirects the browser to the CoLoop authorize endpoint. After the user consents, Clerk redirects back to `GET /api/auth/callback` with an authorization code. The callback validates the state, exchanges the code for an access token and refresh token using the client secret, fetches the user's profile from the OIDC userinfo endpoint, and stores everything in the session.

The session store is an in-memory `Map` pinned to `globalThis`. This is fine for running the example locally. In production, replace it with any durable store your app already uses.

Token refresh is handled transparently by `getSession()`, which checks the expiry and refreshes automatically before returning the access token.

## How the export works

The export server action in `src/app/actions/export.ts` maps each conversation to the shape expected by CoLoop's batch import endpoint:

- Each conversation becomes one transcript with `type: "text"`
- The conversation ID is used as the `externalId` for idempotency
- The AI interviewer maps to a speaker with `role: "moderator"`
- The participant maps to a speaker with `role: "participant"`, with quality and language as segments
- Messages map to turns, ordered by `speakerIndex`

The batch endpoint processes each transcript independently and returns a per-item result: `created`, `skipped` (if the `externalId` already exists in the project), or `failed` with a structured error.

## Typed API client

API calls are fully typed using types generated from the OpenAPI schema. The client is built with [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) and gives you autocomplete on paths, typed request bodies, and typed responses.

```ts
const client = createCoLoopClient()

const { data, error } = await client.GET('/v1/organizations/')

await client.POST('/v1/organizations/{organizationId}/projects/', {
  params: { path: { organizationId: orgId } },
  body: { name, projectTags: [] },
})
```

If the API schema changes, pull the latest version and regenerate:

```
curl -o openapi.json https://api.coloop.ai/docs/openapi.json
bun run generate-types
```

The full OpenAPI schema is included at `openapi.json` in the repo root. You can also browse the interactive reference at https://api.coloop.ai/docs.

## What to change for production

- Replace the in-memory token store (`src/lib/coloop/token-store.ts`) with Redis, Postgres, or your existing session infrastructure.
- Replace the mock data in `src/lib/sample/mock-data.ts` with real conversations from your platform.
- Add proper error handling and retry logic for failed transcript imports (check the `retriable` flag on errors).
- Store the user's selected CoLoop organisation and project so they don't have to pick them every time.

## Support

Questions about the API or your integration? Email support@coloop.ai.
