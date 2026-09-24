import { Outlet, useNavigate } from "react-router-dom"

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { useAuth } from "@/lib/auth/use-auth"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function DashboardLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const userName = admin?.fullName ?? "Admin"
  const userRole = "Administrator"

  async function handleLogout() {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          userName={userName}
          userRole={userRole}
          avatarUrl={admin?.profileImage ?? undefined}
          initials={getInitials(userName)}
          onLogout={handleLogout}
        />

        <main className="flex-1 px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { DashboardLayout }
