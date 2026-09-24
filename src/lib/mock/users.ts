import type { StatCardData, FilterOption } from "@/lib/types"

export type KycLevel = 0 | 1 | 2 | 3
export type UserStatus = "verified" | "unverified"
export type GiftcardTxStatus = "successful" | "pending-approval"

export interface GiftcardDetail {
  giftcardName: string
  cardType: string
  transactionId: string
  cardCategory: string
  giftcardAmount: string
  rate: string
  eCode: string
  paymentMode: string
  walletAddress: string
  amountToReceive: string
}

export interface UserGiftcardTransaction {
  id: string
  giftcard: string
  description: string
  amount: string
  paymentMethod: string
  status: GiftcardTxStatus
  date: string
  detail: GiftcardDetail
}

export type WithdrawalStatus = "approved" | "pending"

export interface WithdrawalDetail {
  transactionId: string
  receiverName: string
  receiverBank: string
  receiverAccountNumber: string
  remark: string
  withdrawalDate: string
  amountWithdrawn: string
  status: WithdrawalStatus
  adminPersonnel: string
}

export interface UserWithdrawal {
  id: string
  recipient: string
  accountDetails: string
  amount: string
  paymentMethod: string
  status: WithdrawalStatus
  date: string
  detail: WithdrawalDetail
}

export interface BillDetail {
  transactionId: string
  transactionType: string
  description: string
  fields: { label: string; value: string }[]
  date: string
  amount: string
  status: "successful"
}

export interface BillTransaction {
  id: string
  type: string
  description: string
  reference: string
  amount: string
  provider: string
  status: "successful"
  date: string
  detail: BillDetail
}

export interface AuthenticationDetail {
  passwordMasked: string
  dateCreated: string
  bvnNumber: string
  ninNumber: string
}

export interface AccountSummary {
  currentWalletBalance: string
  giftcardsTradedToday: number
  withdrawalsToday: number
  billPaymentsToday: number
  totalGiftcardTransactions: number
  giftcardTradedMost: string
  highestGiftcardTraded: string
  totalGiftcardValue: string
  totalWithdrawals: number
  lastWithdrawalDate: string
  highestWithdrawal: string
  totalWithdrawn: string
  totalBillsTransactions: number
  lastBillDate: string
  mostUsedBillType: string
  totalBillsSpent: string
}

export interface LoginRecord {
  date: string
  device: string
}

export interface LoginDetails {
  current: LoginRecord
  others: LoginRecord[]
}

export interface AppUser {
  id: string
  name: string
  fullName: string
  username: string
  email: string
  phoneNumber: string
  kycLevel: KycLevel
  walletBalance: string
  dateJoined: string
  status: UserStatus
  lastUpdated: string
  dateCreated: string
  dateCreatedFull: string
  onlineStatus: "online" | "offline"
  authentication: AuthenticationDetail
  accountSummary: AccountSummary
  loginDetails: LoginDetails
  transactions: UserGiftcardTransaction[]
  withdrawals: UserWithdrawal[]
  bills: BillTransaction[]
}

