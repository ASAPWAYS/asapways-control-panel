import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusDot } from "@/components/ui/status-dot"
import { formatLongDate } from "@/lib/format-date"
import { useAuth } from "@/lib/auth/use-auth"
import { ApiError } from "@/lib/api/client"
import {
  listProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  toggleProvider,
  providerTypes,
  type ApiProvider,
  type ProviderType,
} from "@/lib/api/providers"

function ProviderDialog({
  provider,
  type,
  open,
  onOpenChange,
  onSaved,
}: {
  provider: ApiProvider | null
  type: ProviderType
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const { request } = useAuth()
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [providerId, setProviderId] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = provider !== null

  useEffect(() => {
    if (!open) return
    setName(provider?.name ?? "")
    setImage(provider?.image ?? "")
    setProviderId(provider?.providerId ?? "")
    setIsActive(provider?.isActive ?? true)
    setError(null)
  }, [open, provider])

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit) {
        await updateProvider(request, type, provider.id, { name, image, isActive })
      } else {
        await createProvider(request, type, { name, image, providerId, isActive })
      }
      onOpenChange(false)
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-background p-6 sm:max-w-sm">
        <DialogTitle className="text-lg font-bold text-foreground">
          {isEdit ? "Edit Provider" : "Add Provider"}
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-10 rounded-lg"
            />
          </div>

          {!isEdit ? (
            <div>
              <Label className="text-sm font-medium text-foreground">Provider ID</Label>
              <Input
                value={providerId}
                onChange={(event) => setProviderId(event.target.value.toUpperCase())}
                placeholder="e.g. MTN"
                className="mt-2 h-10 rounded-lg"
              />
            </div>
          ) : null}

          <div>
            <Label className="text-sm font-medium text-foreground">Image URL</Label>
            <Input
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://..."
              className="mt-2 h-10 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Active</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {error ? <p className="text-sm text-status-critical">{error}</p> : null}

          <div className="flex justify-end">
            <Button
              disabled={submitting || !name}
              onClick={handleSubmit}
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Provider"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProvidersPage() {
  const { request } = useAuth()
  const [type, setType] = useState<ProviderType>("airtime-data")
  const [providers, setProviders] = useState<ApiProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<ApiProvider | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<ApiProvider | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProviders(await listProviders(request, type))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load providers")
    } finally {
      setLoading(false)
    }
  }, [request, type])

  useEffect(() => {
    load()
  }, [load])

  async function handleToggle(provider: ApiProvider) {
    try {
      await toggleProvider(request, type, provider.id)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle provider")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">Bill Providers ⚡</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Date</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatLongDate(new Date())}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={type} onValueChange={(value) => setType(value as ProviderType)}>
            <TabsList variant="line" className="h-auto gap-6 p-0">
              {providerTypes.map((item) => (
                <TabsTrigger key={item.value} value={item.value} className="px-0 pb-2 text-sm">
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            className="h-10 gap-2 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              setEditTarget(null)
              setDialogOpen(true)
            }}
          >
            <Plus className="size-3.5" />
            Add Provider
          </Button>
        </div>

        {error ? <p className="mt-4 text-sm text-status-critical">{error}</p> : null}

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No providers of this type yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground">Name</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Provider ID</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs text-muted-foreground" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider.id} className="border-border">
                    <TableCell className="font-medium text-foreground">{provider.name}</TableCell>
                    <TableCell className="text-muted-foreground">{provider.providerId}</TableCell>
                    <TableCell>
                      <StatusDot
                        tone={provider.isActive ? "good" : "neutral"}
                        label={provider.isActive ? "Active" : "Inactive"}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full px-3"
                          onClick={() => handleToggle(provider)}
                        >
                          {provider.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                          onClick={() => {
                            setEditTarget(provider)
                            setDialogOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-full px-3"
                          onClick={() => setPendingDelete(provider)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <ProviderDialog
        provider={editTarget}
        type={type}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={load}
      />

      <ConfirmActionDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        tone="critical"
        title="Delete this provider?"
        description="This removes it from the bill payment options for users."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!pendingDelete) return
          try {
            await deleteProvider(request, type, pendingDelete.id)
            setPendingDelete(null)
            load()
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete provider")
          }
        }}
      />
    </div>
  )
}

export default ProvidersPage
