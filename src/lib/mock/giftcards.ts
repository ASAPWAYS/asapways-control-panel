import type { StatCardData } from "@/lib/types"
import type { Transaction } from "@/lib/mock/dashboard"

export type CardCategoryStatus = "active" | "inactive"

export interface CardCategory {
  id: string
  category: number
  description: string
  amountRange: string
  tradeCount: number
  status: CardCategoryStatus
  dateAdded: string
}

const sampleCardCategories: CardCategory[] = [
  {
    id: "cat-1",
    category: 1,
    description: "🇺🇸 USA - Card + Receipt Pic",
    amountRange: "$25-$100",
    tradeCount: 204,
    status: "inactive",
    dateAdded: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "cat-2",
    category: 2,
    description: "🇺🇸 USA - Card + Receipt Pic",
    amountRange: "$20-$50",
    tradeCount: 18,
    status: "active",
    dateAdded: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "cat-3",
    category: 3,
    description: "🇺🇸 USA - Card + Receipt Pic",
    amountRange: "$50-$100",
    tradeCount: 354,
    status: "active",
    dateAdded: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "cat-4",
    category: 4,
    description: "🇺🇸 USA - Card + Receipt Pic",
    amountRange: "$500-$1000",
    tradeCount: 45,
    status: "active",
    dateAdded: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "cat-5",
    category: 5,
    description: "🇺🇸 USA - Card + Receipt Pic",
    amountRange: "$25-$100",
    tradeCount: 7176,
    status: "active",
    dateAdded: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "cat-6",
    category: 6,
    description: "🇺🇸 USA - Card + Receipt Pic",
    amountRange: "$100-$500",
    tradeCount: 278,
    status: "active",
    dateAdded: "18 Oct 2025, 12:30 PM",
  },
]

export interface GiftcardBrand {
  id: string
  name: string
  tileClassName: string
  wordmark: string
  wordmarkClassName: string
  cardCategoriesCount: number
  status: CardCategoryStatus
  dateAdded: string
  tradedCount: number
  rangeFrom: string
  rangeTo: string
  categories: CardCategory[]
  imageUrl?: string
}

const giftcardSeeds: Omit<GiftcardBrand, "rangeFrom" | "rangeTo">[] = [
  {
    id: "razor-gold",
    name: "Razer Gold",
    tileClassName: "bg-gradient-to-br from-[#1a1a1a] to-black",
    wordmark: "Razer Gold",
    wordmarkClassName: "font-bold italic text-[#44d62c]",
    cardCategoriesCount: 10,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 1035,
    categories: sampleCardCategories,
  },
  {
    id: "roblox",
    name: "Roblox",
    tileClassName: "bg-black",
    wordmark: "ROBLOX",
    wordmarkClassName: "font-black italic text-white",
    cardCategoriesCount: 6,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 812,
    categories: sampleCardCategories,
  },
  {
    id: "steam",
    name: "Steam",
    tileClassName: "bg-gradient-to-br from-[#1b2838] to-[#0e1b2b]",
    wordmark: "STEAM",
    wordmarkClassName: "font-bold tracking-wide text-[#66c0f4]",
    cardCategoriesCount: 8,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 2140,
    categories: sampleCardCategories,
  },
  {
    id: "bloomingdales",
    name: "Bloomingdale's",
    tileClassName: "bg-black",
    wordmark: "bloomingdale's",
    wordmarkClassName: "font-serif italic text-white",
    cardCategoriesCount: 4,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 320,
    categories: sampleCardCategories,
  },
  {
    id: "american-express",
    name: "American Express",
    tileClassName: "bg-gradient-to-br from-[#d4b96a] to-[#a9873f]",
    wordmark: "AMEX",
    wordmarkClassName: "font-bold tracking-widest text-[#1f2b5e]",
    cardCategoriesCount: 5,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 654,
    categories: sampleCardCategories,
  },
  {
    id: "american-express-serve",
    name: "American Express Serve",
    tileClassName: "bg-gradient-to-br from-[#0f8a5f] to-[#0a6244]",
    wordmark: "serve",
    wordmarkClassName: "font-bold italic text-white",
    cardCategoriesCount: 3,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 198,
    categories: sampleCardCategories,
  },
  {
    id: "google-play",
    name: "Google Play",
    tileClassName: "bg-black",
    wordmark: "▶",
    wordmarkClassName: "text-3xl text-[#00c853]",
    cardCategoriesCount: 7,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 1420,
    categories: sampleCardCategories,
  },
  {
    id: "sephora",
    name: "Sephora",
    tileClassName: "bg-black",
    wordmark: "SEPHORA",
    wordmarkClassName: "font-serif tracking-widest text-white",
    cardCategoriesCount: 3,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 210,
    categories: sampleCardCategories,
  },
  {
    id: "ebay",
    name: "ebay",
    tileClassName: "bg-white",
    wordmark: "ebay",
    wordmarkClassName: "font-bold italic text-[#e53238]",
    cardCategoriesCount: 4,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 388,
    categories: sampleCardCategories,
  },
  {
    id: "xbox",
    name: "Xbox",
    tileClassName: "bg-[#107c10]",
    wordmark: "XBOX",
    wordmarkClassName: "font-bold tracking-widest text-white",
    cardCategoriesCount: 6,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 976,
    categories: sampleCardCategories,
  },
  {
    id: "walmart-visa",
    name: "Walmart Visa",
    tileClassName: "bg-gradient-to-br from-[#5a5f66] to-[#3a3e44]",
    wordmark: "VISA",
    wordmarkClassName: "font-bold italic text-white",
    cardCategoriesCount: 2,
    status: "active",
    dateAdded: "August 4, 2025",
    tradedCount: 142,
    categories: sampleCardCategories,
  },
]

