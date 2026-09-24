import type { Requester } from "@/lib/api/users"

export type ProviderType = "airtime-data" | "betting" | "disco" | "internet" | "cable"

export const providerTypes: { value: ProviderType; label: string }[] = [
  { value: "airtime-data", label: "Airtime & Data" },
  { value: "betting", label: "Betting" },
  { value: "disco", label: "Electricity (Disco)" },
  { value: "internet", label: "Internet" },
  { value: "cable", label: "Cable / TV" },
]

export interface ApiProvider {
  id: string
  name: string
  image: string
  providerId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

async function listProviders(request: Requester, type: ProviderType) {
  const data = await request<{ providers: ApiProvider[] }>(`/providers/${type}`)
  return data.providers
}

async function getProvider(request: Requester, type: ProviderType, id: string) {
  const data = await request<Record<string, unknown>>(`/providers/${type}/${id}`)
  return (data.provider ?? data) as ApiProvider
}

async function createProvider(
  request: Requester,
  type: ProviderType,
  payload: { name: string; image: string; providerId: string; isActive?: boolean }
) {
  return request(`/providers/${type}`, { method: "POST", body: payload })
}

async function updateProvider(
  request: Requester,
  type: ProviderType,
  id: string,
  payload: { name?: string; image?: string; isActive?: boolean }
) {
  return request(`/providers/${type}/${id}`, { method: "PATCH", body: payload })
}

async function deleteProvider(request: Requester, type: ProviderType, id: string) {
  return request(`/providers/${type}/${id}`, { method: "DELETE" })
}

async function toggleProvider(request: Requester, type: ProviderType, id: string) {
  return request(`/providers/${type}/${id}/toggle`, { method: "PATCH" })
}

export { listProviders, getProvider, createProvider, updateProvider, deleteProvider, toggleProvider }