const sampleTransactions: UserGiftcardTransaction[] = [
  {
    id: "12DFR67A",
    giftcard: "Xbox",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    paymentMethod: "Naira",
    status: "pending-approval",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      giftcardName: "Xbox",
      cardType: "Nigeria",
      transactionId: "1AGT5641",
      cardCategory:
        "🇺🇸 USA - Card + Receipt Pic [ $25 - $500 ] [ $501 - $1500 Slow Load ]",
      giftcardAmount: "$100",
      rate: "N1500/$",
      eCode: "HGY-7361452-11",
      paymentMode: "Naira Wallet",
      walletAddress: "0289417756 - GTBank",
      amountToReceive: "N150,000",
    },
  },
  {
    id: "12DFR67A",
    giftcard: "Xbox",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    paymentMethod: "Naira",
    status: "pending-approval",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      giftcardName: "Xbox",
      cardType: "Nigeria",
      transactionId: "1AGT5642",
      cardCategory:
        "🇺🇸 USA - Card + Receipt Pic [ $25 - $500 ] [ $501 - $1500 Slow Load ]",
      giftcardAmount: "$100",
      rate: "N1500/$",
      eCode: "HGY-7362198-23",
      paymentMode: "Naira Wallet",
      walletAddress: "0289417756 - GTBank",
      amountToReceive: "N150,000",
    },
  },
  {
    id: "12DFR67A",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    paymentMethod: "USDT",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      giftcardName: "Razor Gold",
      cardType: "Nigeria",
      transactionId: "1AGT5647",
      cardCategory:
        "🇺🇸 USA - Card + Receipt Pic [ $25 - $500 ] [ $501 - $1500 Slow Load ]",
      giftcardAmount: "$100",
      rate: "N1500/$",
      eCode: "HGY-7368456-76",
      paymentMode: "USDT Wallet",
      walletAddress: "12aheyv471987dg7haj7jjja332",
      amountToReceive: "$98",
    },
  },
  {
    id: "12DFR67A",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    paymentMethod: "USDT",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      giftcardName: "Razor Gold",
      cardType: "Nigeria",
      transactionId: "1AGT5648",
      cardCategory:
        "🇺🇸 USA - Card + Receipt Pic [ $25 - $500 ] [ $501 - $1500 Slow Load ]",
      giftcardAmount: "$100",
      rate: "N1500/$",
      eCode: "HGY-7368457-77",
      paymentMode: "USDT Wallet",
      walletAddress: "12aheyv471987dg7haj7jjja332",
      amountToReceive: "$98",
    },
  },
  {
    id: "12DFR67A",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    paymentMethod: "Naira",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      giftcardName: "Razor Gold",
      cardType: "Nigeria",
      transactionId: "1AGT5649",
      cardCategory:
        "🇺🇸 USA - Card + Receipt Pic [ $25 - $500 ] [ $501 - $1500 Slow Load ]",
      giftcardAmount: "$100",
      rate: "N1500/$",
      eCode: "HGY-7368458-78",
      paymentMode: "Naira Wallet",
      walletAddress: "0289417756 - GTBank",
      amountToReceive: "N150,000",
    },
  },
  {
    id: "12DFR67A",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    paymentMethod: "USDT",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      giftcardName: "Razor Gold",
      cardType: "Nigeria",
      transactionId: "1AGT5650",
      cardCategory:
        "🇺🇸 USA - Card + Receipt Pic [ $25 - $500 ] [ $501 - $1500 Slow Load ]",
      giftcardAmount: "$100",
      rate: "N1500/$",
      eCode: "HGY-7368459-79",
      paymentMode: "USDT Wallet",
      walletAddress: "12aheyv471987dg7haj7jjja332",
      amountToReceive: "$98",
    },
  },
  {
    id: "12DFR67A",
    giftcard: "Razor Gold",
    description: "🇺🇸 USA - Card + Receipt Pic",
    amount: "$100",
    paymentMethod: "USDT",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      giftcardName: "Razor Gold",
      cardType: "Nigeria",
      transactionId: "1AGT5651",
      cardCategory:
        "🇺🇸 USA - Card + Receipt Pic [ $25 - $500 ] [ $501 - $1500 Slow Load ]",
      giftcardAmount: "$100",
      rate: "N1500/$",
      eCode: "HGY-7368460-80",
      paymentMode: "USDT Wallet",
      walletAddress: "12aheyv471987dg7haj7jjja332",
      amountToReceive: "$98",
    },
  },
]

const sampleWithdrawals: UserWithdrawal[] = Array.from({ length: 4 }, (_, index) => ({
  id: "12DFR67A",
  recipient: "Joshua Mercy",
  accountDetails: "8056748316 - Palmpay",
  amount: "N20,000",
  paymentMethod: "Asapways - Bank",
  status: "approved",
  date: "18 Oct 2025, 12:30 PM",
  detail: {
    transactionId: `1AGT564${7 + index}`,
    receiverName: "OLudamilola Tomiwa",
    receiverBank: "Zenith Bank PLC",
    receiverAccountNumber: "21346758934",
    remark: "-_-",
    withdrawalDate: "19th October 2025. 09:20AM",
    amountWithdrawn: "N 2,000,000",
    status: "approved",
    adminPersonnel: "David Badmus",
  },
}))

