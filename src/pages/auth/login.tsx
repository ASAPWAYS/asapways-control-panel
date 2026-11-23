import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/use-auth"

const fieldInputClassName =
  "h-13 rounded-full border-white/15 bg-white/[0.03] px-5 text-white placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/30"

function LoginPage() {
  const navigate = useNavigate()
  const { requestLoginCode, confirmLoginCode } = useAuth()

  const [step, setStep] = useState<"credentials" | "verify">("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await requestLoginCode(email, password)
      setStep("verify")
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await confirmLoginCode(email, otp, rememberMe)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (step === "verify") {
    return (
      <AuthLayout title="Check your email">
        <form onSubmit={handleVerifySubmit} className="flex flex-col gap-6">
          <p className="text-center text-sm text-muted-foreground">
            We sent a login code to <span className="text-white">{email}</span>
          </p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="otp" className="font-normal text-foreground/80">
              Login code
            </Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className={fieldInputClassName}
            />
          </div>

          {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}

          <Button
            type="submit"
            disabled={submitting || !otp}
            className="mt-4 h-13 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/40 disabled:text-white/60"
          >
            {submitting ? "Verifying…" : "Verify & Continue"}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("credentials")
              setOtp("")
              setError(null)
            }}
            className="text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Use a different account
          </button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Asapways Admin">
      <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-normal text-foreground/80">
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
          <Label htmlFor="password" className="font-normal text-foreground/80">
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
              className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"
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
            className="font-normal text-muted-foreground"
          >
            Remember me
          </Label>
        </div>

        {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}

        <Button
          type="submit"
          disabled={submitting || !email || !password}
          className="mt-4 h-13 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/40 disabled:text-white/60"
        >
          {submitting ? "Sending code…" : "Continue"}
        </Button>
      </form>
    </AuthLayout>
  )
}

function describeError(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return "Something went wrong. Please try again."
}

export default LoginPage
