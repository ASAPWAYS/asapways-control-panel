import type { StatCardData } from "@/lib/types"

export const statCards: StatCardData[] = [
  {
    id: "giftcards-traded",
    value: "150+",
    label: "Giftcards Traded Today",
    trend: { direction: "up", percent: "18%" },
  },
  {
    id: "pending-approvals",
    value: "78",
    label: "Pending Gift Card Approvals",
  },
  {
    id: "unset-metric",
    value: "150+",
    label: "-_-",
    trend: { direction: "down", percent: "18%" },
  },
  {
    id: "transactions-approved",
    value: "50",
    label: "Total Transaction you Approved Today",
  },
]

export interface WeeklyAnalysisPoint {
  day: string
  sellGiftcards: number
  withdrawFunds: number
}

export const weeklyAnalysis: WeeklyAnalysisPoint[] = [
  { day: "Sat", sellGiftcards: 470, withdrawFunds: 235 },
  { day: "Sun", sellGiftcards: 345, withdrawFunds: 110 },
  { day: "Mon", sellGiftcards: 315, withdrawFunds: 260 },
  { day: "Tue", sellGiftcards: 470, withdrawFunds: 375 },
  { day: "Wed", sellGiftcards: 105, withdrawFunds: 225 },
  { day: "Thu", sellGiftcards: 390, withdrawFunds: 215 },
  { day: "Fri", sellGiftcards: 385, withdrawFunds: 320 },
]

export interface GiftcardActivity {
  id: string
  name: string
  sellsRate: string
}

export const topGiftcardActivity: GiftcardActivity[] = [
  { id: "razor-gold", name: "Razor Gold", sellsRate: "12.2k+" },
  { id: "xbox", name: "Xbox", sellsRate: "10.1K" },
  { id: "steam", name: "Steam", sellsRate: "8k" },
  { id: "google-play", name: "Google Play", sellsRate: "6.9k" },
  { id: "roblox", name: "Roblox", sellsRate: "5.2k" },
  { id: "bloomingdales", name: "Bloomingdale's", sellsRate: "3k" },
  { id: "walmart-visa", name: "Walmart Visa", sellsRate: "1.2k" },
]

export type TransactionStatus = "approved" | "awaiting-approval" | "failed"

export interface Transaction {
  id: string
  user: string
  giftcard: string
  description: string
  amount: string
  rate: string
  status: TransactionStatus
  date: string
}

export const recentTransactions: Transaction[] = [
  {
    id: "12DFR67A",
    user: "John Anifola",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    rate: "750/$",
    status: "approved",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "45DFRH43",
    user: "Oluwadamilola Tomiwa",
    giftcard: "Xbox",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$29",
    rate: "750/$",
    status: "awaiting-approval",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "12DFR67A",
    user: "John Anifola",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    rate: "750/$",
    status: "approved",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "56GTH5G",
    user: "Tobilola Micheal",
    giftcard: "Stream",
    description: "🇬🇧 UK - Ecode only",
    amount: "$29",
    rate: "750/$",
    status: "awaiting-approval",
    date: "18 Nov 2025, 12:30 PM",
  },
  {
    id: "3HYU63K",
    user: "Ogunmepkon Gilmore",
    giftcard: "Xbox",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$29",
    rate: "750/$",
    status: "failed",
    date: "18 Oct 2025, 12:30 PM",
  },
]

export const currentUser = {
  name: "Patience Tomiwa",
  role: "Admin",
  initials: "PT",
}
