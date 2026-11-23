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
  transactionId: string | null
  transaction: ApiTransaction | null
  note: string | null
  reason: string | null
  reviewedAt: string | null
  reviewedBy: string | null
  createdAt: string | null
}

type RawRecord = Record<string, unknown>

function asRecord(value: unknown): RawRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RawRecord)
    : null
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value !== "" ? value : null
}

// The review item shape was never confirmed against a real row (the queue was
// empty when the API was first wired), so accept the plausible variants
// instead of trusting a guessed shape and crashing on render.
function normalizeApproval(raw: unknown): ApiApproval | null {
  const item = asRecord(raw)
  if (!item) return null
  const id = asString(item.id) ?? asString(item.reviewId)
  if (!id) return null

  const transaction = (asRecord(item.transaction) ??
    asRecord(item.Transaction)) as ApiTransaction | null
  const kindRaw = (
    asString(item.kind) ??
    asString(item.type) ??
    transaction?.transactionType ??
    ""
  ).toUpperCase()
  const statusRaw = (asString(item.status) ?? "PENDING").toUpperCase()
  const reviewer = asRecord(item.reviewedBy) ?? asRecord(item.reviewer)

  return {
    id,
    kind: kindRaw === "WALLET" || kindRaw === "WITHDRAWAL" ? "WALLET" : "TRADE",
    status:
      statusRaw === "APPROVED" || statusRaw === "DENIED" ? statusRaw : "PENDING",
    transactionId: asString(item.transactionId) ?? transaction?.id ?? null,
    transaction,
    note: asString(item.note),
    reason: asString(item.reason),
    reviewedAt: asString(item.reviewedAt),
    reviewedBy: reviewer
      ? asString(reviewer.fullName) ?? asString(reviewer.email)
      : asString(item.reviewedBy) ?? asString(item.reviewedById),
    createdAt: asString(item.createdAt),
  }
}

function pickList(data: RawRecord): { items: unknown[]; page?: RawRecord } {
  for (const key of ["approvals", "reviews", "items", "data"]) {
    const value = data[key]
    if (Array.isArray(value)) return { items: value }
    const page = asRecord(value)
    if (page && Array.isArray(page.data)) return { items: page.data, page }
  }
  return { items: [] }
}

async function listApprovals(request: Requester, params: ListApprovalsParams = {}) {
  const data = (await request<RawRecord>("/approvals", { params })) ?? {}
  const { items, page } = pickList(data)
  const typedPage = page as Partial<LaravelPage<unknown>> | undefined
  const normalized = items
    .map(normalizeApproval)
    .filter((item): item is ApiApproval => item !== null)
  return {
    items: normalized,
    page: typedPage?.current_page ?? params.page ?? 1,
    limit: typedPage?.per_page ?? params.limit ?? 20,
    total: typedPage?.total ?? (typeof data.total === "number" ? data.total : normalized.length),
  } satisfies Paginated<ApiApproval>
}

async function getApproval(request: Requester, id: string) {
  const data = (await request<RawRecord>(`/approvals/${id}`)) ?? {}
  return normalizeApproval(data.approval ?? data.review ?? data)
}

async function approveWithdrawal(request: Requester, reviewId: string, note?: string) {
  return request(`/approvals/withdrawals/${reviewId}/approve`, {
    method: "POST",
    body: note ? { note } : {},
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
    body: note ? { note } : {},
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
