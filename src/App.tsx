import type { ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { navItems } from "@/components/layout/nav-items"
import { AuthProvider } from "@/lib/auth/auth-context"
import { useAuth } from "@/lib/auth/use-auth"
import LoginPage from "@/pages/auth/login"
import DashboardPage from "@/pages/dashboard"
import UsersPage from "@/pages/users"
import GiftcardsPage from "@/pages/giftcards"
import AllGiftcardsPage from "@/pages/giftcards/all"
import TransactionsPage from "@/pages/transactions"
import ApprovalsPage from "@/pages/approvals"
import ProvidersPage from "@/pages/providers"
import BlacklistPage from "@/pages/blacklist"
import ShiftsPage from "@/pages/shifts"
import StaffsPage from "@/pages/staffs"
import ReportsPage from "@/pages/reports"
import SettingsPage from "@/pages/settings"
import PlaceholderPage from "@/pages/placeholder-page"

const builtInNavPaths = [
  "/dashboard",
  "/users",
  "/giftcards",
  "/transactions",
  "/approvals",
  "/providers",
  "/blacklist",
  "/shifts",
  "/staffs",
  "/reports",
  "/settings",
]

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      Loading…
    </div>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === "checking") return <FullScreenLoader />
  if (status === "unauthenticated") return <Navigate to="/login" replace />
  return children
}

function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === "checking") return <FullScreenLoader />
  if (status === "authenticated") return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <LoginPage />
          </RedirectIfAuthed>
        }
      />

      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/giftcards" element={<GiftcardsPage />} />
        <Route path="/giftcards/all" element={<AllGiftcardsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/providers" element={<ProvidersPage />} />
        <Route path="/blacklist" element={<BlacklistPage />} />
        <Route path="/shifts" element={<ShiftsPage />} />
        <Route path="/staffs" element={<StaffsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {navItems
          .filter((item) => !builtInNavPaths.includes(item.path))
          .map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<PlaceholderPage title={item.label} />}
            />
          ))}
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
