"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 lg:px-8 py-24 flex items-center justify-center">
        <div className="max-w-sm w-full">
          {sent ? (
            <div className="text-center">
              <h1 className="text-[25px] font-display font-normal tracking-tight mb-2">Check Your Email</h1>
              <p className="text-base text-muted-foreground font-light mb-8">
                We sent a password reset link to <strong>{email}</strong>. Click the link to set a new password.
              </p>
              <Link href="/auth/login" className="text-xs font-medium hover:underline">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h1 className="text-[25px] font-display font-normal tracking-tight">Forgot Password</h1>
                <p className="text-base text-muted-foreground font-light mt-2">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-11 btn-rose-gold text-xs font-medium tracking-[0.15em] uppercase flex items-center justify-center disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </button>
              </form>

              <p className="text-base text-center text-muted-foreground mt-8 font-light">
                <Link href="/auth/login" className="inline-flex items-center gap-1 text-foreground font-medium hover:underline">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