const sampleBills: BillTransaction[] = [
  {
    id: "12DFR67A",
    type: "Airtime",
    description: "Airtime Purchase",
    reference: "08000000001",
    amount: "N 10,000",
    provider: "MTN",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      transactionId: "1AGT5647",
      transactionType: "Airtime",
      description: "Airtime Purchase",
      fields: [
        { label: "Phone Number:", value: "08000000001" },
        { label: "Service Provider:", value: "MTN" },
      ],
      date: "19th October 2025. 09:20AM",
      amount: "N 10,000",
      status: "successful",
    },
  },
  {
    id: "12DFR67A",
    type: "TV",
    description: "DSTV Premium - 1 Month",
    reference: "7365884561",
    amount: "N23,450",
    provider: "DSTV",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      transactionId: "1AGT5652",
      transactionType: "TV",
      description: "DSTV Premium - 1 Month",
      fields: [
        { label: "Smart Card Number:", value: "7365884561" },
        { label: "TV Provider:", value: "DSTV" },
      ],
      date: "18 Oct 2025, 12:30 PM",
      amount: "N23,450",
      status: "successful",
    },
  },
  {
    id: "12DFR67A",
    type: "Data",
    description: "1.5GB - 2 Days",
    reference: "08000000002",
    amount: "N1,000",
    provider: "Glo",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      transactionId: "1AGT5653",
      transactionType: "Data",
      description: "1.5GB - 2 Days",
      fields: [
        { label: "Phone Number:", value: "08000000002" },
        { label: "Service Provider:", value: "Glo" },
      ],
      date: "18 Oct 2025, 12:30 PM",
      amount: "N1,000",
      status: "successful",
    },
  },
  {
    id: "12DFR67A",
    type: "Electricity Bills",
    description: "Electricity Bill Payment",
    reference: "45717912308",
    amount: "N5,000",
    provider: "Kaduna Electricity",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      transactionId: "1AGT5654",
      transactionType: "Electricity Bills",
      description: "Electricity Bill Payment",
      fields: [
        { label: "Meter Number:", value: "23528361940" },
        { label: "Electricity Provider:", value: "Kaduna Electricity" },
      ],
      date: "19th October 2025. 09:20AM",
      amount: "N 20,100",
      status: "successful",
    },
  },
  {
    id: "12DFR67A",
    type: "Betting",
    description: "Betting Payment",
    reference: "08000000002",
    amount: "N500",
    provider: "1xBet",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      transactionId: "1AGT5655",
      transactionType: "Betting",
      description: "Betting Payment",
      fields: [
        { label: "Customer ID:", value: "08000000002" },
        { label: "Betting Platform:", value: "1xBet" },
      ],
      date: "18 Oct 2025, 12:30 PM",
      amount: "N500",
      status: "successful",
    },
  },
  {
    id: "12DFR67A",
    type: "Data",
    description: "1.5GB - 2 Days",
    reference: "08000000002",
    amount: "N1,000",
    provider: "Glo",
    status: "successful",
    date: "18 Oct 2025, 12:30 PM",
    detail: {
      transactionId: "1AGT5656",
      transactionType: "Data",
      description: "1.5GB - 2 Days",
      fields: [
        { label: "Phone Number:", value: "08000000002" },
        { label: "Service Provider:", value: "Glo" },
      ],
      date: "18 Oct 2025, 12:30 PM",
      amount: "N1,000",
      status: "successful",
    },
  },
]

type UserSeed = Pick<
  AppUser,
  | "id"
  | "name"
  | "email"
  | "kycLevel"
  | "walletBalance"
  | "dateJoined"
  | "status"
  | "lastUpdated"
  | "dateCreated"
>

const userSeeds: UserSeed[] = [
  {
    id: "usr-1",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 2,
    walletBalance: "NGN 2,180,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "10 Jan 2025, 1:30 PM",
    dateCreated: "January 13, 2025",
  },
  {
    id: "usr-2",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 2,
    walletBalance: "NGN 980,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "10 Jan 2025, 1:30 PM",
    dateCreated: "January 13, 2025",
  },
  {
    id: "usr-3",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 1,
    walletBalance: "NGN 100,000",
    dateJoined: "13th Jan 2025",
    status: "unverified",
    lastUpdated: "10 Jan 2025, 1:30 PM",
    dateCreated: "January 13, 2025",
  },
  {
    id: "usr-4",
    name: "Oludamilola Tomiwa",
    email: "damilola.tomiwa@example.com",
    kycLevel: 3,
    walletBalance: "NGN 10,230,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "18 Oct 2025, 12:30 PM",
    dateCreated: "August 4, 2025",
  },
  {
    id: "usr-5",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 3,
    walletBalance: "NGN 10,230,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "18 Oct 2025, 12:30 PM",
    dateCreated: "January 13, 2025",
  },
  {
    id: "usr-6",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 3,
    walletBalance: "NGN 10,230,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "18 Oct 2025, 12:30 PM",
    dateCreated: "January 13, 2025",
  },
  {
    id: "usr-7",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 3,
    walletBalance: "NGN 10,230,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "18 Oct 2025, 12:30 PM",
    dateCreated: "January 13, 2025",
  },
  {
    id: "usr-8",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 3,
    walletBalance: "NGN 10,230,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "18 Oct 2025, 12:30 PM",
    dateCreated: "January 13, 2025",
  },
  {
    id: "usr-9",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 3,
    walletBalance: "NGN 10,230,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "18 Oct 2025, 12:30 PM",
    dateCreated: "January 13, 2025",
  },
  {
    id: "usr-10",
    name: "John Anifola",
    email: "john.anifola@example.com",
    kycLevel: 3,
    walletBalance: "NGN 10,230,000",
    dateJoined: "13th Jan 2025",
    status: "verified",
    lastUpdated: "18 Oct 2025, 12:30 PM",
    dateCreated: "January 13, 2025",
  },
]

