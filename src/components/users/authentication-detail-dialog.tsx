import { useState } from "react"
import { ChevronRight, Eye, EyeOff } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DetailPanel, DetailRow } from "@/components/ui/detail-row"
import type { AppUser } from "@/lib/mock/users"

function AuthenticationDetailDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AppUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [revealPassword, setRevealPassword] = useState(false)

  if (!user) return null

  const { authentication } = user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-background p-6 sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold text-foreground">
          Authentication Details
        </DialogTitle>

        <DetailPanel>
          <DetailRow
            label="Password:"
            value={
              <span className="inline-flex items-center gap-2">
                {revealPassword
                  ? "Pass1234!"
                  : authentication.passwordMasked}
                <button
                  type="button"
                  onClick={() => setRevealPassword((value) => !value)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {revealPassword ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </button>
              </span>
            }
          />
          <DetailRow label="Date Created:" value={authentication.dateCreated} />
        </DetailPanel>

        <h3 className="text-base font-semibold text-foreground">KYC Details</h3>
        <DetailPanel>
          <DetailRow
            label="KYC Level:"
            value={`Level ${user.kycLevel}`}
            valueClassName="text-primary"
          />
          <DetailRow label="BVN Number:" value={authentication.bvnNumber} />
          <DetailRow label="NIN Number:" value={authentication.ninNumber} />
          <DetailRow
            label="Face ID Image:"
            value={<ChevronRight className="size-4 text-muted-foreground" />}
          />
        </DetailPanel>

        <p className="text-center text-xs font-semibold tracking-wide text-status-warning uppercase">
          You do not have permission to access this account&rsquo;s information!!
        </p>
      </DialogContent>
    </Dialog>
  )
}

export { AuthenticationDetailDialog }
