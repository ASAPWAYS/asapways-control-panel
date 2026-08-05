import { Outlet } from "react-router-dom"

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { currentUser } from "@/lib/mock/dashboard"

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          userName={currentUser.name}
          userRole={currentUser.role}
          initials={currentUser.initials}
        />

        <main className="flex-1 px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { DashboardLayout }
