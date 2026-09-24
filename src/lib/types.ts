export type TrendDirection = "up" | "down"

export interface StatCardData {
  id: string
  value: string
  label: string
  trend?: {
    direction: TrendDirection
    percent: string
  }
}

export interface FilterOption {
  label: string
  value: string
}
