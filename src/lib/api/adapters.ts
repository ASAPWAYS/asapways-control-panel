import type { ApiUser, ApiUserStatus, ApiDevice } from "@/lib/api/users"
import type { ApiTransaction } from "@/lib/api/transactions"
import type { AppUser, KycLevel } from "@/lib/mock/users"
import type { Transaction, TransactionStatus } from "@/lib/mock/dashboard"
import { formatNaira } from "@/lib/format-number"

export interface AdaptedUser extends AppUser {
  accountStatus: ApiUserStatus
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("en-US")
}

function toKycLevel(tier: number): KycLevel {
  if (tier <= 0) return 0
  if (tier === 2) return 2
  if (tier >= 3) return 3
  return 1
}

function describeDevice(device: ApiDevice) {
  const label = [device.platform, device.model].filter(Boolean).join(" · ")
  return label || "Unknown device"
}

function mapApiUserToAppUser(apiUser: ApiUser): AdaptedUser {
  const name = apiUser.fullName ?? apiUser.username
  const accountStatus: ApiUserStatus = apiUser.deactivatedAt
    ? "inactive"
    : apiUser.isActive
      ? "active"
      : "inactive"

  const currentDevice = apiUser.devices?.[apiUser.devices.length - 1]
  const otherDevices = apiUser.devices?.slice(0, -1) ?? []

  return {
    id: apiUser.id,
    name,
    fullName: apiUser.fullName ?? name,
    username: apiUser.username,
    email: apiUser.email,
    phoneNumber: apiUser.phoneNumber ?? "—",
    kycLevel: toKycLevel(apiUser.tier),
    walletBalance: formatNaira(apiUser.wallet?.balance),
    dateJoined: formatDate(apiUser.createdAt),
    status: apiUser.tier > 0 ? "verified" : "unverified",
    lastUpdated: formatDateTime(apiUser.updatedAt ?? apiUser.createdAt),
    dateCreated: formatDate(apiUser.createdAt),
    dateCreatedFull: formatDateTime(apiUser.createdAt),
    onlineStatus: apiUser.session ? "online" : "offline",
    accountStatus,
    authentication: {
      passwordMasked: "••••••••",
      dateCreated: formatDateTime(apiUser.createdAt),
      bvnNumber: "—",
      ninNumber: "—",
    },
    accountSummary: {
      currentWalletBalance: formatNaira(apiUser.wallet?.balance),
      giftcardsTradedToday: 0,
      withdrawalsToday: 0,
      billPaymentsToday: 0,
      totalGiftcardTransactions: apiUser.counts?.trades ?? 0,
      giftcardTradedMost: "—",
      highestGiftcardTraded: "—",
      totalGiftcardValue: "—",
      totalWithdrawals: apiUser.counts?.withdrawals ?? 0,
      lastWithdrawalDate: "—",
      highestWithdrawal: "—",
      totalWithdrawn:
        apiUser.wallet?.totalWithdrawal !== undefined
          ? formatNaira(apiUser.wallet.totalWithdrawal)
          : "—",
      totalBillsTransactions: apiUser.counts?.bills ?? 0,
      lastBillDate: "—",
      mostUsedBillType: "—",
      totalBillsSpent: "—",
    },
    loginDetails: {
      current: {
        date: formatDateTime(apiUser.session?.lastUsedAt),
        device: apiUser.session?.ipAddress ? `IP ${apiUser.session.ipAddress}` : "—",
      },
      others: (currentDevice ? otherDevices : apiUser.devices ?? []).map((device) => ({
        date: formatDateTime(device.lastSeenAt),
        device: describeDevice(device),
      })),
    },
    transactions: [],
    withdrawals: [],
    bills: [],
  }
}

function mapTransactionStatus(status: ApiTransaction["status"]): TransactionStatus {
  switch (status) {
    case "SUCCESSFUL":
      return "approved"
    case "PENDING":
      return "awaiting-approval"
    default:
      return "failed"
  }
}

function describeTransaction(tx: ApiTransaction): { subject: string; description: string } {
  if (tx.tradeTransactable) {
    const sub = tx.tradeTransactable.giftCardSubCategory
    return {
      subject: sub?.giftcardCategory.name ?? "Gift Card",
      description: sub?.name ?? "Gift card trade",
    }
  }
  if (tx.billTransactable) {
    return {
      subject: tx.billTransactable.billProvider,
      description: `${tx.billTransactable.billType} bill payment`,
    }
  }
  if (tx.walletTransactable) {
    return {
      subject: tx.walletTransactable.walletType,
      description: `Wallet ${tx.walletTransactable.walletType.toLowerCase()}`,
    }
  }
  return { subject: "—", description: tx.transactionType }
}

function mapApiTransaction(tx: ApiTransaction): Transaction {
  const { subject, description } = describeTransaction(tx)
  return {
    id: tx.transactionReference,
    user: tx.user?.fullName ?? tx.user?.username ?? tx.user?.email ?? "—",
    giftcard: subject,
    description,
    amount: formatNaira(tx.amount),
    rate: tx.tradeTransactable ? String(tx.tradeTransactable.rate) : "—",
    status: mapTransactionStatus(tx.status),
    date: formatDateTime(tx.createdAt),
  }
}

export { mapApiUserToAppUser, mapApiTransaction, mapTransactionStatus, describeTransaction }
