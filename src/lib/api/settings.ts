import type { Requester } from "@/lib/api/users"

export interface PlatformSettings {
  withdrawal_approval: { thresholdKobo: number }
  trade_approval: { mode: "ALL" | "NONE" }
  shift_enforcement: { enabled: boolean; bypassRoleSlugs: string[] }
}

type SettingKey = keyof PlatformSettings

async function getSettings(request: Requester) {
  const data = await request<{ settings: PlatformSettings }>("/settings")
  return data.settings
}

async function updateSetting<K extends SettingKey>(
  request: Requester,
  key: K,
  value: PlatformSettings[K]
) {
  return request(`/settings/${key}`, { method: "PUT", body: value })
}

export { getSettings, updateSetting }
export type { SettingKey }
