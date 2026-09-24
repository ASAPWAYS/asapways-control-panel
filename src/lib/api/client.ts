const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

type QueryValue = string | number | boolean | undefined | null

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  params?: object
  body?: unknown
  formData?: FormData
  token?: string | null
  signal?: AbortSignal
}

function buildUrl(path: string, params?: object) {
  const query = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params) as [string, QueryValue][]) {
      if (value === undefined || value === null || value === "") continue
      query.set(key, String(value))
    }
  }
  const queryString = query.toString()
  return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ""}`
}

async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", params, body, formData, token, signal } = options

  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (!formData && body !== undefined) headers["Content-Type"] = "application/json"

  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
      signal,
    })
  } catch {
    throw new ApiError("Could not reach the server. Check your connection.", 0)
  }

  const text = await response.text()
  const payload = text ? safeJsonParse(text) : null

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message?: unknown }).message)
        : undefined) ?? response.statusText
    const code =
      payload && typeof payload === "object" && "error" in payload
        ? typeof (payload as { error?: unknown }).error === "string"
          ? (payload as { error?: string }).error
          : undefined
        : undefined
    throw new ApiError(message, response.status, code)
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data
  }

  return payload as T
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export { apiRequest, ApiError, API_BASE_URL }
