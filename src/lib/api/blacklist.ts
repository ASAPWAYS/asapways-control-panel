import type { Requester, LaravelPage, Paginated } from "@/lib/api/users"
import type { RestrictAction } from "@/lib/api/users"

export type BlacklistType = "USER" | "IDENTITY"
export type BlacklistStatus = "ACTIVE" | "INACTIVE"

export interface ListBlacklistParams {
  type?: BlacklistType
  action?: string
  status?: BlacklistStatus
  target?: string
  page?: number
  limit?: number
}

export interface ApiBlacklistEntry {
  id: string
  type: BlacklistType
  target: string
  action: RestrictAction
  reason: string | null
  status: BlacklistStatus
  createdAt: string
  createdBy?: string
}

async function listBlacklist(request: Requester, params: ListBlacklistParams = {}) {
  const data = await request<{ blacklist: LaravelPage<ApiBlacklistEntry> }>("/blacklist", {
    params,
  })
  const page = data.blacklist
  return {
    items: page?.data ?? [],
    page: page?.current_page ?? 1,
    limit: page?.per_page ?? 20,
    total: page?.total ?? 0,
  } satisfies Paginated<ApiBlacklistEntry>
}

async function getBlacklistEntry(request: Requester, id: string) {
  const data = await request<Record<string, unknown>>(`/blacklist/${id}`)
  return (data.blacklist ?? data.restriction ?? data.entry ?? data) as ApiBlacklistEntry
}

async function createBlacklistEntry(
  request: Requester,
  payload: { type: BlacklistType; target: string; action: RestrictAction; reason?: string }
) {
  return request("/blacklist", { method: "POST", body: payload })
}

async function deleteBlacklistEntry(request: Requester, id: string) {
  return request(`/blacklist/${id}`, { method: "DELETE" })
}

async function deactivateBlacklistEntry(request: Requester, id: string) {
  return request(`/blacklist/${id}/deactivate`, { method: "PATCH" })
}

export {
  listBlacklist,
  getBlacklistEntry,
  createBlacklistEntry,
  deleteBlacklistEntry,
  deactivateBlacklistEntry,
}
