import { createContext } from "react"

import type { RequestOptions } from "@/lib/api/client"
import type { AdminProfile } from "@/lib/api/auth"

type AuthStatus = "checking" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  status: AuthStatus
  admin: AdminProfile | null
  requestLoginCode: (email: string, password: string) => Promise<void>
  confirmLoginCode: (email: string, otp: string, remember: boolean) => Promise<void>
  logout: () => Promise<void>
  request: <T = unknown>(path: string, options?: RequestOptions) => Promise<T>
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export { AuthContext }
export type { AuthContextValue, AuthStatus }
