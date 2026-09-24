const STORAGE_KEY = "asapways-admin-session"

interface StoredSession {
  token: string
  remember: boolean
}

function readSession(): StoredSession | null {
  for (const [storage, remember] of [
    [localStorage, true],
    [sessionStorage, false],
  ] as const) {
    try {
      const raw = storage.getItem(STORAGE_KEY)
      if (raw) return { token: (JSON.parse(raw) as { token: string }).token, remember }
    } catch {
      continue
    }
  }
  return null
}

function writeSession(token: string, remember: boolean) {
  const target = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage
  try {
    other.removeItem(STORAGE_KEY)
    target.setItem(STORAGE_KEY, JSON.stringify({ token, remember } satisfies StoredSession))
  } catch {
    return
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}

export { readSession, writeSession, clearSession }
