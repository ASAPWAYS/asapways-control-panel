import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/brand/logo"
import { navItems } from "@/components/layout/nav-items"

function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
      <Logo className="px-2" />

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isActive && "bg-sidebar-accent text-sidebar-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "absolute left-0 h-5 w-0.5 rounded-full bg-sidebar-primary opacity-0 transition-opacity",
                    isActive && "opacity-100"
                  )}
                  aria-hidden="true"
                />
                <Icon className="size-4.5 shrink-0" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export { DashboardSidebar }
