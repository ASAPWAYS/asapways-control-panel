import { useEffect, useMemo, useState } from "react"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchInput } from "@/components/ui/search-input"
import { FilterSelect } from "@/components/ui/filter-select"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { UsersTable } from "@/components/users/users-table"
import { UserDetailDrawer } from "@/components/users/user-detail-drawer"
import { formatLongDate } from "@/lib/format-date"
import { formatCompactNumber } from "@/lib/format-number"
import { useAuth } from "@/lib/auth/use-auth"
import { listUsers, getUser } from "@/lib/api/users"
import { getUserCounts } from "@/lib/api/analytics"
import { mapApiUserToAppUser, type AdaptedUser } from "@/lib/api/adapters"
import {
  sortOrderOptions,
  kycLevelFilterOptions,
  amountTradedFilterOptions,
  walletBalanceFilterOptions,
} from "@/lib/mock/users"
import type { StatCardData } from "@/lib/types"

const statusTabs = ["all", "unverified", "verified"] as const

function UsersPage() {
  const { request } = useAuth()

  const [statusTab, setStatusTab] = useState<(typeof statusTabs)[number]>("all")
  const [sortOrder, setSortOrder] = useState("all")
  const [kycLevel, setKycLevel] = useState("all")
  const [amountTraded, setAmountTraded] = useState("all")
  const [walletBalance, setWalletBalance] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const [users, setUsers] = useState<AdaptedUser[]>([])
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [userStats, setUserStats] = useState<StatCardData[] | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdaptedUser | null>(null)

  useEffect(() => {
    setPage(1)
  }, [search, kycLevel, sortOrder])

  useEffect(() => {
    let cancelled = false
    const debounce = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await listUsers(request, {
          search: search || undefined,
          tier: kycLevel !== "all" ? Number(kycLevel) : undefined,
          sort: sortOrder === "older" ? "asc" : sortOrder === "new" ? "desc" : undefined,
          page,
          limit: 20,
        })
        if (cancelled) return
        setUsers(result.items.map(mapApiUserToAppUser))
        setTotal(result.total)
        setLimit(result.limit)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load users")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(debounce)
    }
  }, [request, search, kycLevel, sortOrder, page])

  useEffect(() => {
    let cancelled = false
    getUserCounts(request)
      .then((counts) => {
        if (cancelled) return
        const byTierTotal = counts.byTier
          ? Object.values(counts.byTier).reduce((sum, value) => sum + value, 0)
          : undefined
        setUserStats([
          {
            id: "total-users",
            value: formatCompactNumber(counts.total),
            label: "Total Number Of Users",
          },
          {
            id: "verified-users",
            value: formatCompactNumber(counts.verified),
            label: "Verified Users",
          },
          {
            id: "unverified-users",
            value: formatCompactNumber(counts.unverified),
            label: "Unverified Users",
          },
          {
            id: "kyc-registered",
            value: formatCompactNumber(byTierTotal),
            label: "KYC Registered Users",
          },
        ])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [request])

  const filteredUsers = useMemo(() => {
    if (statusTab === "all") return users
    return users.filter((user) => user.status === statusTab)
  }, [statusTab, users])

  async function refreshSelectedUser() {
    if (!selectedUser) return
    const detail = await getUser(request, selectedUser.id).catch(() => null)
    if (detail) setSelectedUser(mapApiUserToAppUser(detail))
  }

  async function handleSelectUser(user: AdaptedUser) {
    setSelectedUser(user)
    const detail = await getUser(request, user.id).catch(() => null)
    if (detail) setSelectedUser(mapApiUserToAppUser(detail))
  }

  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-2xl text-muted-foreground">All,</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            Asapways Users ⚡
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Date</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatLongDate(new Date())}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(userStats ?? Array.from({ length: 4 })).map((card, index) =>
          card ? (
            <StatCard key={card.id} {...card} />
          ) : (
            <div key={index} className="h-23 animate-pulse rounded-2xl bg-card" />
          )
        )}
      </div>

      <div className="rounded-2xl bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs
            value={statusTab}
            onValueChange={(value) =>
              setStatusTab(value as (typeof statusTabs)[number])
            }
          >
            <TabsList variant="line" className="h-auto gap-6 p-0">
              {statusTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="px-0 pb-2 text-sm">
                  {tab === "all"
                    ? "All Users"
                    : tab === "unverified"
                      ? "Unverified Users"
                      : "Verified Users"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button variant="outline" className="h-10 gap-2 rounded-full border-border px-4">
            Filter
            <ChevronDown className="size-3.5" />
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <SearchInput
            placeholder="Search by email, name or phone..."
            className="min-w-56"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <FilterSelect
            label="Sort Order"
            options={sortOrderOptions}
            value={sortOrder}
            onChange={setSortOrder}
          />
          <FilterSelect
            label="KYC Level"
            options={kycLevelFilterOptions}
            value={kycLevel}
            onChange={setKycLevel}
          />
          <FilterSelect
            label="Amount Traded"
            icon={ArrowUpDown}
            options={amountTradedFilterOptions}
            value={amountTraded}
            onChange={setAmountTraded}
          />
          <FilterSelect
            label="Wallet Balance"
            icon={ArrowUpDown}
            options={walletBalanceFilterOptions}
            value={walletBalance}
            onChange={setWalletBalance}
          />
        </div>

        {error ? (
          <p className="mt-4 text-sm text-status-critical">{error}</p>
        ) : null}

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <UsersTable data={filteredUsers} onSelectUser={handleSelectUser} />
          )}
        </div>

        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-6" />
      </div>

      <UserDetailDrawer
        user={selectedUser}
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null)
        }}
        onUserUpdated={refreshSelectedUser}
      />
    </div>
  )
}

export default UsersPage
