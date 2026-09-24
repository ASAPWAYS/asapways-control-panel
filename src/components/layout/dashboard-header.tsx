import { LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

function DashboardHeader({
  userName,
  userRole,
  avatarUrl,
  initials,
  onLogout,
}: {
  userName: string
  userRole: string
  avatarUrl?: string
  initials: string
  onLogout?: () => void
}) {
  return (
    <header className="flex items-center justify-end gap-4 border-b border-border px-6 py-5 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{userName}</p>
          <p className="text-xs text-muted-foreground">{userRole}</p>
        </div>
        <Avatar size="lg">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={userName} /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>

      {onLogout ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Log out"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
        </Button>
      ) : null}
    </header>
  )
}

export { DashboardHeader }
