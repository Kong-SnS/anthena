"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, role: "customer" },
        },
      })
      if (error) throw error

      toast.success("Account created! Please check your email to verify.")
      router.push("/auth/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed")
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
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground font-light mt-2">
              Join the Athena community
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Full Name
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Email
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Password
              </Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                className="rounded-none border-gold/15 bg-transparent mt-1.5 h-11"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 btn-rose-gold text-[12px] font-medium tracking-[0.15em] uppercase flex items-center justify-center disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-8 font-light">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-foreground font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
