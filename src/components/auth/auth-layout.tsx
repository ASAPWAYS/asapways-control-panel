import type { ReactNode } from "react"
import { LogoMark } from "@/components/brand/logo-mark"

function AuthLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#05070d]">
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="/assets/auth/auth-leftside-background.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
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
