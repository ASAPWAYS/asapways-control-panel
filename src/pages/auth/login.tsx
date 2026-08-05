import { useState, type FormEvent } from "react"
import { Eye, EyeOff } from "lucide-react"

import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const fieldInputClassName =
  "h-13 rounded-full border-white/15 bg-white/[0.03] px-5 text-white placeholder:text-slate-500 focus-visible:border-sky-500 focus-visible:ring-sky-500/30"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout title="AsapWays Admin">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-normal text-slate-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldInputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="font-normal text-slate-300">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${fieldInputClassName} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-200"
            >
              {showPassword ? (
                <EyeOff className="size-4.5" />
              ) : (
                <Eye className="size-4.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={setRememberMe}
          />
          <Label
            htmlFor="remember-me"
            className="font-normal text-slate-400"
          >
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          className="mt-4 h-13 w-full rounded-full bg-[#152a42] text-slate-400 hover:bg-[#1b3550] hover:text-slate-300"
        >
          Continue
        </Button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
