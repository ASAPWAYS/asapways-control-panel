import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NavRow } from "@/components/ui/nav-row"
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ApiError } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/use-auth"
import {
  fundUser,
  debitUser,
  deactivateUser,
  reactivateUser,
  resetUserPin,
  revokeUserSessions,
  restrictUser,
  type RestrictAction,
} from "@/lib/api/users"
import type { AdaptedUser } from "@/lib/api/adapters"

const restrictActions: { value: RestrictAction; label: string }[] = [
  { value: "WITHDRAW", label: "Withdrawals" },
  { value: "TRADE", label: "Giftcard Trades" },
  { value: "BILL_AIRTIME", label: "Airtime Bills" },
  { value: "BILL_DATA", label: "Data Bills" },
  { value: "BILL_BETTING", label: "Betting" },
  { value: "BILL_ELECTRICITY", label: "Electricity Bills" },
  { value: "BILL_CABLE", label: "Cable/TV Bills" },
  { value: "BILL_INTERNET", label: "Internet Bills" },
]

function WalletActionForm({
  label,
  actionLabel,
  tone,
  onSubmit,
}: {
  label: string
  actionLabel: string
  tone: "good" | "critical"
  onSubmit: (amount: number, note: string) => Promise<void>
}) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit() {
    const parsed = Number(amount)
    if (!parsed || parsed <= 0) {
      setStatus("error")
      setMessage("Enter a valid amount")
      return
    }
    setStatus("loading")
    setMessage(null)
    try {
      await onSubmit(parsed, note)
      setStatus("done")
      setMessage(`${label} successful`)
      setAmount("")
      setNote("")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof ApiError ? error.message : "Something went wrong")
    }
  }

  return (
    <div className="rounded-2xl bg-card p-4">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="mt-3 flex flex-col gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Amount (NGN)</Label>
          <Input
            type="number"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1 h-10 rounded-lg"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Note (optional)</Label>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-1 min-h-16 rounded-lg"
          />
        </div>
        {message ? (
          <p className={`text-xs ${status === "error" ? "text-status-critical" : "text-status-good"}`}>
            {message}
          </p>
        ) : null}
        <Button
          disabled={status === "loading"}
          onClick={handleSubmit}
          className={`h-10 self-start rounded-full px-5 text-white ${
            tone === "good"
              ? "bg-status-good hover:bg-status-good/90"
              : "bg-status-critical hover:bg-status-critical/90"
          }`}
        >
          {status === "loading" ? "Processing…" : actionLabel}
        </Button>
      </div>
    </div>
  )
}

function RestrictUserDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (action: RestrictAction, reason: string) => Promise<void>
}) {
  const [action, setAction] = useState<RestrictAction>("WITHDRAW")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      await onConfirm(action, reason)
      setReason("")
      onOpenChange(false)
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
          Restrict User From an Action
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Action</Label>
            <select
              value={action}
              onChange={(event) => setAction(event.target.value as RestrictAction)}
              className="mt-2 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
            >
              {restrictActions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Reason</Label>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 min-h-20 rounded-xl"
              placeholder="Why is this user being restricted?"
            />
          </div>

          {error ? <p className="text-sm text-status-critical">{error}</p> : null}

          <div className="flex justify-end">
            <Button
              disabled={submitting}
              onClick={handleConfirm}
              className="h-11 rounded-full bg-status-critical px-6 text-white hover:bg-status-critical/90"
            >
              {submitting ? "Restricting…" : "Restrict"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AdminActionsTab({
  user,
  onUserUpdated,
}: {
  user: AdaptedUser
  onUserUpdated: () => void
}) {
  const { request } = useAuth()
  const [confirmAction, setConfirmAction] = useState<
    "deactivate" | "reactivate" | "reset-pin" | "revoke-sessions" | null
  >(null)
  const [restrictOpen, setRestrictOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const isActive = user.accountStatus === "active"

  async function runSimpleAction(action: () => Promise<unknown>) {
    setActionError(null)
    try {
      await action()
      onUserUpdated()
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "Something went wrong")
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <WalletActionForm
        label="Fund Wallet"
        actionLabel="Fund Wallet"
        tone="good"
        onSubmit={(amount, note) => fundUser(request, user.id, { amount, note }).then(onUserUpdated)}
      />

      <WalletActionForm
        label="Debit Wallet"
        actionLabel="Debit Wallet"
        tone="critical"
        onSubmit={(amount, note) => debitUser(request, user.id, { amount, note }).then(onUserUpdated)}
      />

      {actionError ? (
        <p className="text-sm text-status-critical">{actionError}</p>
      ) : null}

      <div className="flex flex-col gap-3">
        <NavRow
          title="Reset Transaction PIN"
          subtitle="Clear the user's PIN so they can set a new one"
          onClick={() => setConfirmAction("reset-pin")}
        />
        <NavRow
          title="Revoke All Sessions"
          subtitle="Sign this user out of every device"
          onClick={() => setConfirmAction("revoke-sessions")}
        />
        <NavRow
          title="Restrict From an Action"
          subtitle="Block withdrawals, trades or a bill type"
          onClick={() => setRestrictOpen(true)}
        />
        <NavRow
          title={isActive ? "Deactivate Account" : "Reactivate Account"}
          subtitle={
            isActive
              ? "Suspend this account and end its sessions"
              : "Restore this account's access"
          }
          onClick={() => setConfirmAction(isActive ? "deactivate" : "reactivate")}
        />
      </div>

      <ConfirmActionDialog
        open={confirmAction === "reset-pin"}
        onOpenChange={(next) => setConfirmAction(next ? "reset-pin" : null)}
        tone="good"
        title="Reset Transaction PIN?"
        description="The user will be asked to set a new PIN on next login."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Reset PIN"
        onConfirm={() => {
          setConfirmAction(null)
          runSimpleAction(() => resetUserPin(request, user.id))
        }}
      />

      <ConfirmActionDialog
        open={confirmAction === "revoke-sessions"}
        onOpenChange={(next) => setConfirmAction(next ? "revoke-sessions" : null)}
        tone="critical"
        title="Revoke All Sessions?"
        description="This signs the user out of every device immediately."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Revoke Sessions"
        onConfirm={() => {
          setConfirmAction(null)
          runSimpleAction(() => revokeUserSessions(request, user.id))
        }}
      />

      <ConfirmActionDialog
        open={confirmAction === "deactivate"}
        onOpenChange={(next) => setConfirmAction(next ? "deactivate" : null)}
        tone="critical"
        title="Deactivate this Account?"
        description="The user will be signed out and unable to log back in until reactivated."
        reasonLabel="Enter Reason"
        reasonPlaceholder="Why is this account being deactivated?"
        reasonRequired
        noteText="**Note: This reason would be displayed in the activity log"
        confirmLabel="Deactivate"
        onConfirm={(reason) => {
          setConfirmAction(null)
          runSimpleAction(() => deactivateUser(request, user.id, reason))
        }}
      />

      <ConfirmActionDialog
        open={confirmAction === "reactivate"}
        onOpenChange={(next) => setConfirmAction(next ? "reactivate" : null)}
        tone="good"
        title="Reactivate this Account?"
        description="The user will regain access to their account."
        reasonLabel="Note (optional)"
        reasonPlaceholder="Add context for the activity log"
        confirmLabel="Reactivate"
        onConfirm={() => {
          setConfirmAction(null)
          runSimpleAction(() => reactivateUser(request, user.id))
        }}
      />

      <RestrictUserDialog
        open={restrictOpen}
        onOpenChange={setRestrictOpen}
        onConfirm={async (action, reason) => {
          await restrictUser(request, user.id, { action, reason: reason || undefined })
          onUserUpdated()
        }}
      />
    </div>
  )
}

export { AdminActionsTab }
