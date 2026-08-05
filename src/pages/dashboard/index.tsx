import { StatCard } from "@/components/dashboard/stat-card"
import { WeeklyAnalysisChart } from "@/components/dashboard/weekly-analysis-chart"
import { TopGiftcardActivity } from "@/components/dashboard/top-giftcard-activity"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { formatLongDate } from "@/lib/format-date"
import {
  statCards,
  weeklyAnalysis,
  topGiftcardActivity,
  recentTransactions,
} from "@/lib/mock/dashboard"

function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">Hello Tomiwa,</p>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
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
