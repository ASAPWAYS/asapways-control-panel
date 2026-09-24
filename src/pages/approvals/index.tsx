import { useCallback, useEffect, useState } from "react"
import { Check, X } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"
import { formatLongDate } from "@/lib/format-date"
import { formatNaira } from "@/lib/format-number"
import { describeTransaction } from "@/lib/api/adapters"
import { useAuth } from "@/lib/auth/use-auth"
import {
  listApprovals,
  approveWithdrawal,
  denyWithdrawal,
  approveTrade,
  denyTrade,
  type ApiApproval,
  type ApprovalKind,
} from "@/lib/api/approvals"

type KindTab = "all" | "TRADE" | "WALLET"

const statusTone: Record<ApiApproval["status"], StatusTone> = {
  PENDING: "warning",
  APPROVED: "good",
  DENIED: "critical",
}

function ApprovalsPage() {
  const { request } = useAuth()
  const [kindTab, setKindTab] = useState<KindTab>("all")
  const [page, setPage] = useState(1)
  const [approvals, setApprovals] = useState<ApiApproval[]>([])
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<{
    approval: ApiApproval
    action: "approve" | "deny"
  } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listApprovals(request, {
        kind: kindTab === "all" ? undefined : (kindTab as ApprovalKind),
        status: "PENDING",
        page,
        limit: 20,
      })
      setApprovals(result.items)
      setTotal(result.total)
      setLimit(result.limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load approvals")
    } finally {
      setLoading(false)
    }
  }, [request, kindTab, page])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [kindTab])

  async function handleConfirm(reason: string) {
    if (!confirmTarget) return
    const { approval, action } = confirmTarget
    setActionError(null)
    try {
      if (approval.kind === "WALLET") {
        if (action === "approve") await approveWithdrawal(request, approval.id, reason || undefined)
        else await denyWithdrawal(request, approval.id, reason)
      } else {
        if (action === "approve") await approveTrade(request, approval.id, reason || undefined)
        else await denyTrade(request, approval.id, reason)
      }
      setConfirmTarget(null)
      load()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed")
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">Pending Approvals ⚡</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Date</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatLongDate(new Date())}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5">
        <Tabs value={kindTab} onValueChange={(value) => setKindTab(value as KindTab)}>
          <TabsList variant="line" className="h-auto gap-6 p-0">
            <TabsTrigger value="all" className="px-0 pb-2 text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="TRADE" className="px-0 pb-2 text-sm">
              Gift Card Trades
            </TabsTrigger>
            <TabsTrigger value="WALLET" className="px-0 pb-2 text-sm">
              Withdrawals
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {error ? <p className="mt-4 text-sm text-status-critical">{error}</p> : null}
        {actionError ? <p className="mt-4 text-sm text-status-critical">{actionError}</p> : null}

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : approvals.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nothing awaiting review.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground">Kind</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Subject</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Submitted</TableHead>
                  <TableHead className="text-xs text-muted-foreground" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => {
                  const subject = approval.transaction
                    ? describeTransaction(approval.transaction).subject
                    : "—"
                  return (
                    <TableRow key={approval.id} className="border-border">
                      <TableCell className="text-foreground">{approval.kind}</TableCell>
                      <TableCell className="text-muted-foreground">{subject}</TableCell>
                      <TableCell className="text-foreground">
                        {approval.transaction ? formatNaira(approval.transaction.amount) : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusDot tone={statusTone[approval.status]} label={approval.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(approval.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="rounded-full bg-status-good px-3 text-white hover:bg-status-good/90"
                            onClick={() => setConfirmTarget({ approval, action: "approve" })}
                          >
                            <Check className="size-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-full px-3"
                            onClick={() => setConfirmTarget({ approval, action: "deny" })}
                          >
                            <X className="size-3.5" />
                            Deny
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-6" />
      </div>

      <ConfirmActionDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null)
        }}
        tone={confirmTarget?.action === "approve" ? "good" : "critical"}
        title={
          confirmTarget?.action === "approve"
            ? "Approve this item?"
            : "Deny this item?"
        }
        description="Are you sure you want to continue with this action?"
        reasonLabel={confirmTarget?.action === "approve" ? "Note (optional)" : "Enter Reason"}
        reasonPlaceholder="Add context for the activity log"
        reasonRequired={confirmTarget?.action === "deny"}
        confirmLabel={confirmTarget?.action === "approve" ? "Approve" : "Deny"}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default ApprovalsPage