export const giftcardCatalog: GiftcardBrand[] = giftcardSeeds.map((seed) => ({
  ...seed,
  rangeFrom: "20",
  rangeTo: "10,000",
}))

export const giftcardStats: StatCardData[] = [
  { id: "added", value: "23", label: "Total Number Of Giftcards Added" },
  { id: "traded", value: "945", label: "Total Number Of Giftcards Traded" },
  { id: "traded-today", value: "151", label: "Total Number Of Giftcards Traded Today" },
  { id: "awaiting", value: "23", label: "Giftcard Awaiting Confirmation" },
]

export const recentGiftcardTransactions: Transaction[] = [
  {
    id: "12DFR67A",
    user: "John Anifola",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    rate: "N1440/$",
    status: "approved",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "45DFRH43",
    user: "Oluwadamilola Tomiwa",
    giftcard: "Xbox",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$25",
    rate: "N1440/$",
    status: "awaiting-approval",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "12DFR67A",
    user: "John Anifola",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    rate: "N1440/$",
    status: "approved",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "12DFR67A",
    user: "John Anifola",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    rate: "N1440/$",
    status: "approved",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "12DFR67A",
    user: "John Anifola",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$25",
    rate: "N1440/$",
    status: "approved",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "12DFR67A",
    user: "John Anifola",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$50",
    rate: "N1440/$",
    status: "approved",
    date: "18 Oct 2025, 12:30 PM",
  },
  {
    id: "56GTH5G",
    user: "Tobilola Micheal",
    giftcard: "Stream",
    description: "🇬🇧 UK - Ecode only",
    amount: "$500",
    rate: "N1440/$",
    status: "awaiting-approval",
    date: "18 Nov 2025, 12:30 PM",
  },
  {
    id: "56GTH5G",
    user: "Tobilola Micheal",
    giftcard: "Stream",
    description: "🇬🇧 UK - Ecode only",
    amount: "$100",
    rate: "N1440/$",
    status: "awaiting-approval",
    date: "18 Nov 2025, 12:30 PM",
  },
  {
    id: "56GTH5G",
    user: "Tobilola Micheal",
    giftcard: "Stream",
    description: "🇬🇧 UK - Ecode only",
    amount: "$20",
    rate: "N1440/$",
    status: "awaiting-approval",
    date: "18 Nov 2025, 12:30 PM",
  },
  {
    id: "56GTH5G",
    user: "Tobilola Micheal",
    giftcard: "Stream",
    description: "🇬🇧 UK - Ecode only",
    amount: "$100",
    rate: "N1440/$",
    status: "awaiting-approval",
    date: "18 Nov 2025, 12:30 PM",
  },
  {
    id: "3HYU63K",
    user: "Ogunmepkon Gilmore",
    giftcard: "Xbox",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$67",
    rate: "N1440/$",
    status: "failed",
    date: "18 Oct 2025, 12:30 PM",
  },
]
