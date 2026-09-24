import { API_BASE_URL } from "@/lib/api/client"
import type { Requester, LaravelPage, Paginated } from "@/lib/api/users"

export type TransactionStatus = "PENDING" | "SUCCESSFUL" | "REJECTED" | "FAILED" | "REVERSAL"
export type TransactionType = "TRADE" | "BILL" | "WALLET"

export interface ListTransactionsParams {
  userId?: string
  search?: string
  status?: TransactionStatus
  transactionType?: TransactionType
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  page?: number
  limit?: number
}

export interface ApiGiftcardCategory {
  id: string
  name: string
  status: "ACTIVE" | "INACTIVE"
  slug: string
  image: string | null
  previewImage: string | null
  sortOrder: number
}

export interface ApiGiftcardSubCategory {
  id: string
  name: string
  status: "ACTIVE" | "INACTIVE"
  slug: string
  terms: string | null
  image: string | null
  highRate: boolean
  rate: number
  waitTime: number
  minimumAmount: number
  maximumAmount: number
  sortOrder: number
  giftcardCategory: ApiGiftcardCategory
}

export interface ApiTradeTransactable {
  id: string
  status: TransactionStatus
  amount: number
  rate: number
  attachments: string[]
  remark: string | null
  ecode: string | null
  networkType: string | null
  address: string | null
  giftCardSubCategory: ApiGiftcardSubCategory
}

export interface ApiWalletTransactable {
  id: string
  status: TransactionStatus
  amount: number
  charge: number
  isReversal: boolean
  walletType: string
  bankName: string | null
  accountName: string | null
  accountNumber: string | null
}

export interface ApiBillTransactable {
  id: string
  status: TransactionStatus
  amount: number
  billType: string
  billProvider: string
  productName: string | null
  phoneNumber: string | null
}

export interface ApiTransaction {
  id: string
  status: TransactionStatus
  paymentMethod: string
  entry: "CREDIT" | "DEBIT"
  transactionFee: number
  amount: number
  amountBefore: number
  amountAfter: number
  transactionReference: string
  transactionType: TransactionType
  providerReference: string | null
  narration: string | null
  userId: string
  createdAt: string
  tradeTransactable: ApiTradeTransactable | null
  walletTransactable: ApiWalletTransactable | null
  billTransactable: ApiBillTransactable | null
  user: { id: string; email: string; fullName: string | null; username: string } | null
}

async function listTransactions(request: Requester, params: ListTransactionsParams = {}) {
  const data = await request<{ transactions: LaravelPage<ApiTransaction> }>("/transactions", {
    params,
  })
  const page = data.transactions
  return {
    items: page?.data ?? [],
    page: page?.current_page ?? 1,
    limit: page?.per_page ?? 20,
    total: page?.total ?? 0,
  } satisfies Paginated<ApiTransaction>
}

async function getTransaction(request: Requester, id: string) {
  const data = await request<{ transaction: ApiTransaction }>(`/transactions/${id}`)
  return data.transaction
}

async function exportTransactions(
  token: string,
  params: ListTransactionsParams = {}
): Promise<Blob> {
  const url = new URL(`${API_BASE_URL}/transactions/export`)
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue
    url.searchParams.set(key, String(value))
  }
  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(`Export failed (${response.status})`)
  }
  return response.blob()
}

export { listTransactions, getTransaction, exportTransactions }
