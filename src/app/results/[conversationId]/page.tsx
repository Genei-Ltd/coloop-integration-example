import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getConversation } from '@/lib/sample/mock-data'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default async function TranscriptPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  const conversation = getConversation(conversationId)
  if (!conversation) notFound()

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="border-b border-[#e8e0d8] bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a4d4d] text-xs font-medium text-white">
              C
            </div>
            <span>/</span>
            <span>My workspace</span>
            <span>/</span>
            <span className="text-foreground font-medium">
              Research repository needs
            </span>
          </div>
          <Badge className="bg-[#1a4d4d] text-white hover:bg-[#1a4d4d]">
            Completed
          </Badge>
        </div>
      </header>

      <div className="border-b border-[#e8e0d8] bg-white">
        <nav className="flex gap-8 px-6">
          <span className="border-b-2 border-transparent px-1 py-3 text-sm text-muted-foreground">
            Overview
          </span>
          <span className="border-b-2 border-transparent px-1 py-3 text-sm text-muted-foreground">
            Questions
          </span>
          <span className="border-b-2 border-[#1a4d4d] px-1 py-3 text-sm font-medium text-[#1a4d4d]">
            Transcripts
          </span>
          <span className="border-b-2 border-transparent px-1 py-3 text-sm text-muted-foreground">
            AI Search
          </span>
        </nav>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/results">← Go back</Link>
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            {conversation.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'participant' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[560px]">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'participant'
                        ? 'bg-[#1a4d4d] text-white'
                        : 'border border-[#e8e0d8] bg-white text-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p
                    className={`mt-1 text-xs text-muted-foreground ${msg.role === 'participant' ? 'text-right' : ''}`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-[320px] shrink-0 rounded-lg border border-[#e8e0d8] bg-white p-5 text-sm">
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold">Conversation ID:</dt>
                <dd className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {conversation.id}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Created at:</dt>
                <dd className="mt-0.5 text-muted-foreground">
                  {formatDate(conversation.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Status:</dt>
                <dd className="mt-0.5 text-muted-foreground">Digested</dd>
              </div>
              <div>
                <dt className="font-semibold">Completion time:</dt>
                <dd className="mt-0.5 text-muted-foreground">
                  {conversation.duration}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Metadata:</dt>
                <dd className="mt-0.5 space-y-0.5 text-muted-foreground">
                  <p>Language: {conversation.language}</p>
                  <p>Computed_quality: {conversation.quality}</p>
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Total messages:</dt>
                <dd className="mt-0.5 text-muted-foreground">
                  {conversation.messages.length}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Conversation summary:</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  {conversation.summary}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
