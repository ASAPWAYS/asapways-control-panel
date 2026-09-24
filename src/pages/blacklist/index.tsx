import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FilterSelect } from "@/components/ui/filter-select"
import { Pagination } from "@/components/ui/pagination"
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
  listBlacklist,
  createBlacklistEntry,
  deleteBlacklistEntry,
  deactivateBlacklistEntry,
  type ApiBlacklistEntry,
  type BlacklistType,
} from "@/lib/api/blacklist"
import type { RestrictAction } from "@/lib/api/users"
import type { FilterOption } from "@/lib/types"

const typeOptions: FilterOption[] = [
  { label: "All Types", value: "all" },
  { label: "User", value: "USER" },
  { label: "Identity", value: "IDENTITY" },
]

const actionOptions: { value: RestrictAction; label: string }[] = [
  { value: "WITHDRAW", label: "Withdrawals" },
  { value: "TRADE", label: "Giftcard Trades" },
  { value: "BILL_AIRTIME", label: "Airtime Bills" },
  { value: "BILL_DATA", label: "Data Bills" },
  { value: "BILL_BETTING", label: "Betting" },
  { value: "BILL_ELECTRICITY", label: "Electricity Bills" },
  { value: "BILL_CABLE", label: "Cable/TV Bills" },
  { value: "BILL_INTERNET", label: "Internet Bills" },
]

function AddRestrictionDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const { request } = useAuth()
  const [type, setType] = useState<BlacklistType>("USER")
  const [target, setTarget] = useState("")
  const [action, setAction] = useState<RestrictAction>("WITHDRAW")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!target.trim()) {
      setError("Enter a username or identity")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createBlacklistEntry(request, { type, target: target.trim(), action, reason })
      setTarget("")
      setReason("")
      onOpenChange(false)
      onCreated()
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
          Restrict a User or Identity
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Type</Label>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as BlacklistType)}
              className="mt-2 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
            >
              <option value="USER">User (by username)</option>
              <option value="IDENTITY">Identity (phone/account id)</option>
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Target</Label>
            <Input
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              placeholder={type === "USER" ? "username" : "phone or account id"}
              className="mt-2 h-10 rounded-lg"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Action</Label>
            <select
              value={action}
              onChange={(event) => setAction(event.target.value as RestrictAction)}
              className="mt-2 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
            >
              {actionOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Reason (optional)</Label>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 min-h-20 rounded-xl"
            />
          </div>

          {error ? <p className="text-sm text-status-critical">{error}</p> : null}

          <div className="flex justify-end">
            <Button
              disabled={submitting}
              onClick={handleSubmit}
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Restricting…" : "Restrict"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function BlacklistPage() {
  const { request } = useAuth()
  const [type, setType] = useState("all")
  const [page, setPage] = useState(1)
  const [entries, setEntries] = useState<ApiBlacklistEntry[]>([])
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<ApiBlacklistEntry | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listBlacklist(request, {
        type: type !== "all" ? (type as BlacklistType) : undefined,
        page,
        limit: 20,
      })
      setEntries(result.items)
      setTotal(result.total)
      setLimit(result.limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load restrictions")
    } finally {
      setLoading(false)
    }
  }, [request, type, page])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [type])

  async function handleDeactivate(entry: ApiBlacklistEntry) {
    try {
      await deactivateBlacklistEntry(request, entry.id)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate restriction")
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">Action Restrictions ⚡</p>
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
          <FilterSelect label="Type" options={typeOptions} value={type} onChange={setType} />
          <Button
            className="h-10 gap-2 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="size-3.5" />
            Add Restriction
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
          ) : entries.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No restrictions in place.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground">Type</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Target</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Action</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Reason</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Date</TableHead>
                  <TableHead className="text-xs text-muted-foreground" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="border-border">
                    <TableCell className="text-foreground">{entry.type}</TableCell>
                    <TableCell className="text-foreground">{entry.target}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.action}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.reason ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusDot
                        tone={entry.status === "ACTIVE" ? "good" : "neutral"}
                        label={entry.status === "ACTIVE" ? "Active" : "Inactive"}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.status === "ACTIVE" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full px-3"
                            onClick={() => handleDeactivate(entry)}
                          >
                            Lift
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-full px-3"
                          onClick={() => setPendingDelete(entry)}
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

        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-6" />
      </div>

      <AddRestrictionDialog open={addOpen} onOpenChange={setAddOpen} onCreated={load} />

      <ConfirmActionDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        tone="critical"
        title="Delete this restriction?"
        description="This permanently removes the restriction — it can't be undone."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!pendingDelete) return
          try {
            await deleteBlacklistEntry(request, pendingDelete.id)
            setPendingDelete(null)
            load()
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete restriction")
          }
        }}
      />
    </div>
  )
}

export default BlacklistPage
