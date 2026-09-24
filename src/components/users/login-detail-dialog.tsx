import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DetailPanel, DetailRow } from "@/components/ui/detail-row"
import type { AppUser } from "@/lib/mock/users"

function LoginDetailDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AppUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!user) return null

  const { loginDetails } = user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold text-foreground">
          Login Details
        </DialogTitle>

        <DetailPanel>
          <DetailRow
            label="Current Login:"
            value={`${loginDetails.current.date} ${loginDetails.current.device}`}
            valueClassName="text-status-good"
          />
          {loginDetails.others.map((login, index) => (
            <DetailRow
              key={index}
              label="Other Logins:"
              value={`${login.date} ${login.device}`}
            />
          ))}
        </DetailPanel>
      </DialogContent>
    </Dialog>
  )
}

export { LoginDetailDialog }
