import type { Requester } from "@/lib/api/users"

export type ShiftStatus = "SCHEDULED" | "ACTIVE" | "COMPLETED" | "MISSED" | "CANCELLED"

export interface ApiShift {
  id: string
  adminId: string
  admin?: { id: string; fullName: string; email: string }
  startAt: string
  endAt: string
  status: ShiftStatus
  note: string | null
  rotationId: string | null
  createdAt: string
}

export interface ApiShiftRotation {
  id: string
  name: string
  adminId: string
  admin?: { id: string; fullName: string; email: string }
  daysOfWeek: number[]
  startTime: string
  endTime: string
  timezone: string
  isActive: boolean
  createdAt: string
}

export interface ShiftEnforcementSettings {
  enabled: boolean
  bypassRoleSlugs: string[]
}

async function getCurrentShift(request: Requester) {
  return request<{ current: ApiShift | null; next: ApiShift | null }>("/shifts/me/current")
}

async function syncShifts(request: Requester) {
  return request("/shifts/sync", { method: "POST" })
}

async function getShiftSettings(request: Requester) {
  const data = await request<{ shiftEnforcement: ShiftEnforcementSettings }>("/shifts/settings")
  return data.shiftEnforcement
}

async function updateShiftSettings(request: Requester, payload: Partial<ShiftEnforcementSettings>) {
  return request("/shifts/settings", { method: "PUT", body: payload })
}

async function listRotations(
  request: Requester,
  params: { adminId?: string; isActive?: boolean } = {}
) {
  const data = await request<{ rotations: ApiShiftRotation[] }>("/shifts/rotations", { params })
  return data.rotations
}

async function createRotation(
  request: Requester,
  payload: {
    name: string
    adminId: string
    daysOfWeek: number[]
    startTime: string
    endTime: string
    timezone?: string
  }
) {
  return request("/shifts/rotations", { method: "POST", body: payload })
}

async function updateRotation(
  request: Requester,
  id: string,
  payload: Partial<{
    name: string
    daysOfWeek: number[]
    startTime: string
    endTime: string
    timezone: string
  }>
) {
  return request(`/shifts/rotations/${id}`, { method: "PATCH", body: payload })
}

async function deactivateRotation(request: Requester, id: string) {
  return request(`/shifts/rotations/${id}`, { method: "DELETE" })
}

async function grantBypass(request: Requester, adminId: string, until: string) {
  return request(`/shifts/bypass/${adminId}`, { method: "POST", body: { until } })
}

async function resetBypass(request: Requester, adminId: string) {
  return request(`/shifts/bypass/${adminId}`, { method: "DELETE" })
}

async function listShifts(
  request: Requester,
  params: { adminId?: string; status?: ShiftStatus; dateFrom?: string; dateTo?: string } = {}
) {
  const data = await request<{ shifts: ApiShift[]; total: number }>("/shifts", { params })
  return data
}

async function assignShift(
  request: Requester,
  payload: { adminId: string; startAt: string; endAt: string; note?: string }
) {
  return request("/shifts", { method: "POST", body: payload })
}

async function cancelShift(request: Requester, id: string) {
  return request(`/shifts/${id}/cancel`, { method: "PATCH" })
}

export {
  getCurrentShift,
  syncShifts,
  getShiftSettings,
  updateShiftSettings,
  listRotations,
  createRotation,
  updateRotation,
  deactivateRotation,
  grantBypass,
  resetBypass,
  listShifts,
  assignShift,
  cancelShift,
}
