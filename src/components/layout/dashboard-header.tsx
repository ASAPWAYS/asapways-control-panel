import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function DashboardHeader({
  userName,
  userRole,
  avatarUrl,
  initials,
}: {
  userName: string
  userRole: string
  avatarUrl?: string
  initials: string
}) {
  return (
    <header className="flex items-center justify-end border-b border-border px-6 py-5 lg:px-10">
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
    </header>
  )
}

export { DashboardHeader }
