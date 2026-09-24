import { useCallback, useEffect, useState } from "react"
import { Plus, RefreshCw } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { FilterSelect } from "@/components/ui/filter-select"
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
import { formatLongDate } from "@/lib/format-date"
import { useAuth } from "@/lib/auth/use-auth"
import { ApiError } from "@/lib/api/client"
import { listAdmins, listRoles, type ApiAdmin, type ApiRole } from "@/lib/api/rbac"
import {
  getShiftSettings,
  updateShiftSettings,
  listRotations,
  createRotation,
  deactivateRotation,
  listShifts,
  assignShift,
  cancelShift,
  grantBypass,
  resetBypass,
  syncShifts,
  type ApiShiftRotation,
  type ApiShift,
} from "@/lib/api/shifts"

const shiftTabs = ["Rotations", "Assigned Shifts", "Settings"] as const
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function AdminSelect({
  admins,
  value,
  onChange,
}: {
  admins: ApiAdmin[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
    >
      <option value="">Select an admin</option>
      {admins.map((admin) => (
        <option key={admin.id} value={admin.id}>
          {admin.fullName}
        </option>
      ))}
    </select>
  )
}

function AddRotationDialog({
  open,
  onOpenChange,
  admins,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  admins: ApiAdmin[]
  onCreated: () => void
}) {
  const { request } = useAuth()
  const [name, setName] = useState("")
  const [adminId, setAdminId] = useState("")
  const [days, setDays] = useState<Set<number>>(new Set())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName("")
    setAdminId("")
    setDays(new Set())
    setStartTime("09:00")
    setEndTime("17:00")
    setError(null)
  }, [open])

  async function handleSubmit() {
    if (!name || !adminId || days.size === 0) {
      setError("Fill in the name, admin and at least one day")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createRotation(request, {
        name,
        adminId,
        daysOfWeek: Array.from(days).sort(),
        startTime,
        endTime,
      })
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
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-background p-6 sm:max-w-sm">
        <DialogTitle className="text-lg font-bold text-foreground">
          Create Shift Rotation
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
            <Label className="text-sm font-medium text-foreground">Admin</Label>
            <div className="mt-2">
              <AdminSelect admins={admins} value={adminId} onChange={setAdminId} />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Days</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {dayLabels.map((label, index) => (
                <label key={label} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={days.has(index)}
                    onCheckedChange={() => {
                      const next = new Set(days)
                      if (next.has(index)) next.delete(index)
                      else next.add(index)
                      setDays(next)
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium text-foreground">Start</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="mt-2 h-10 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium text-foreground">End</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="mt-2 h-10 rounded-lg"
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
              {submitting ? "Creating…" : "Create Rotation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AssignShiftDialog({
  open,
  onOpenChange,
  admins,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  admins: ApiAdmin[]
  onCreated: () => void
}) {
  const { request } = useAuth()
  const [adminId, setAdminId] = useState("")
  const [startAt, setStartAt] = useState("")
  const [endAt, setEndAt] = useState("")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setAdminId("")
    setStartAt("")
    setEndAt("")
    setNote("")
    setError(null)
  }, [open])

  async function handleSubmit() {
    if (!adminId || !startAt || !endAt) {
      setError("Fill in the admin, start and end time")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await assignShift(request, {
        adminId,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        note: note || undefined,
      })
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
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl bg-background p-6 sm:max-w-sm">
        <DialogTitle className="text-lg font-bold text-foreground">
          Assign One-off Shift
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Admin</Label>
            <div className="mt-2">
              <AdminSelect admins={admins} value={adminId} onChange={setAdminId} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium text-foreground">Start</Label>
              <Input
                type="datetime-local"
                value={startAt}
                onChange={(event) => setStartAt(event.target.value)}
                className="mt-2 h-10 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium text-foreground">End</Label>
              <Input
                type="datetime-local"
                value={endAt}
                onChange={(event) => setEndAt(event.target.value)}
                className="mt-2 h-10 rounded-lg"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Note (optional)</Label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 min-h-16 rounded-xl"
            />
          </div>

          {error ? <p className="text-sm text-status-critical">{error}</p> : null}

          <div className="flex justify-end">
            <Button
              disabled={submitting}
              onClick={handleSubmit}
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Assigning…" : "Assign Shift"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EnforcementSettingsCard({
  admins,
  roles,
}: {
  admins: ApiAdmin[]
  roles: ApiRole[]
}) {
  const { request } = useAuth()
  const [enabled, setEnabled] = useState(false)
  const [bypassRoleSlugs, setBypassRoleSlugs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [bypassAdminId, setBypassAdminId] = useState("")
  const [bypassUntil, setBypassUntil] = useState("")
  const [bypassBusy, setBypassBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    getShiftSettings(request)
      .then((data) => {
        if (cancelled) return
        setEnabled(data.enabled)
        setBypassRoleSlugs(new Set(data.bypassRoleSlugs))
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load settings")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [request])

  async function save(nextEnabled: boolean, nextSlugs: Set<string>) {
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      await updateShiftSettings(request, {
        enabled: nextEnabled,
        bypassRoleSlugs: Array.from(nextSlugs),
      })
      setMessage("Shift enforcement settings updated")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update settings")
    } finally {
      setSaving(false)
    }
  }

  async function handleGrantBypass() {
    if (!bypassAdminId || !bypassUntil) {
      setError("Pick an admin and an expiry date/time")
      return
    }
    setBypassBusy(true)
    setError(null)
    setMessage(null)
    try {
      await grantBypass(request, bypassAdminId, new Date(bypassUntil).toISOString())
      setMessage("Bypass granted")
      setBypassAdminId("")
      setBypassUntil("")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to grant bypass")
    } finally {
      setBypassBusy(false)
    }
  }

  async function handleResetBypass() {
    if (!bypassAdminId) {
      setError("Pick an admin")
      return
    }
    setBypassBusy(true)
    setError(null)
    setMessage(null)
    try {
      await resetBypass(request, bypassAdminId)
      setMessage("Bypass reset")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reset bypass")
    } finally {
      setBypassBusy(false)
    }
  }

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-card" />

  return (
    <div className="flex flex-col gap-4">
      {error ? <p className="text-sm text-status-critical">{error}</p> : null}
      {message ? <p className="text-sm text-status-good">{message}</p> : null}

      <div className="rounded-2xl bg-card p-5">
        <h2 className="text-base font-semibold text-foreground">Shift Enforcement</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          When on, admins outside an active shift (and without a bypass) are blocked from
          restricted actions.
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Enabled</span>
          <Switch
            checked={enabled}
            disabled={saving}
            onCheckedChange={(next) => {
              setEnabled(next)
              save(next, bypassRoleSlugs)
            }}
          />
        </div>

        <p className="mt-4 text-sm font-medium text-foreground">Roles that always bypass</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {roles.map((role) => (
            <label key={role.id} className="flex items-center gap-1.5 text-sm">
              <Checkbox
                checked={bypassRoleSlugs.has(role.slug)}
                disabled={saving}
                onCheckedChange={() => {
                  const next = new Set(bypassRoleSlugs)
                  if (next.has(role.slug)) next.delete(role.slug)
                  else next.add(role.slug)
                  setBypassRoleSlugs(next)
                  save(enabled, next)
                }}
              />
              {role.name}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5">
        <h2 className="text-base font-semibold text-foreground">Temporary Bypass</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Grant or reset an individual admin's shift-enforcement bypass. There's no endpoint to
          list active bypasses — this only creates or clears one.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Admin</Label>
            <div className="mt-1">
              <AdminSelect admins={admins} value={bypassAdminId} onChange={setBypassAdminId} />
            </div>
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Bypass Until</Label>
            <Input
              type="datetime-local"
              value={bypassUntil}
              onChange={(event) => setBypassUntil(event.target.value)}
              className="mt-1 h-10 rounded-lg"
            />
          </div>
          <Button
            disabled={bypassBusy}
            onClick={handleGrantBypass}
            className="h-10 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
          >
            Grant
          </Button>
          <Button
            disabled={bypassBusy}
            variant="outline"
            onClick={handleResetBypass}
            className="h-10 rounded-full px-5"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

function ShiftsPage() {
  const { request } = useAuth()
  const [tab, setTab] = useState<(typeof shiftTabs)[number]>("Rotations")
  const [admins, setAdmins] = useState<ApiAdmin[]>([])
  const [roles, setRoles] = useState<ApiRole[]>([])
  const [rotations, setRotations] = useState<ApiShiftRotation[]>([])
  const [shifts, setShifts] = useState<ApiShift[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  const [addRotationOpen, setAddRotationOpen] = useState(false)
  const [assignShiftOpen, setAssignShiftOpen] = useState(false)
  const [pendingDeactivateRotation, setPendingDeactivateRotation] =
    useState<ApiShiftRotation | null>(null)
  const [pendingCancelShift, setPendingCancelShift] = useState<ApiShift | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [adminsResult, rolesResult, rotationsResult, shiftsResult] = await Promise.all([
        listAdmins(request),
        listRoles(request),
        listRotations(request),
        listShifts(request, {
          status: statusFilter !== "all" ? (statusFilter as ApiShift["status"]) : undefined,
        }),
      ])
      setAdmins(adminsResult.items)
      setRoles(rolesResult)
      setRotations(rotationsResult)
      setShifts(shiftsResult.shifts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shift data")
    } finally {
      setLoading(false)
    }
  }, [request, statusFilter])

  useEffect(() => {
    load()
  }, [load])

  async function handleSync() {
    setSyncing(true)
    try {
      await syncShifts(request)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed")
    } finally {
      setSyncing(false)
    }
  }

  function adminName(adminId: string) {
    return admins.find((admin) => admin.id === adminId)?.fullName ?? adminId
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">Shift Scheduling ⚡</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full px-4"
            disabled={syncing}
            onClick={handleSync}
          >
            <RefreshCw className="size-3.5" />
            {syncing ? "Syncing…" : "Sync Now"}
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Date</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatLongDate(new Date())}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5">
        <Tabs value={tab} onValueChange={(value) => setTab(value as (typeof shiftTabs)[number])}>
          <TabsList variant="line" className="h-auto gap-6 p-0">
            {shiftTabs.map((item) => (
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
        ) : tab === "Rotations" ? (
          <>
            <div className="mt-4 flex justify-end">
              <Button
                className="h-10 gap-2 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                onClick={() => setAddRotationOpen(true)}
              >
                <Plus className="size-3.5" />
                Add Rotation
              </Button>
            </div>
            <div className="mt-4">
              {rotations.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No rotations set up yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs text-muted-foreground">Name</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Admin</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Days</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Time</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs text-muted-foreground" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rotations.map((rotation) => (
                      <TableRow key={rotation.id} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          {rotation.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {rotation.admin?.fullName ?? adminName(rotation.adminId)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {rotation.daysOfWeek.map((day) => dayLabels[day]).join(", ")}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {rotation.startTime}–{rotation.endTime}
                        </TableCell>
                        <TableCell>
                          <StatusDot
                            tone={rotation.isActive ? "good" : "neutral"}
                            label={rotation.isActive ? "Active" : "Inactive"}
                          />
                        </TableCell>
                        <TableCell>
                          {rotation.isActive ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-full px-3"
                              onClick={() => setPendingDeactivateRotation(rotation)}
                            >
                              Deactivate
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        ) : tab === "Assigned Shifts" ? (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <FilterSelect
                label="Status"
                options={[
                  { label: "All", value: "all" },
                  { label: "Scheduled", value: "SCHEDULED" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Completed", value: "COMPLETED" },
                  { label: "Missed", value: "MISSED" },
                  { label: "Cancelled", value: "CANCELLED" },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <Button
                className="h-10 gap-2 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                onClick={() => setAssignShiftOpen(true)}
              >
                <Plus className="size-3.5" />
                Assign Shift
              </Button>
            </div>
            <div className="mt-4">
              {shifts.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No shifts match this filter.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs text-muted-foreground">Admin</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Start</TableHead>
                      <TableHead className="text-xs text-muted-foreground">End</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs text-muted-foreground" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map((shift) => (
                      <TableRow key={shift.id} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          {shift.admin?.fullName ?? adminName(shift.adminId)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(shift.startAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(shift.endAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <StatusDot
                            tone={
                              shift.status === "COMPLETED"
                                ? "good"
                                : shift.status === "CANCELLED" || shift.status === "MISSED"
                                  ? "critical"
                                  : "warning"
                            }
                            label={shift.status}
                          />
                        </TableCell>
                        <TableCell>
                          {shift.status === "SCHEDULED" || shift.status === "ACTIVE" ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-full px-3"
                              onClick={() => setPendingCancelShift(shift)}
                            >
                              Cancel
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        ) : (
          <div className="mt-4">
            <EnforcementSettingsCard admins={admins} roles={roles} />
          </div>
        )}
      </div>

      <AddRotationDialog
        open={addRotationOpen}
        onOpenChange={setAddRotationOpen}
        admins={admins}
        onCreated={load}
      />

      <AssignShiftDialog
        open={assignShiftOpen}
        onOpenChange={setAssignShiftOpen}
        admins={admins}
        onCreated={load}
      />

      <ConfirmActionDialog
        open={pendingDeactivateRotation !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeactivateRotation(null)
        }}
        tone="critical"
        title="Deactivate this rotation?"
        description="Future shifts from this rotation will stop being generated."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Deactivate"
        onConfirm={async () => {
          if (!pendingDeactivateRotation) return
          try {
            await deactivateRotation(request, pendingDeactivateRotation.id)
            setPendingDeactivateRotation(null)
            load()
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to deactivate rotation")
          }
        }}
      />

      <ConfirmActionDialog
        open={pendingCancelShift !== null}
        onOpenChange={(open) => {
          if (!open) setPendingCancelShift(null)
        }}
        tone="critical"
        title="Cancel this shift?"
        description="The admin will no longer be scheduled for this window."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Cancel Shift"
        onConfirm={async () => {
          if (!pendingCancelShift) return
          try {
            await cancelShift(request, pendingCancelShift.id)
            setPendingCancelShift(null)
            load()
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to cancel shift")
          }
        }}
      />
    </div>
  )
}

export default ShiftsPage
