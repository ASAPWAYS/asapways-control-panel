import type { ReactNode } from "react"
import { Logo } from "@/components/brand/logo"
import { LogoMark } from "@/components/brand/logo-mark"

function AuthLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-black via-[#0b2a4a] to-brand-blue p-12 lg:flex">
        <Logo className="h-9 self-start" />
        <LogoMark
          variant="white"
          className="pointer-events-none absolute -right-16 -bottom-16 h-[420px] opacity-10"
        />
        <div className="relative max-w-md">
          <p className="text-4xl leading-tight font-bold text-white">
            Admin control panel
          </p>
          <p className="mt-3 text-lg text-white/70">
            Manage gift cards, transactions and users in one place.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="flex w-full max-w-sm flex-col items-center">
          <LogoMark className="h-12" />
          <h1 className="mt-4 text-center text-2xl font-bold text-white">
            {title}
          </h1>

          <div className="mt-10 w-full">{children}</div>
        </div>
      </div>
    </div>
  )
}

export { AuthLayout }
