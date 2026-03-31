"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirm) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      toast.success("Password updated! Redirecting to login...")
      setTimeout(() => router.push("/auth/login"), 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 lg:px-8 py-24 flex items-center justify-center">
        <div className="max-w-sm w-full">
          <div className="text-center mb-10">
            <h1 className="text-[25px] font-display font-normal tracking-tight">Set New Password</h1>
            <p className="text-xs text-muted-foreground font-light mt-2">Enter your new password below</p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">New Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Confirm Password</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 btn-rose-gold text-xs font-medium tracking-[0.15em] uppercase flex items-center justify-center disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
