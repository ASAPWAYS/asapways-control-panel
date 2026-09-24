import { useCallback, useEffect, useState } from "react"

import { SearchInput } from "@/components/ui/search-input"
import { Pagination } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DetailPanel, DetailRow } from "@/components/ui/detail-row"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatLongDate } from "@/lib/format-date"
import { useAuth } from "@/lib/auth/use-auth"
import { listAuditLogs, type ApiAuditLog } from "@/lib/api/audit"

function AuditLogDetailDialog({
  log,
  open,
  onOpenChange,
}: {
  log: ApiAuditLog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!log) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold text-foreground">
          Activity Detail
        </DialogTitle>

        <DetailPanel>
          <DetailRow label="Admin:" value={log.admin?.fullName ?? log.admin?.email ?? "—"} />
          <DetailRow label="Action:" value={log.action} />
          <DetailRow label="Resource:" value={log.resource} />
          <DetailRow label="Resource ID:" value={log.resourceId ?? "—"} />
          <DetailRow label="IP Address:" value={log.ipAddress ?? "—"} />
          <DetailRow label="Date:" value={new Date(log.createdAt).toLocaleString()} />
        </DetailPanel>

        {log.newValues ? (
          <>
            <h3 className="text-base font-semibold text-foreground">New Values</h3>
            <DetailPanel className="py-3">
              <pre className="max-h-64 overflow-auto text-xs whitespace-pre-wrap text-muted-foreground">
                {JSON.stringify(log.newValues, null, 2)}
              </pre>
            </DetailPanel>
          </>
        ) : null}

        {log.oldValues ? (
          <>
            <h3 className="text-base font-semibold text-foreground">Old Values</h3>
            <DetailPanel className="py-3">
              <pre className="max-h-64 overflow-auto text-xs whitespace-pre-wrap text-muted-foreground">
                {JSON.stringify(log.oldValues, null, 2)}
              </pre>
            </DetailPanel>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function ReportsPage() {
  const { request } = useAuth()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [logs, setLogs] = useState<ApiAuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<ApiAuditLog | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listAuditLogs(request, {
        action: search || undefined,
        page,
        limit: 20,
      })
      setLogs(result.items)
      setTotal(result.total)
      setLimit(result.limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs")
    } finally {
      setLoading(false)
    }
  }, [request, search, page])

  useEffect(() => {
    const debounce = setTimeout(load, 300)
    return () => clearTimeout(debounce)
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [search])

  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">Admin Activity Log ⚡</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Date</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatLongDate(new Date())}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5">
        <SearchInput
          placeholder="Search by action (e.g. admin.login)..."
          className="max-w-sm"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {error ? <p className="mt-4 text-sm text-status-critical">{error}</p> : null}

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground">Admin</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Action</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Resource</TableHead>
                  <TableHead className="text-xs text-muted-foreground">IP Address</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="cursor-pointer border-border"
                    onClick={() => setSelected(log)}
                  >
                    <TableCell className="font-medium text-foreground">
                      {log.admin?.fullName ?? log.admin?.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-foreground">{log.action}</TableCell>
                    <TableCell className="text-muted-foreground">{log.resource}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.ipAddress ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-6" />
      </div>

      <AuditLogDetailDialog
        log={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </div>
  )
}

export default ReportsPage
