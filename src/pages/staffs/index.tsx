import { useCallback, useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusDot } from "@/components/ui/status-dot"
import { Badge } from "@/components/ui/badge"
import { formatLongDate } from "@/lib/format-date"
import { useAuth } from "@/lib/auth/use-auth"
import { ApiError } from "@/lib/api/client"
import {
  listAdmins,
  createAdmin,
  deleteAdmin,
  updateAdmin,
  setAdminRoles,
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  setRolePermissions,
  listPermissions,
  type ApiAdmin,
  type ApiRole,
  type ApiPermission,
} from "@/lib/api/rbac"

const staffTabs = ["Admins", "Roles", "Permissions"] as const

function PermissionPicker({
  permissions,
  selected,
  onChange,
}: {
  permissions: ApiPermission[]
  selected: Set<string>
  onChange: (next: Set<string>) => void
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, ApiPermission[]>()
    for (const permission of permissions) {
      const list = map.get(permission.module) ?? []
      list.push(permission)
      map.set(permission.module, list)
    }
    return map
  }, [permissions])

  function toggle(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(next)
  }

  return (
    <div className="flex max-h-72 flex-col gap-4 overflow-y-auto rounded-xl border border-border p-3">
      {Array.from(grouped.entries()).map(([module, items]) => (
        <div key={module}>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {module}
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {items.map((permission) => (
              <label key={permission.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selected.has(permission.id)}
                  onCheckedChange={() => toggle(permission.id)}
                />
                {permission.name}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AddAdminDialog({
  open,
  onOpenChange,
  roles,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: ApiRole[]
  onCreated: () => void
}) {
  const { request } = useAuth()
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [roleIds, setRoleIds] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setEmail("")
    setFullName("")
    setPassword("")
    setRoleIds(new Set())
    setError(null)
  }, [open])

  async function handleSubmit() {
    if (!email || !fullName || !password || roleIds.size === 0) {
      setError("Fill in every field and pick at least one role")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createAdmin(request, { email, fullName, password, roleIds: Array.from(roleIds) })
      onOpenChange(false)
      onCreated()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-md">
        <DialogTitle className="text-lg font-bold text-foreground">Add Admin</DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Full Name</Label>
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-2 h-10 rounded-lg"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@asapways.com"
              className="mt-2 h-10 rounded-lg"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Temporary Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-10 rounded-lg"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Roles</Label>
            <div className="mt-2 flex flex-col gap-2 rounded-xl border border-border p-3">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={roleIds.has(role.id)}
                    onCheckedChange={() => {
                      const next = new Set(roleIds)
                      if (next.has(role.id)) next.delete(role.id)
                      else next.add(role.id)
                      setRoleIds(next)
                    }}
                  />
                  {role.name}
                </label>
              ))}
            </div>
          </div>

          {error ? <p className="text-sm text-status-critical">{error}</p> : null}

          <div className="flex justify-end">
            <Button
              disabled={submitting}
              onClick={handleSubmit}
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Creating…" : "Create Admin"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AssignRolesDialog({
  admin,
  roles,
  open,
  onOpenChange,
  onSaved,
}: {
  admin: ApiAdmin | null
  roles: ApiRole[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const { request } = useAuth()
  const [roleIds, setRoleIds] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !admin) return
    setRoleIds(new Set(admin.roles.map((role) => role.id)))
    setError(null)
  }, [open, admin])

  if (!admin) return null

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      await setAdminRoles(request, admin!.id, Array.from(roleIds))
      onOpenChange(false)
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-background p-6 sm:max-w-sm">
        <DialogTitle className="text-lg font-bold text-foreground">
          Roles for {admin.fullName}
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={roleIds.has(role.id)}
                  onCheckedChange={() => {
                    const next = new Set(roleIds)
                    if (next.has(role.id)) next.delete(role.id)
                    else next.add(role.id)
                    setRoleIds(next)
                  }}
                />
                {role.name}
              </label>
            ))}
          </div>

          {error ? <p className="text-sm text-status-critical">{error}</p> : null}

          <div className="flex justify-end">
            <Button
              disabled={submitting}
              onClick={handleSubmit}
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Saving…" : "Save Roles"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RoleFormDialog({
  role,
  permissions,
  open,
  onOpenChange,
  onSaved,
}: {
  role: ApiRole | null
  permissions: ApiPermission[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const { request } = useAuth()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [permissionIds, setPermissionIds] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = role !== null

  useEffect(() => {
    if (!open) return
    setName(role?.name ?? "")
    setDescription(role?.description ?? "")
    const selectedSlugs = new Set(role?.permissions ?? [])
    setPermissionIds(
      new Set(permissions.filter((p) => selectedSlugs.has(p.slug)).map((p) => p.id))
    )
    setError(null)
  }, [open, role, permissions])

  async function handleSubmit() {
    if (!name) {
      setError("Enter a role name")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit) {
        await updateRole(request, role.id, { name, description })
        await setRolePermissions(request, role.id, Array.from(permissionIds))
      } else {
        await createRole(request, { name, description, permissionIds: Array.from(permissionIds) })
      }
      onOpenChange(false)
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-lg">
        <DialogTitle className="text-lg font-bold text-foreground">
          {isEdit ? "Edit Role" : "Create Role"}
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-10 rounded-lg"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 min-h-16 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Permissions</Label>
            <div className="mt-2">
              <PermissionPicker
                permissions={permissions}
                selected={permissionIds}
                onChange={setPermissionIds}
              />
            </div>
          </div>

          {error ? <p className="text-sm text-status-critical">{error}</p> : null}

          <div className="flex justify-end">
            <Button
              disabled={submitting}
              onClick={handleSubmit}
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StaffsPage() {
  const { request, admin: currentAdmin } = useAuth()
  const [tab, setTab] = useState<(typeof staffTabs)[number]>("Admins")

  const [admins, setAdmins] = useState<ApiAdmin[]>([])
  const [roles, setRoles] = useState<ApiRole[]>([])
  const [permissions, setPermissions] = useState<ApiPermission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [addAdminOpen, setAddAdminOpen] = useState(false)
  const [assignRolesTarget, setAssignRolesTarget] = useState<ApiAdmin | null>(null)
  const [pendingDeactivate, setPendingDeactivate] = useState<ApiAdmin | null>(null)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [editRole, setEditRole] = useState<ApiRole | null>(null)
  const [pendingDeleteRole, setPendingDeleteRole] = useState<ApiRole | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [adminsResult, rolesResult, permissionsResult] = await Promise.all([
        listAdmins(request),
        listRoles(request),
        listPermissions(request),
      ])
      setAdmins(adminsResult.items)
      setRoles(rolesResult)
      setPermissions(permissionsResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staff data")
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    load()
  }, [load])

  async function handleReactivate(adminRow: ApiAdmin) {
    try {
      await updateAdmin(request, adminRow.id, { isActive: true })
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reactivate admin")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">Staff & Access ⚡</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Date</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatLongDate(new Date())}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5">
        <Tabs value={tab} onValueChange={(value) => setTab(value as (typeof staffTabs)[number])}>
          <TabsList variant="line" className="h-auto gap-6 p-0">
            {staffTabs.map((item) => (
              <TabsTrigger key={item} value={item} className="px-0 pb-2 text-sm">
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {error ? <p className="mt-4 text-sm text-status-critical">{error}</p> : null}

        {loading ? (
          <div className="mt-4 flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : tab === "Admins" ? (
          <>
            <div className="mt-4 flex justify-end">
              <Button
                className="h-10 gap-2 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                onClick={() => setAddAdminOpen(true)}
              >
                <Plus className="size-3.5" />
                Add Admin
              </Button>
            </div>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Name</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Email</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Roles</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Last Login</TableHead>
                    <TableHead className="text-xs text-muted-foreground" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((adminRow) => (
                    <TableRow key={adminRow.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {adminRow.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{adminRow.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {adminRow.roles.map((role) => (
                            <Badge key={role.id} variant="secondary">
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusDot
                          tone={adminRow.isActive ? "good" : "critical"}
                          label={adminRow.isActive ? "Active" : "Inactive"}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {adminRow.lastLoginAt
                          ? new Date(adminRow.lastLoginAt).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full px-3"
                            onClick={() => setAssignRolesTarget(adminRow)}
                          >
                            Roles
                          </Button>
                          {adminRow.isActive ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-full px-3"
                              disabled={adminRow.id === currentAdmin?.id}
                              onClick={() => setPendingDeactivate(adminRow)}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="rounded-full bg-status-good px-3 text-white hover:bg-status-good/90"
                              onClick={() => handleReactivate(adminRow)}
                            >
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : tab === "Roles" ? (
          <>
            <div className="mt-4 flex justify-end">
              <Button
                className="h-10 gap-2 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setEditRole(null)
                  setRoleDialogOpen(true)
                }}
              >
                <Plus className="size-3.5" />
                Create Role
              </Button>
            </div>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Name</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Description</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Admins</TableHead>
                    <TableHead className="text-xs text-muted-foreground">Permissions</TableHead>
                    <TableHead className="text-xs text-muted-foreground" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {role.name}
                        {role.isCore ? (
                          <Badge variant="secondary" className="ml-2">
                            Core
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {role.description ?? "—"}
                      </TableCell>
                      <TableCell className="text-foreground">{role.adminCount}</TableCell>
                      <TableCell className="text-foreground">
                        {role.permissions.length}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="rounded-full bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                            disabled={role.isCore}
                            onClick={() => {
                              setEditRole(role)
                              setRoleDialogOpen(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-full px-3"
                            disabled={role.isCore || role.adminCount > 0}
                            onClick={() => setPendingDeleteRole(role)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <PermissionPicker
              permissions={permissions}
              selected={new Set(permissions.map((p) => p.id))}
              onChange={() => {}}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Read-only catalogue — permissions are assigned to admins via roles.
            </p>
          </div>
        )}
      </div>

      <AddAdminDialog
        open={addAdminOpen}
        onOpenChange={setAddAdminOpen}
        roles={roles}
        onCreated={load}
      />

      <AssignRolesDialog
        admin={assignRolesTarget}
        roles={roles}
        open={assignRolesTarget !== null}
        onOpenChange={(open) => {
          if (!open) setAssignRolesTarget(null)
        }}
        onSaved={load}
      />

      <RoleFormDialog
        role={editRole}
        permissions={permissions}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSaved={load}
      />

      <ConfirmActionDialog
        open={pendingDeactivate !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeactivate(null)
        }}
        tone="critical"
        title="Deactivate this admin?"
        description="They will lose access immediately."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Deactivate"
        onConfirm={async () => {
          if (!pendingDeactivate) return
          try {
            await deleteAdmin(request, pendingDeactivate.id)
            setPendingDeactivate(null)
            load()
          } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to deactivate admin")
          }
        }}
      />

      <ConfirmActionDialog
        open={pendingDeleteRole !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteRole(null)
        }}
        tone="critical"
        title="Delete this role?"
        description="This can't be undone."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!pendingDeleteRole) return
          try {
            await deleteRole(request, pendingDeleteRole.id)
            setPendingDeleteRole(null)
            load()
          } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to delete role")
          }
        }}
      />
    </div>
  )
}

export default StaffsPage
