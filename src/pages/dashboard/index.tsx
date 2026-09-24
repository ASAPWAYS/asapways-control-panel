import { useEffect, useState } from "react"

import { StatCard } from "@/components/dashboard/stat-card"
import {
  WeeklyAnalysisChart,
  type WeeklyAnalysisPoint,
} from "@/components/dashboard/weekly-analysis-chart"
import { TopGiftcardActivity } from "@/components/dashboard/top-giftcard-activity"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { formatLongDate } from "@/lib/format-date"
import { formatNaira, formatCompactNumber, formatPercent } from "@/lib/format-number"
import { useAuth } from "@/lib/auth/use-auth"
import {
  getOverview,
  getRevenueTrend,
  getTopGiftcards,
  getPendingApprovalCounts,
} from "@/lib/api/analytics"
import { listTransactions } from "@/lib/api/transactions"
import { mapApiTransaction } from "@/lib/api/adapters"
import type { StatCardData } from "@/lib/types"
import type { GiftcardActivity } from "@/lib/mock/dashboard"
import type { Transaction } from "@/lib/mock/dashboard"

function DashboardPage() {
  const { admin, request } = useAuth()
  const [statCards, setStatCards] = useState<StatCardData[] | null>(null)
  const [weeklyAnalysis, setWeeklyAnalysis] = useState<WeeklyAnalysisPoint[]>([])
  const [topGiftcardActivity, setTopGiftcardActivity] = useState<GiftcardActivity[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [overview, pendingApprovals, trend, topCards, transactions] =
          await Promise.all([
            getOverview(request, "today"),
            getPendingApprovalCounts(request),
            getRevenueTrend(request, { period: "7d", granularity: "day" }),
            getTopGiftcards(request, 7),
            listTransactions(request, { page: 1, limit: 5 }),
          ])

        if (cancelled) return

        setStatCards([
          {
            id: "revenue-today",
            value: formatNaira(overview.revenue),
            label: "Revenue Today",
            trend: {
              direction: overview.deltaPct >= 0 ? "up" : "down",
              percent: formatPercent(overview.deltaPct) ?? "0%",
            },
          },
          {
            id: "orders-today",
            value: formatCompactNumber(overview.orders),
            label: "Orders Today",
          },
          {
            id: "pending-approvals",
            value: formatCompactNumber(pendingApprovals.total),
            label: "Pending Approvals",
          },
          {
            id: "average-order",
            value: formatNaira(overview.avgOrder),
            label: "Average Order Value",
          },
        ])

        setWeeklyAnalysis(
          trend.map((point, index) => ({
            day:
              point.label ??
              (point.date
                ? new Date(point.date).toLocaleDateString("en-US", { weekday: "short" })
                : `Day ${index + 1}`),
            revenue: point.revenue ?? 0,
          }))
        )

        setTopGiftcardActivity(
          topCards.map((card, index) => ({
            id: card.id ?? String(index),
            name: card.name ?? "Unknown",
            sellsRate: formatCompactNumber(card.volume ?? card.tradeCount),
          }))
        )

        setRecentTransactions(transactions.items.map(mapApiTransaction))
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard data")
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [request])

  const firstName = admin?.fullName?.split(" ")[0] ?? "there"

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">Hello {firstName},</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            Asap Day! ⚡
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Date</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatLongDate(new Date())}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(statCards ?? Array.from({ length: 4 })).map((card, index) =>
          card ? (
            <StatCard key={card.id} {...card} />
          ) : (
            <div key={index} className="h-23 animate-pulse rounded-2xl bg-card" />
          )
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <WeeklyAnalysisChart data={weeklyAnalysis} />
        <TopGiftcardActivity items={topGiftcardActivity} />
      </div>

      <TransactionsTable data={recentTransactions} />
    </div>
  )
}

export default DashboardPage
