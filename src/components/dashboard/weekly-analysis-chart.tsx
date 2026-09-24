import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

export interface WeeklyAnalysisPoint {
  day: string
  revenue: number
}

const REVENUE_COLOR = "var(--chart-1)"

const legend = [{ key: "revenue", label: "Revenue", color: REVENUE_COLOR }] as const

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <div className="mt-1.5 flex flex-col gap-1">
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </div>
        ))}
      </div>
    </div>
  )
}

function WeeklyAnalysisChart({ data }: { data: WeeklyAnalysisPoint[] }) {
  return (
    <div className="rounded-2xl bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Weekly Analysis
        </h2>
        <ul className="flex items-center gap-4">
          {legend.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barCategoryGap="28%">
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "var(--accent)" }}
              content={(props) => <ChartTooltip {...props} />}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill={REVENUE_COLOR}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export { WeeklyAnalysisChart }
