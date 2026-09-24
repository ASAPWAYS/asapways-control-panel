import { apiRequest } from "@/lib/api/client"
import type { RequestOptions } from "@/lib/api/client"

export interface AdminProfile {
  id: string
  email: string
  fullName: string
  profileImage: string | null
  isActive: boolean
  shiftBypassUntil: string | null
  emailVerifiedAt: string | null
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  permissions?: string[]
}

export interface LoginResult {
  admin: AdminProfile
  token: string
}

interface LoginVerifyResponse {
  admin: AdminProfile
  accessToken: { token: string; expires: string }
}

async function startLogin(email: string, password: string) {
  return apiRequest<{ email: string; expiresInMinutes: number }>("/auth/login", {
    method: "POST",
    body: { email, password },
  })
}

async function verifyLogin(email: string, otp: string): Promise<LoginResult> {
  const data = await apiRequest<LoginVerifyResponse>("/auth/login/verify", {
    method: "POST",
    body: { email, otp },
  })
  return { admin: data.admin, token: data.accessToken.token }
}

async function refreshSession(token: string): Promise<string> {
  const data = await apiRequest<LoginVerifyResponse>("/auth/refresh", {
    method: "POST",
    token,
  })
  return data.accessToken.token
}

async function logoutSession(token: string) {
  return apiRequest<unknown>("/auth/logout", { method: "POST", token })
}

async function getMe(token: string): Promise<AdminProfile> {
  const data = await apiRequest<{ admin: AdminProfile; permissions: string[] }>("/auth/me", {
    token,
  })
  return { ...data.admin, permissions: data.permissions }
}

export type { RequestOptions }
export { startLogin, verifyLogin, refreshSession, logoutSession, getMe }
