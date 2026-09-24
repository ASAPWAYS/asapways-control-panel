import type { Requester, LaravelPage, Paginated } from "@/lib/api/users"
import type { ApiTransaction } from "@/lib/api/transactions"

export type ApprovalKind = "TRADE" | "WALLET"
export type ApprovalStatus = "PENDING" | "APPROVED" | "DENIED"

export interface ListApprovalsParams {
  kind?: ApprovalKind
  status?: ApprovalStatus
  page?: number
  limit?: number
}

export interface ApiApproval {
  id: string
  kind: ApprovalKind
  status: ApprovalStatus
  transactionId: string
  transaction?: ApiTransaction
  note: string | null
  reason: string | null
  reviewedAt: string | null
  reviewedBy: string | null
  createdAt: string
}

async function listApprovals(request: Requester, params: ListApprovalsParams = {}) {
  const data = await request<{ approvals: LaravelPage<ApiApproval> }>("/approvals", {
    params,
  })
  const page = data.approvals
  return {
    items: page?.data ?? [],
    page: page?.current_page ?? 1,
    limit: page?.per_page ?? 20,
    total: page?.total ?? 0,
  } satisfies Paginated<ApiApproval>
}

async function getApproval(request: Requester, id: string) {
  const data = await request<Record<string, unknown>>(`/approvals/${id}`)
  return (data.approval ?? data.review ?? data) as ApiApproval
}

async function approveWithdrawal(request: Requester, reviewId: string, note?: string) {
  return request(`/approvals/withdrawals/${reviewId}/approve`, {
    method: "POST",
    body: { note },
  })
}

async function denyWithdrawal(request: Requester, reviewId: string, reason: string) {
  return request(`/approvals/withdrawals/${reviewId}/deny`, {
    method: "POST",
    body: { reason },
  })
}

async function approveTrade(request: Requester, reviewId: string, note?: string) {
  return request(`/approvals/trades/${reviewId}/approve`, {
    method: "POST",
    body: { note },
  })
}

async function denyTrade(request: Requester, reviewId: string, reason: string) {
  return request(`/approvals/trades/${reviewId}/deny`, {
    method: "POST",
    body: { reason },
  })
}

export {
  listApprovals,
  getApproval,
  approveWithdrawal,
  denyWithdrawal,
  approveTrade,
  denyTrade,
}