function usernameFrom(email: string) {
  return email.split("@")[0]
}

const sampleAuthentication: AuthenticationDetail = {
  passwordMasked: "XXXXXXX",
  dateCreated: "10th April 2025, 9:10AM",
  bvnNumber: "284651769648",
  ninNumber: "637358162909",
}

const sampleAccountSummary: AccountSummary = {
  currentWalletBalance: "N 203,000",
  giftcardsTradedToday: 1,
  withdrawalsToday: 2,
  billPaymentsToday: 0,
  totalGiftcardTransactions: 32,
  giftcardTradedMost: "American Express",
  highestGiftcardTraded: "$500",
  totalGiftcardValue: "$ 4320",
  totalWithdrawals: 13,
  lastWithdrawalDate: "15th Oct 2025",
  highestWithdrawal: "N800,000",
  totalWithdrawn: "N 2,500,000",
  totalBillsTransactions: 24,
  lastBillDate: "20th Sep 2025",
  mostUsedBillType: "Airtime",
  totalBillsSpent: "N 55,200",
}

const sampleLoginDetails: LoginDetails = {
  current: { date: "6 Nov 2025, 5:05PM", device: "Iphone 12" },
  others: [
    { date: "12 Sep 2025, 5:05PM", device: "Iphone 16" },
    { date: "12 Sep 2025, 5:05PM", device: "Iphone 16" },
    { date: "12 Sep 2025, 5:05PM", device: "Iphone 16" },
  ],
}

export const users: AppUser[] = userSeeds.map((seed) => ({
  ...seed,
  fullName: `${seed.name} Daniel`,
  username: usernameFrom(seed.email),
  phoneNumber: "08062627654312",
  dateCreatedFull: "10th April 2025, 9:10AM",
  onlineStatus: "online",
  transactions: sampleTransactions,
  withdrawals: sampleWithdrawals,
  bills: sampleBills,
  authentication: sampleAuthentication,
  accountSummary: sampleAccountSummary,
  loginDetails: sampleLoginDetails,
}))

export const userStats: StatCardData[] = [
  { id: "total-users", value: "23,657", label: "Total Number Of Users" },
  { id: "verified-users", value: "13,256", label: "Verified Users" },
  { id: "unverified-users", value: "10,401", label: "Unverified Users" },
  { id: "kyc-registered", value: "7,020", label: "KYC Registered Users" },
]

export const sortOrderOptions: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "New Users", value: "new" },
  { label: "Older Users", value: "older" },
]

export const kycLevelFilterOptions: FilterOption[] = [
  { label: "All Levels", value: "all" },
  { label: "Level 1", value: "1" },
  { label: "Level 2", value: "2" },
  { label: "Level 3", value: "3" },
]

export const amountTradedFilterOptions: FilterOption[] = [
  { label: "All Amount", value: "all" },
  { label: "Less N100k/$100", value: "lt-100k" },
  { label: "Less N500k/$500", value: "lt-500k" },
  { label: "Less N1M/$1000", value: "lt-1m" },
  { label: "Higher than N1M/$1000", value: "gt-1m" },
]

export const walletBalanceFilterOptions: FilterOption[] = [
  { label: "All Amount", value: "all" },
  { label: "Less N100k", value: "lt-100k" },
  { label: "Less N500k", value: "lt-500k" },
  { label: "Less N1M", value: "lt-1m" },
  { label: "Higher than N1M", value: "gt-1m" },
]
