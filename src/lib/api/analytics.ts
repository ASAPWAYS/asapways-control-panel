import type { Requester } from "@/lib/api/users"

export type AnalyticsPeriod = "today" | "yesterday" | "7d" | "30d" | "3m" | "6m" | "1y"

export interface OverviewPeriodMetrics {
  revenue: number
  orders: number
  fees: number
  avgOrder: number
}

export interface AnalyticsOverview extends OverviewPeriodMetrics {
  period: string
  deltaPct: number
  byPeriod: Record<AnalyticsPeriod, OverviewPeriodMetrics>
}

export interface RevenueTrendPoint {
  date?: string
  label?: string
  revenue?: number
  [key: string]: unknown
}

export interface TopGiftcard {
  id?: string
  name?: string
  volume?: number
  tradeCount?: number
  [key: string]: unknown
}

export interface UserCounts {
  total: number
  verified: number
  unverified: number
  byTier: Record<string, number>
}

export interface PendingApprovalCounts {
  pending: { TRADE: number; WALLET: number }
  total: number
}

export interface ByTypeBreakdown {
  period: string
  byType: Record<"TRADE" | "WALLET" | "BILL", { amount: number; orders: number }>
}

async function getOverview(request: Requester, period?: AnalyticsPeriod) {
  const data = await request<{ overview: AnalyticsOverview }>("/analytics/overview", {
    params: { period },
  })
  return data.overview
}

async function getRevenueTrend(
  request: Requester,
  params: { period?: string; granularity?: "day" | "month" } = {}
) {
  const data = await request<{
    trend: { period: string; granularity: string; series: RevenueTrendPoint[] }
  }>("/analytics/revenue-trend", { params })
  return data.trend.series
}

async function getByType(request: Requester) {
  return request<ByTypeBreakdown>("/analytics/by-type")
}

async function getTopGiftcards(request: Requester, limit?: number) {
  const data = await request<{ period: string; items: TopGiftcard[] }>(
    "/analytics/top-giftcards",
    { params: { limit } }
  )
  return data.items
}

async function getUserCounts(request: Requester) {
  const data = await request<{ users: UserCounts }>("/analytics/users")
  return data.users
}

async function getPendingApprovalCounts(request: Requester) {
  return request<PendingApprovalCounts>("/analytics/pending-approvals")
}

export {
  getOverview,
  getRevenueTrend,
  getByType,
  getTopGiftcards,
  getUserCounts,
  getPendingApprovalCounts,
}
