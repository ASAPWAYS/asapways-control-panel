import { useState } from "react"

import { NavRow } from "@/components/ui/nav-row"
import { UserProfileDialog } from "@/components/users/user-profile-dialog"
import { AuthenticationDetailDialog } from "@/components/users/authentication-detail-dialog"
import { AllDetailsDialog } from "@/components/users/all-details-dialog"
import { LoginDetailDialog } from "@/components/users/login-detail-dialog"
import type { AppUser } from "@/lib/mock/users"

type AboutDialog = "profile" | "kyc" | "transactions" | "login" | null

const rows: {
  id: Exclude<AboutDialog, null>
  title: string
  subtitle: string
}[] = [
  {
    id: "profile",
    title: "User Full Profile",
    subtitle: "View user's full profile",
  },
  {
    id: "kyc",
    title: "User's Authentication & KYC Details",
    subtitle: "Passwords, Biometric, KYC Information",
  },
  {
    id: "transactions",
    title: "View All Transaction Details",
    subtitle: "Sell Giftcards, Withdraw, Bills Payment...",
  },
  {
    id: "login",
    title: "View Login Details",
    subtitle: "Check user's login history",
  },
]

function AboutAccountTab({ user }: { user: AppUser }) {
  const [activeDialog, setActiveDialog] = useState<AboutDialog>(null)

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <NavRow
          key={row.id}
          title={row.title}
          subtitle={row.subtitle}
          onClick={() => setActiveDialog(row.id)}
        />
      ))}

      <UserProfileDialog
        user={user}
        open={activeDialog === "profile"}
        onOpenChange={(open) => setActiveDialog(open ? "profile" : null)}
      />
      <AuthenticationDetailDialog
        user={user}
        open={activeDialog === "kyc"}
        onOpenChange={(open) => setActiveDialog(open ? "kyc" : null)}
      />
      <AllDetailsDialog
        user={user}
        open={activeDialog === "transactions"}
        onOpenChange={(open) => setActiveDialog(open ? "transactions" : null)}
      />
      <LoginDetailDialog
        user={user}
        open={activeDialog === "login"}
        onOpenChange={(open) => setActiveDialog(open ? "login" : null)}
      />
    </div>
  )
}

export { AboutAccountTab }
