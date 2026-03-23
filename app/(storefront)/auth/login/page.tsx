"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profile?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/account")
        }
      }
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 lg:px-8 py-24 flex items-center justify-center">
        <div className="max-w-sm w-full">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-display font-normal tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground font-light mt-2">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none border-black/10 bg-transparent mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none border-black/10 bg-transparent mt-1.5 h-11"
                required
              />
            </div>
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full h-11 btn-rose-gold text-[12px] font-medium tracking-[0.15em] uppercase flex items-center justify-center disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-8 font-light">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-foreground font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
