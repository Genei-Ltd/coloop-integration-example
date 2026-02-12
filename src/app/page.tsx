import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/coloop/session'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getSession()
  if (session) redirect('/results')

  const { error } = await searchParams

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8f5]">
      <header className="border-b border-[#e8e0d8] bg-white px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a4d4d] text-xs font-semibold text-white">
            C
          </div>
          <span className="text-sm font-medium">
            CoLoop Integration Example
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a4d4d] text-2xl font-bold text-white">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Connect to CoLoop
          </h1>
          <p className="mt-2 text-balance text-sm text-muted-foreground">
            Authenticate with your CoLoop account to export interview
            transcripts into a CoLoop project.
          </p>
          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Authentication failed: {error}
            </p>
          )}
          <div className="mt-6">
            <Button
              className="bg-[#1a4d4d] text-white hover:bg-[#163f3f]"
              asChild
            >
              <a href="/api/auth/login">Connect to CoLoop</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
