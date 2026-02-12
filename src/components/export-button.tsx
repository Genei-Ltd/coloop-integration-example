'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  listOrganizations,
  listProjects,
  createProject,
  exportToCoLoop,
  type ExportResult,
} from '@/app/actions/export'
import { conversations } from '@/lib/sample/mock-data'

type Step = 'form' | 'exporting' | 'results'

export function ExportButton() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('form')
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([])
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [selectedOrg, setSelectedOrg] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [results, setResults] = useState<ExportResult[]>([])
  const [error, setError] = useState('')
  const [loadingProjects, setLoadingProjects] = useState(false)

  const completed = conversations.filter((c) => c.status === 'completed')

  async function handleOpen() {
    setStep('form')
    setSelectedOrg('')
    setSelectedProject('')
    setNewProjectName('')
    setProjects([])
    setResults([])
    setError('')
    setOpen(true)
    try {
      const data = await listOrganizations()
      setOrgs(data)
    } catch {
      setError('Connect to CoLoop first.')
    }
  }

  async function handleOrgSelect(orgId: string) {
    setSelectedOrg(orgId)
    setSelectedProject('')
    setProjects([])
    setLoadingProjects(true)
    try {
      const data = await listProjects(orgId)
      setProjects(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects')
    } finally {
      setLoadingProjects(false)
    }
  }

  async function handleExport() {
    let projectId = selectedProject

    if (projectId === '__new__' && newProjectName.trim()) {
      try {
        const p = await createProject(selectedOrg, newProjectName.trim())
        projectId = p.id
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create project')
        return
      }
    }

    if (!projectId || projectId === '__new__') return

    setStep('exporting')
    try {
      const allIds = completed.map((c) => c.id)
      const data = await exportToCoLoop(selectedOrg, projectId, allIds)
      setResults(data)
      setStep('results')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed')
      setStep('form')
    }
  }

  const created = results.filter((r) => r.status === 'created').length
  const skipped = results.filter((r) => r.status === 'skipped').length
  const failed = results.filter((r) => r.status === 'failed').length

  const canExport =
    selectedOrg &&
    selectedProject &&
    (selectedProject !== '__new__' || newProjectName.trim())

  return (
    <>
      <Button
        className="bg-[#1a4d4d] text-white hover:bg-[#163f3f]"
        size="sm"
        onClick={handleOpen}
      >
        Export to CoLoop
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-[440px] flex-col gap-0 bg-[#faf8f5] p-0 sm:max-w-[440px]">
          <SheetHeader className="bg-white p-5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a4d4d] text-xs font-semibold text-white">
                C
              </div>
              <div>
                <SheetTitle className="text-base">
                  {step === 'form' && 'Export to CoLoop'}
                  {step === 'exporting' && 'Exporting...'}
                  {step === 'results' && 'Export complete'}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {step === 'form' &&
                    `${completed.length} transcripts ready to export`}
                  {step === 'exporting' &&
                    `Pushing ${completed.length} transcripts...`}
                  {step === 'results' &&
                    `${created} created, ${skipped} skipped, ${failed} failed`}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <Separator className="bg-[#e8e0d8]" />

          {error && (
            <div className="mx-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 'form' && (
            <div className="flex flex-1 flex-col">
              <div className="flex-1 space-y-5 p-5">
                <div className="rounded-lg border border-[#e8e0d8] bg-white p-4">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Organisation
                  </label>
                  <Select value={selectedOrg} onValueChange={handleOrgSelect}>
                    <SelectTrigger className="border-[#e8e0d8]">
                      <SelectValue placeholder="Select organisation..." />
                    </SelectTrigger>
                    <SelectContent>
                      {orgs.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOrg && (
                  <div className="rounded-lg border border-[#e8e0d8] bg-white p-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Project
                    </label>
                    {loadingProjects ? (
                      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-[#1a4d4d]" />
                        Loading projects...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Select
                          value={selectedProject}
                          onValueChange={setSelectedProject}
                        >
                          <SelectTrigger className="border-[#e8e0d8]">
                            <SelectValue placeholder="Select project..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__new__">
                              + Create new project
                            </SelectItem>
                            {projects.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedProject === '__new__' && (
                          <input
                            type="text"
                            placeholder="Project name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className="w-full rounded-md border border-[#e8e0d8] bg-[#faf8f5] px-3 py-2 text-sm outline-none focus:border-[#1a4d4d] focus:ring-1 focus:ring-[#1a4d4d]"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {selectedOrg && selectedProject && (
                  <div className="rounded-lg border border-[#e8e0d8] bg-white p-4">
                    <label className="mb-2.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Transcripts
                    </label>
                    <div className="space-y-1.5">
                      {completed.map((conv) => (
                        <div
                          key={conv.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs">
                              🧑
                            </div>
                            <span>{conv.participantName}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {conv.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <SheetFooter className="border-t border-[#e8e0d8] bg-white p-5">
                <Button
                  className="w-full bg-[#1a4d4d] hover:bg-[#163f3f]"
                  onClick={handleExport}
                  disabled={!canExport}
                >
                  Export {completed.length} transcripts
                </Button>
              </SheetFooter>
            </div>
          )}

          {step === 'exporting' && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8e0d8] border-t-[#1a4d4d]" />
              <p className="text-sm text-muted-foreground">
                Sending to CoLoop...
              </p>
            </div>
          )}

          {step === 'results' && (
            <div className="flex flex-1 flex-col">
              <div className="flex-1 p-5">
                <div className="rounded-lg border border-[#e8e0d8] bg-white">
                  {results.map((r, i) => (
                    <div
                      key={r.externalId}
                      className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-[#e8e0d8]' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs">
                          🧑
                        </div>
                        <span className="text-sm">
                          {completed.find(
                            (c) => `conv-${c.id}` === r.externalId,
                          )?.participantName ?? r.externalId}
                        </span>
                      </div>
                      <Badge
                        className={
                          r.status === 'created'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
                            : r.status === 'skipped'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                              : 'bg-red-100 text-red-800 hover:bg-red-100'
                        }
                      >
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <SheetFooter className="border-t border-[#e8e0d8] bg-white p-5">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Done
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
