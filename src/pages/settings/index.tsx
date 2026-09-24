import { useEffect, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { formatLongDate } from "@/lib/format-date"
import { useAuth } from "@/lib/auth/use-auth"
import { ApiError } from "@/lib/api/client"
import { getSettings, updateSetting, type PlatformSettings } from "@/lib/api/settings"

function SettingCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function SettingsPage() {
  const { request } = useAuth()
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [thresholdNaira, setThresholdNaira] = useState("")
  const [tradeApprovalAll, setTradeApprovalAll] = useState(true)
  const [savingThreshold, setSavingThreshold] = useState(false)
  const [savingTradeApproval, setSavingTradeApproval] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getSettings(request)
      .then((data) => {
        if (cancelled) return
        setSettings(data)
        setThresholdNaira(String(data.withdrawal_approval.thresholdKobo / 100))
        setTradeApprovalAll(data.trade_approval.mode === "ALL")
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

  async function saveThreshold() {
    const naira = Number(thresholdNaira)
    if (!naira || naira <= 0) {
      setError("Enter a valid amount")
      return
    }
    setSavingThreshold(true)
    setError(null)
    setMessage(null)
    try {
      await updateSetting(request, "withdrawal_approval", { thresholdKobo: Math.round(naira * 100) })
      setMessage("Withdrawal approval threshold updated")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update threshold")
    } finally {
      setSavingThreshold(false)
    }
  }

  async function saveTradeApproval(nextAll: boolean) {
    setTradeApprovalAll(nextAll)
    setSavingTradeApproval(true)
    setError(null)
    setMessage(null)
    try {
      await updateSetting(request, "trade_approval", { mode: nextAll ? "ALL" : "NONE" })
      setMessage("Trade approval mode updated")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update trade approval mode")
      setTradeApprovalAll(!nextAll)
    } finally {
      setSavingTradeApproval(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">Platform Settings ⚡</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Date</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatLongDate(new Date())}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      ) : null}
      {message ? (
        <div className="rounded-2xl bg-status-good/10 p-4 text-sm text-status-good">{message}</div>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      ) : settings ? (
        <div className="flex flex-col gap-4">
          <SettingCard
            title="Withdrawal Approval Threshold"
            description="Withdrawals at or above this amount require manual review before payout."
          >
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Amount (NGN)</Label>
                <Input
                  type="number"
                  min="0"
                  value={thresholdNaira}
                  onChange={(event) => setThresholdNaira(event.target.value)}
                  className="mt-1 h-10 rounded-lg"
                />
              </div>
              <Button
                disabled={savingThreshold}
                onClick={saveThreshold}
                className="h-10 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              >
                {savingThreshold ? "Saving…" : "Save"}
              </Button>
            </div>
          </SettingCard>

          <SettingCard
            title="Trade Approval"
            description="When on, every gift card trade waits for manual review before the user is credited."
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Require approval for all trades
              </span>
              <Switch
                checked={tradeApprovalAll}
                onCheckedChange={saveTradeApproval}
                disabled={savingTradeApproval}
              />
            </div>
          </SettingCard>
        </div>
      ) : null}
    </div>
  )
}

export default SettingsPage
