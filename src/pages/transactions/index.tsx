import { useEffect, useState } from "react"
import { Download } from "lucide-react"

import { SearchInput } from "@/components/ui/search-input"
import { FilterSelect } from "@/components/ui/filter-select"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { StatTileRow } from "@/components/ui/stat-tile-row"
import { AllTransactionsTable } from "@/components/transactions/all-transactions-table"
import { TransactionDetailDialog } from "@/components/transactions/transaction-detail-dialog"
import { formatLongDate } from "@/lib/format-date"
import { formatNaira, formatCompactNumber } from "@/lib/format-number"
import { useAuth } from "@/lib/auth/use-auth"
import {
  listTransactions,
  exportTransactions,
  type ApiTransaction,
  type TransactionStatus,
  type TransactionType,
} from "@/lib/api/transactions"
import { getByType, type ByTypeBreakdown } from "@/lib/api/analytics"
import type { FilterOption } from "@/lib/types"

const statusOptions: FilterOption[] = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Successful", value: "SUCCESSFUL" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Failed", value: "FAILED" },
  { label: "Reversal", value: "REVERSAL" },
]

const typeOptions: FilterOption[] = [
  { label: "All Types", value: "all" },
  { label: "Trade", value: "TRADE" },
  { label: "Bill", value: "BILL" },
  { label: "Wallet", value: "WALLET" },
]

function TransactionsPage() {
  const { request, getToken } = useAuth()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [type, setType] = useState("all")
  const [page, setPage] = useState(1)

  const [transactions, setTransactions] = useState<ApiTransaction[]>([])
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [selected, setSelected] = useState<ApiTransaction | null>(null)
  const [breakdown, setBreakdown] = useState<ByTypeBreakdown | null>(null)

  useEffect(() => {
    let cancelled = false
    getByType(request)
      .then((data) => {
        if (!cancelled) setBreakdown(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [request])

  useEffect(() => {
    setPage(1)
  }, [search, status, type])

  useEffect(() => {
    let cancelled = false
    const debounce = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await listTransactions(request, {
          search: search || undefined,
          status: status !== "all" ? (status as TransactionStatus) : undefined,
          transactionType: type !== "all" ? (type as TransactionType) : undefined,
          page,
          limit: 20,
        })
        if (cancelled) return
        setTransactions(result.items)
        setTotal(result.total)
        setLimit(result.limit)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load transactions")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(debounce)
    }
  }, [request, search, status, type, page])

  async function handleExport() {
    const token = getToken()
    if (!token) {
      setError("Session expired — please log in again to export.")
      return
    }
    setExporting(true)
    try {
      const blob = await exportTransactions(token, {
        status: status !== "all" ? (status as TransactionStatus) : undefined,
        transactionType: type !== "all" ? (type as TransactionType) : undefined,
        search: search || undefined,
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">Transactions ⚡</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Date</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatLongDate(new Date())}
          </p>
        </div>
      </div>

      {breakdown ? (
        <StatTileRow
          items={(["TRADE", "WALLET", "BILL"] as const).map((key) => ({
            label: `${key.charAt(0)}${key.slice(1).toLowerCase()} (${breakdown.period})`,
            value: `${formatNaira(breakdown.byType[key].amount)} · ${formatCompactNumber(breakdown.byType[key].orders)} orders`,
          }))}
        />
      ) : null}

      <div className="rounded-2xl bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              placeholder="Search by reference or user..."
              className="min-w-56"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <FilterSelect label="Status" options={statusOptions} value={status} onChange={setStatus} />
            <FilterSelect label="Type" options={typeOptions} value={type} onChange={setType} />
          </div>

          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full border-border px-4"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="size-3.5" />
            {exporting ? "Exporting…" : "Export CSV"}
          </Button>
        </div>

        {error ? <p className="mt-4 text-sm text-status-critical">{error}</p> : null}

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <AllTransactionsTable data={transactions} onViewDetails={setSelected} />
          )}
        </div>

        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-6" />
      </div>

      <TransactionDetailDialog
        transaction={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </div>
  )
}

export default TransactionsPage
