import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DetailPanel, DetailRow } from "@/components/ui/detail-row"
import { StatusDot } from "@/components/ui/status-dot"
import type { AppUser } from "@/lib/mock/users"

function UserProfileDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AppUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold text-foreground">
          User Profile
        </DialogTitle>

        <DetailPanel>
          <DetailRow label="Full Name:" value={user.fullName} />
          <DetailRow label="Username:" value={user.username} />
          <DetailRow label="Email Address:" value={user.email} />
          <DetailRow label="Phone Number:" value={user.phoneNumber} />
          <DetailRow label="Date Created:" value={user.dateCreatedFull} />
        </DetailPanel>

        <DetailPanel>
          <DetailRow
            label="Online Status:"
            value={
              <StatusDot
                tone={user.onlineStatus === "online" ? "good" : "neutral"}
                label={user.onlineStatus === "online" ? "Online" : "Offline"}
              />
            }
          />
        </DetailPanel>
      </DialogContent>
    </Dialog>
  )
}

export { UserProfileDialog }
