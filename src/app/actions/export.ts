'use server'

import { createCoLoopClient } from '@/lib/coloop/api'
import { getSession } from '@/lib/coloop/session'
import { conversations, type Conversation } from '@/lib/sample/mock-data'

export interface ExportResult {
  status: 'created' | 'skipped' | 'failed'
  externalId: string
  transcriptId?: string
  error?: { message: string; retriable: boolean }
}

export async function listOrganizations() {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const client = createCoLoopClient()
  const { data, error } = await client.GET('/v1/organizations/')
  if (error) throw new Error(error.message)
  return data.items
}

export async function listProjects(orgId: string) {
  const client = createCoLoopClient()
  const { data, error } = await client.GET(
    '/v1/organizations/{organizationId}/projects/',
    { params: { path: { organizationId: orgId } } },
  )
  if (error) throw new Error(error.message)
  return data.items
}

export async function createProject(orgId: string, name: string) {
  const client = createCoLoopClient()
  const { data, error } = await client.POST(
    '/v1/organizations/{organizationId}/projects/',
    {
      params: { path: { organizationId: orgId } },
      body: { name, projectTags: [] },
    },
  )
  if (error) throw new Error(error.message)
  return data.data
}

function mapToCoLoopTranscript(conv: Conversation) {
  return {
    externalId: `conv-${conv.id}`,
    name: `${conv.participantName}: Research repository needs`,
    languageCode: 'en',
    type: 'text' as const,
    speakers: [
      { name: 'AI Interviewer', role: 'moderator' as const },
      {
        name: conv.participantName,
        role: 'participant' as const,
        segments: [conv.quality, conv.language],
      },
    ],
    turns: conv.messages.map((msg) => ({
      speakerIndex: msg.role === 'moderator' ? 0 : 1,
      text: msg.text,
    })),
  }
}

export async function exportToCoLoop(
  orgId: string,
  projectId: string,
  conversationIds: string[],
): Promise<ExportResult[]> {
  const selected = conversations.filter((c) => conversationIds.includes(c.id))
  if (selected.length === 0) throw new Error('No conversations selected')

  const transcripts = selected.map(mapToCoLoopTranscript)

  const client = createCoLoopClient()
  const { data, error } = await client.POST(
    '/v1/organizations/{organizationId}/projects/{projectId}/transcripts/batch/create',
    {
      params: { path: { organizationId: orgId, projectId } },
      body: { transcripts },
    },
  )
  if (error) throw new Error(error.message)

  return data.results as ExportResult[]
}
