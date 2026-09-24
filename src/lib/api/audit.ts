import type { Requester, LaravelPage, Paginated } from "@/lib/api/users"

export interface ListAuditLogsParams {
  adminId?: string
  action?: string
  resource?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface ApiAuditLog {
  id: string
  adminId: string
  action: string
  resource: string
  resourceId: string | null
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
  admin: { id: string; email: string; fullName: string | null } | null
}

async function listAuditLogs(request: Requester, params: ListAuditLogsParams = {}) {
  const data = await request<{ auditLogs: LaravelPage<ApiAuditLog> }>("/audit-logs", {
    params,
  })
  const page = data.auditLogs
  return {
    items: page?.data ?? [],
    page: page?.current_page ?? 1,
    limit: page?.per_page ?? 20,
    total: page?.total ?? 0,
  } satisfies Paginated<ApiAuditLog>
}

async function getAuditLog(request: Requester, id: string) {
  const data = await request<Record<string, unknown>>(`/audit-logs/${id}`)
  return (data.auditLog ?? data) as ApiAuditLog
}

export { listAuditLogs, getAuditLog }
