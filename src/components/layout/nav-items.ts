import {
  LayoutGrid,
  Users,
  Wallet2,
  ArrowLeftRight,
  Percent,
  UserCog,
  ClipboardList,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { label: "Users", path: "/users", icon: Users },
  { label: "Giftcards", path: "/giftcards", icon: Wallet2 },
  { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { label: "Rates", path: "/rates", icon: Percent },
  { label: "Staffs", path: "/staffs", icon: UserCog },
  { label: "Reports", path: "/reports", icon: ClipboardList },
  { label: "Settings", path: "/settings", icon: Settings },
]
