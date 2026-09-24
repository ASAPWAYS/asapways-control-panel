function formatNaira(amount: number | undefined) {
  if (amount === undefined || Number.isNaN(amount)) return "—"
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCompactNumber(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
}

function formatPercent(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return undefined
  return `${Math.abs(value).toFixed(1)}%`
}

export { formatNaira, formatCompactNumber, formatPercent }
