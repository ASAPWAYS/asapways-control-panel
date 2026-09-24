import {
  LayoutGrid,
  Users,
  Wallet2,
  ArrowLeftRight,
  ClipboardCheck,
  Percent,
  Zap,
  ShieldOff,
  CalendarClock,
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
  { label: "Approvals", path: "/approvals", icon: ClipboardCheck },
  { label: "Rates", path: "/rates", icon: Percent },
  { label: "Providers", path: "/providers", icon: Zap },
  { label: "Blacklist", path: "/blacklist", icon: ShieldOff },
  { label: "Shifts", path: "/shifts", icon: CalendarClock },
  { label: "Staffs", path: "/staffs", icon: UserCog },
  { label: "Reports", path: "/reports", icon: ClipboardList },
  { label: "Settings", path: "/settings", icon: Settings },
]
