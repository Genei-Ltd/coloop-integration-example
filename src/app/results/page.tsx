import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { conversations } from '@/lib/sample/mock-data'
import { getSession } from '@/lib/coloop/session'
import { ExportButton } from '@/components/export-button'

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

export default async function ResultsPage() {
  const session = await getSession()
  const completed = conversations.filter((c) => c.status === 'completed')

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
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {session.user.email}
                </span>
                <form action="/api/auth/logout" method="post">
                  <Button variant="outline" size="sm" type="submit">
                    Disconnect
                  </Button>
                </form>
              </>
            ) : (
              <Button
                className="bg-[#1a4d4d] text-white hover:bg-[#163f3f]"
                size="sm"
                asChild
              >
                <a href="/api/auth/login">Connect to CoLoop</a>
              </Button>
            )}
          </div>
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
        <div className="mb-4 flex items-center justify-between">
          <Tabs defaultValue="completed">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger
                value="completed"
                className="rounded-full bg-[#1a4d4d] px-4 text-white data-[state=active]:bg-[#1a4d4d] data-[state=active]:text-white"
              >
                Completed ({completed.length})
              </TabsTrigger>
              <TabsTrigger
                value="incomplete"
                className="rounded-full px-4"
                disabled
              >
                Incomplete (0)
              </TabsTrigger>
              <TabsTrigger
                value="screened"
                className="rounded-full px-4"
                disabled
              >
                Screened Out (0)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <ExportButton />
          </div>
        </div>

        <div className="rounded-lg border border-[#e8e0d8] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-[#e8e0d8]">
                <TableHead className="w-[180px]">Participant</TableHead>
                <TableHead>Conversation ID</TableHead>
                <TableHead>Start time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead className="max-w-[300px]">Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completed.map((conv) => (
                <TableRow
                  key={conv.id}
                  className="border-[#e8e0d8] hover:bg-[#faf8f5]"
                >
                  <TableCell>
                    <Link
                      href={`/results/${conv.id}`}
                      className="flex items-center gap-2 font-medium hover:underline"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm">
                        🧑
                      </div>
                      {conv.participantName}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {conv.id}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(conv.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm">{conv.duration}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        conv.quality === 'High'
                          ? 'border-[oklch(0.88_0.06_160)] bg-[oklch(0.96_0.03_160)] text-[oklch(0.45_0.08_160)]'
                          : conv.quality === 'Medium'
                            ? 'border-[oklch(0.88_0.06_85)] bg-[oklch(0.96_0.03_85)] text-[oklch(0.5_0.08_85)]'
                            : 'border-[oklch(0.88_0.05_25)] bg-[oklch(0.96_0.02_25)] text-[oklch(0.55_0.08_25)]'
                      }
                    >
                      {conv.quality}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                    {conv.summary}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
