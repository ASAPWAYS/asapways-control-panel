import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import { apiRequest, ApiError, type RequestOptions } from "@/lib/api/client"
import {
  startLogin,
  verifyLogin,
  refreshSession,
  logoutSession,
  getMe,
  type AdminProfile,
} from "@/lib/api/auth"
import { readSession, writeSession, clearSession } from "@/lib/auth/session-storage"
import { AuthContext, type AuthStatus } from "@/lib/auth/context"

function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking")
  const [admin, setAdmin] = useState<AdminProfile | null>(null)
  const tokenRef = useRef<string | null>(null)
  const rememberRef = useRef(true)

  const clearAuth = useCallback(() => {
    tokenRef.current = null
    clearSession()
    setAdmin(null)
    setStatus("unauthenticated")
  }, [])

  const request = useCallback(
    async <T,>(path: string, options: RequestOptions = {}): Promise<T> => {
      const token = tokenRef.current
      try {
        return await apiRequest<T>(path, { ...options, token })
      } catch (error) {
        if (error instanceof ApiError && error.status === 401 && token) {
          try {
            const nextToken = await refreshSession(token)
            tokenRef.current = nextToken
            writeSession(nextToken, rememberRef.current)
            return await apiRequest<T>(path, { ...options, token: nextToken })
          } catch {
            clearAuth()
            throw error
          }
        }
        throw error
      }
    },
    [clearAuth]
  )

  useEffect(() => {
    const stored = readSession()
    if (!stored) {
      setStatus("unauthenticated")
      return
    }

    tokenRef.current = stored.token
    rememberRef.current = stored.remember
    getMe(stored.token)
      .then((profile) => {
        setAdmin(profile)
        setStatus("authenticated")
      })
      .catch(() => {
        clearAuth()
      })
  }, [clearAuth])

  const requestLoginCode = useCallback(async (email: string, password: string) => {
    await startLogin(email, password)
  }, [])

  const confirmLoginCode = useCallback(
    async (email: string, otp: string, remember: boolean) => {
      const { admin: nextAdmin, token } = await verifyLogin(email, otp)
      tokenRef.current = token
      rememberRef.current = remember
      writeSession(token, remember)
      setAdmin(nextAdmin)
      setStatus("authenticated")
    },
    []
  )

  const getToken = useCallback(() => tokenRef.current, [])

  const logout = useCallback(async () => {
    const token = tokenRef.current
    if (token) await logoutSession(token).catch(() => {})
    clearAuth()
  }, [clearAuth])

  return (
    <AuthContext.Provider
      value={{ status, admin, requestLoginCode, confirmLoginCode, logout, request, getToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
