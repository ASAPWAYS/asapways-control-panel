import type { Requester, LaravelPage, Paginated, ApiUserStatus } from "@/lib/api/users"

export interface ApiAdminRole {
  id: string
  name: string
  slug: string
}

export interface ApiAdmin {
  id: string
  email: string
  fullName: string
  profileImage: string | null
  isActive: boolean
  emailVerifiedAt: string | null
  lastLoginAt: string | null
  createdAt: string
  deletedAt: string | null
  roles: ApiAdminRole[]
}

export interface ListAdminsParams {
  search?: string
  status?: ApiUserStatus
  page?: number
  limit?: number
}

export interface ApiRole {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  isCore: boolean
  adminCount: number
  permissions: string[]
}

export interface ApiPermission {
  id: string
  name: string
  slug: string
  description: string | null
  module: string
  action: "CREATE" | "READ" | "UPDATE" | "DELETE"
  resource: string
  isActive: boolean
}

async function listAdmins(request: Requester, params: ListAdminsParams = {}) {
  const data = await request<{ admins: LaravelPage<ApiAdmin> }>("/admins", { params })
  const page = data.admins
  return {
    items: page?.data ?? [],
    page: page?.current_page ?? 1,
    limit: page?.per_page ?? 20,
    total: page?.total ?? 0,
  } satisfies Paginated<ApiAdmin>
}

async function getAdmin(request: Requester, id: string) {
  const data = await request<Record<string, unknown>>(`/admins/${id}`)
  return (data.admin ?? data) as ApiAdmin
}

async function createAdmin(
  request: Requester,
  payload: { email: string; fullName: string; password: string; roleIds: string[] }
) {
  return request("/admins", { method: "POST", body: payload })
}

async function updateAdmin(
  request: Requester,
  id: string,
  payload: { fullName?: string; profileImage?: string; isActive?: boolean }
) {
  return request(`/admins/${id}`, { method: "PATCH", body: payload })
}

async function deleteAdmin(request: Requester, id: string) {
  return request(`/admins/${id}`, { method: "DELETE" })
}

async function setAdminRoles(request: Requester, id: string, roleIds: string[]) {
  return request(`/admins/${id}/roles`, { method: "PUT", body: { roleIds } })
}

async function listRoles(request: Requester) {
  const data = await request<{ roles: ApiRole[] }>("/roles")
  return data.roles
}

async function createRole(
  request: Requester,
  payload: { name: string; slug?: string; description?: string; permissionIds?: string[] }
) {
  return request("/roles", { method: "POST", body: payload })
}

async function getRole(request: Requester, id: string) {
  const data = await request<Record<string, unknown>>(`/roles/${id}`)
  return (data.role ?? data) as ApiRole
}

async function updateRole(
  request: Requester,
  id: string,
  payload: { name?: string; description?: string; isActive?: boolean }
) {
  return request(`/roles/${id}`, { method: "PATCH", body: payload })
}

async function deleteRole(request: Requester, id: string) {
  return request(`/roles/${id}`, { method: "DELETE" })
}

async function setRolePermissions(request: Requester, id: string, permissionIds: string[]) {
  return request(`/roles/${id}/permissions`, { method: "PUT", body: { permissionIds } })
}

async function listPermissions(request: Requester) {
  const data = await request<{ permissions: ApiPermission[] }>("/permissions")
  return data.permissions
}

export {
  listAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  setAdminRoles,
  listRoles,
  createRole,
  getRole,
  updateRole,
  deleteRole,
  setRolePermissions,
  listPermissions,
}
