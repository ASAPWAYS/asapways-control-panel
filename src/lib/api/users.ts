import type { RequestOptions } from "@/lib/api/client"

type Requester = <T = unknown>(path: string, options?: RequestOptions) => Promise<T>

export type ApiUserStatus = "active" | "inactive" | "deleted"

export interface ListUsersParams {
  search?: string
  status?: ApiUserStatus
  tier?: number
  sort?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface ApiWallet {
  balance: number
  currency: string
  totalWithdrawal?: number
  totalCompletedTrade?: number
}

export interface ApiDevice {
  id: string
  platform: string | null
  appVersion: string | null
  osVersion: string | null
  model: string | null
  lastSeenAt: string | null
  createdAt: string
}

export interface ApiSession {
  ipAddress: string | null
  deviceId: string | null
  lastUsedAt: string | null
  createdAt: string
  expiresAt: string
}

export interface ApiUser {
  id: string
  fullName: string | null
  email: string
  username: string
  phoneNumber: string | null
  profileImage: string | null
  tier: number
  isActive: boolean
  emailVerifiedAt: string | null
  deactivatedAt: string | null
  deactivatedReason?: string | null
  createdAt: string
  updatedAt?: string
  wallet: ApiWallet
  devices?: ApiDevice[]
  session?: ApiSession | null
  counts?: { trades: number; withdrawals: number; bills: number }
}

export interface LaravelPage<T> {
  current_page: number
  data: T[]
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
}

export interface Paginated<T> {
  items: T[]
  page: number
  limit: number
  total: number
}

function normalizeList<T>(page: LaravelPage<T> | undefined): Paginated<T> {
  if (!page) return { items: [], page: 1, limit: 20, total: 0 }
  return {
    items: page.data,
    page: page.current_page,
    limit: page.per_page,
    total: page.total,
  }
}

async function listUsers(request: Requester, params: ListUsersParams = {}) {
  const data = await request<{ users: LaravelPage<ApiUser> }>("/users", { params })
  return normalizeList(data.users)
}

async function getUser(request: Requester, userId: string) {
  const data = await request<{ user: ApiUser }>(`/users/${userId}`)
  return data.user
}

async function fundUser(
  request: Requester,
  userId: string,
  payload: { amount: number; note?: string }
) {
  return request(`/users/${userId}/fund`, { method: "POST", body: payload })
}

async function debitUser(
  request: Requester,
  userId: string,
  payload: { amount: number; note?: string }
) {
  return request(`/users/${userId}/debit`, { method: "POST", body: payload })
}

async function deactivateUser(request: Requester, userId: string, reason: string) {
  return request(`/users/${userId}/deactivate`, { method: "PATCH", body: { reason } })
}

async function reactivateUser(request: Requester, userId: string) {
  return request(`/users/${userId}/reactivate`, { method: "PATCH" })
}

async function resetUserPin(request: Requester, userId: string) {
  return request(`/users/${userId}/reset-pin`, { method: "POST" })
}

async function revokeUserSessions(request: Requester, userId: string) {
  return request(`/users/${userId}/revoke-sessions`, { method: "POST" })
}

export type RestrictAction =
  | "WITHDRAW"
  | "TRADE"
  | "BILL_AIRTIME"
  | "BILL_DATA"
  | "BILL_BETTING"
  | "BILL_ELECTRICITY"
  | "BILL_CABLE"
  | "BILL_INTERNET"

async function restrictUser(
  request: Requester,
  userId: string,
  payload: { action: RestrictAction; reason?: string }
) {
  return request(`/users/${userId}/restrict`, { method: "POST", body: payload })
}

export {
  listUsers,
  getUser,
  fundUser,
  debitUser,
  deactivateUser,
  reactivateUser,
  resetUserPin,
  revokeUserSessions,
  restrictUser,
}
export type { Requester }
